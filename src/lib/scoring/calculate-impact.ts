import type { NormalizedActivity } from "@/lib/bluesky/types";

import { clamp, median, scaleLog } from "./helpers";

export type ImpactResult = {
  score: number;
  hitPosts: number;
  bestPostInteractions: number;
  bestPostUri?: string;
};

export function calculateImpact(activities: NormalizedActivity[]): ImpactResult {
  const originalPosts = activities.filter((activity) => activity.type === "post");
  const interactions = originalPosts.map((activity) => activity.weightedInteractions);
  const postMedian = median(interactions);
  const hitThreshold = Math.max(5, postMedian * 2);
  const hitPosts = originalPosts.filter(
    (activity) => activity.weightedInteractions >= hitThreshold
  ).length;
  const bestPost = originalPosts.reduce<NormalizedActivity | undefined>(
    (best, activity) =>
      !best || activity.weightedInteractions > best.weightedInteractions
        ? activity
        : best,
    undefined
  );
  const bestPostInteractions = bestPost?.weightedInteractions ?? 0;
  const hitRatio = hitPosts / Math.max(originalPosts.length, 1);
  const hitComponent = clamp((hitRatio / 0.2) * 100, 0, 100);
  const topPostRatio = bestPostInteractions / Math.max(postMedian, 1);
  const topComponent = scaleLog(topPostRatio, 10);

  return {
    score: hitComponent * 0.7 + topComponent * 0.3,
    hitPosts,
    bestPostInteractions,
    bestPostUri: bestPost?.uri,
  };
}
