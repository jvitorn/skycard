import type { SkyCardActivitySummary } from "@/lib/bluesky/types";

import { scaleLog } from "./helpers";

export function calculateActivity(summary: SkyCardActivitySummary): number {
  const weightedActivity =
    summary.originalPosts + summary.repliesSent * 0.85 + summary.repostsSent * 0.25;
  const activitiesPerWeek =
    weightedActivity / Math.max(summary.windowDays / 7, 1);

  return scaleLog(activitiesPerWeek, 35);
}
