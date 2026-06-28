import type { SkyCardActivitySummary, SkyCardProfile } from "@/lib/bluesky/types";

import { clamp, scaleLog } from "./helpers";

export function calculateNetwork(
  summary: SkyCardActivitySummary,
  profile: SkyCardProfile
): number {
  const followersComponent = scaleLog(profile.followers, 10000);
  const followRatio = (profile.followers + 10) / (profile.follows + 10);
  const ratioComponent = clamp(((Math.log10(followRatio) + 1) / 2) * 100, 0, 100);
  const connectionsComponent = scaleLog(summary.uniqueAccountsReplied, 50);

  return followersComponent * 0.6 + ratioComponent * 0.2 + connectionsComponent * 0.2;
}
