import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import type { Locale } from "@/lib/i18n/routing";

import type { CardExportThemeId } from "./card-themes";

export function cardImageUrl({
  analysis,
  locale,
  kind,
  themeId,
}: {
  analysis: SkyCardAnalysis;
  locale: Locale | string;
  kind: "card" | "share";
  themeId?: CardExportThemeId;
}): string {
  const params = new URLSearchParams({
    actor: analysis.profile.handle,
    locale,
    kind,
  });

  if (themeId) {
    params.set("theme", themeId);
  }

  return `/api/card-image?${params.toString()}`;
}
