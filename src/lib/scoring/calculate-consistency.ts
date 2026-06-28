import type { NormalizedActivity, SkyCardActivitySummary } from "@/lib/bluesky/types";

import { clamp, mean, standardDeviation } from "./helpers";

export function calculateConsistency(
  activities: NormalizedActivity[],
  summary: SkyCardActivitySummary
): number {
  const totalWeeks = Math.max(Math.ceil(summary.windowDays / 7), 1);
  const periodStart = new Date(summary.periodStart).getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyActivityCounts = Array.from({ length: totalWeeks }, () => 0);

  for (const activity of activities) {
    const time = new Date(activity.createdAt).getTime();
    const index = clamp(Math.floor((time - periodStart) / weekMs), 0, totalWeeks - 1);
    weeklyActivityCounts[index] += 1;
  }

  const activeWeeks = weeklyActivityCounts.filter((count) => count > 0).length;
  const activeWeekRatio = activeWeeks / totalWeeks;
  const weeklyMean = mean(weeklyActivityCounts);
  const weeklyVariation =
    standardDeviation(weeklyActivityCounts) / Math.max(weeklyMean, 1);
  const regularity = 1 - clamp(weeklyVariation, 0, 1);

  return activeWeekRatio * 70 + regularity * 30;
}
