import type { SkyCardPresentation } from "@/lib/bluesky/types";

export function calculateTier(
  overall: number
): SkyCardPresentation["tier"] {
  if (overall >= 90) {
    return "icon";
  }

  if (overall >= 80) {
    return "elite";
  }

  if (overall >= 70) {
    return "rare";
  }

  return "base";
}
