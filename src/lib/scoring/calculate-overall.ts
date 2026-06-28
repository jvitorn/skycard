import type { SkyCardScores } from "@/lib/bluesky/types";

import { clamp } from "./helpers";

export function calculateOverall(
  scores: Omit<SkyCardScores, "overall">
): number {
  const rawOverall =
    scores.activity * 0.15 +
    scores.consistency * 0.15 +
    scores.engagement * 0.2 +
    scores.impact * 0.2 +
    scores.replies * 0.15 +
    scores.network * 0.15;

  return Math.round(60 + clamp(rawOverall, 0, 100) * 0.39);
}
