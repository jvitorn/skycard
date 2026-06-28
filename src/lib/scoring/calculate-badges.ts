import type { BadgeId, SkyCardActivitySummary, SkyCardPresentation, SkyCardScores } from "@/lib/bluesky/types";

export function calculateBadges({
  scores,
  summary,
  border,
  isRookieMode,
}: {
  scores: SkyCardScores;
  summary: SkyCardActivitySummary;
  border: SkyCardPresentation["border"];
  isRookieMode: boolean;
}): BadgeId[] {
  const badges: BadgeId[] = [];

  if (border === "legacy") {
    badges.push("legacy-member");
  }

  if (scores.impact >= 88 || summary.hitPosts >= 5) {
    badges.push("viral-spark");
  }

  if (scores.replies >= 85) {
    badges.push("conversation-starter");
  }

  if (scores.consistency >= 85) {
    badges.push("consistent-player");
  }

  if (scores.network >= 82 && summary.uniqueAccountsReplied >= 15) {
    badges.push("community-builder");
  }

  if (isRookieMode) {
    badges.push("rookie");
  }

  return badges;
}
