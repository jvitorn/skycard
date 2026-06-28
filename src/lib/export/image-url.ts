import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import type { Locale } from "@/lib/i18n/routing";

export function cardImageUrl({
  analysis,
  locale,
  kind,
}: {
  analysis: SkyCardAnalysis;
  locale: Locale | string;
  kind: "card" | "share";
}): string {
  const params = new URLSearchParams({
    actor: analysis.profile.handle,
    locale,
    kind,
  });

  return `/api/card-image?${params.toString()}`;
}
