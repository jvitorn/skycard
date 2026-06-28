import type { SkyCardActivitySummary } from "@/lib/bluesky/types";

import { clamp, scaleLog } from "./helpers";

export function calculateReplies(summary: SkyCardActivitySummary): number {
  const replyShare =
    summary.externalReplies /
    Math.max(summary.originalPosts + summary.externalReplies, 1);
  const shareComponent = clamp((replyShare / 0.5) * 100, 0, 100);
  const uniqueComponent = scaleLog(summary.uniqueAccountsReplied, 25);
  const repliesPerWeek = summary.externalReplies / Math.max(summary.windowDays / 7, 1);
  const frequencyComponent = scaleLog(repliesPerWeek, 20);

  return shareComponent * 0.4 + uniqueComponent * 0.35 + frequencyComponent * 0.25;
}
