import type { SkyCardActivitySummary, SkyCardProfile } from "@/lib/bluesky/types";

import { scaleLog } from "./helpers";

export function calculateEngagement(
  summary: SkyCardActivitySummary,
  profile: SkyCardProfile
): number {
  const authoredActivities = summary.originalPosts + summary.repliesSent;
  const engagementRate =
    summary.weightedInteractionsReceived /
    (Math.max(authoredActivities, 1) * Math.max(profile.followers, 100));

  return scaleLog(engagementRate * 100, 8);
}
