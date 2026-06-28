import type { ArchetypeId, SkyCardScores } from "@/lib/bluesky/types";

type ArchetypeInput = {
  scores: SkyCardScores;
  isRookieMode: boolean;
};

export function calculateArchetype({
  scores,
  isRookieMode,
}: ArchetypeInput): ArchetypeId {
  const { activity: ACT, consistency: CON, engagement: ENG, impact: IMP, replies: RPL, network: NET } = scores;

  if (RPL >= 85 && NET >= 75) {
    return "the-playmaker";
  }

  if (IMP >= 88) {
    return "the-viral-spark";
  }

  if (ENG >= 82 && IMP >= 80) {
    return "the-headliner";
  }

  if (ACT >= 80 && CON >= 80) {
    return "the-broadcaster";
  }

  if (RPL >= 75 && NET >= 75) {
    return "the-community-builder";
  }

  const entries = [
    ["consistency", CON],
    ["replies", RPL],
    ["network", NET],
    ["activity", ACT],
    ["engagement", ENG],
    ["impact", IMP],
  ] as const;
  const highest = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));

  if (highest[0] === "consistency") {
    return "the-consistent-voice";
  }

  if (highest[0] === "replies") {
    return "the-conversationalist";
  }

  if (highest[0] === "network") {
    return "the-community-builder";
  }

  if (isRookieMode) {
    return "the-newcomer";
  }

  return "the-all-rounder";
}
