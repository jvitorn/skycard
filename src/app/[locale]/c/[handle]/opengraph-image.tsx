import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { isSkyCardError } from "@/lib/bluesky/errors";
import { analyzeProfile } from "@/lib/scoring/analyze-profile";
import { routing, type Locale } from "@/lib/i18n/routing";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale: localeParam, handle } = await params;
  const locale = hasLocale(routing.locales, localeParam)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale });

  try {
    const analysis = await analyzeProfile(handle);
    const name = analysis.profile.displayName;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#050B18",
            color: "#F7FAFF",
            padding: 58,
            gap: 44,
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              width: 270,
              height: 378,
              borderRadius: 28,
              border: "4px solid #E9C46A",
              background: "linear-gradient(160deg,#241a3a,#0a1024)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 28,
              boxShadow: "0 0 40px rgba(233,196,106,.35)",
            }}
          >
            <div style={{ fontSize: 88, fontWeight: 900, color: "#FFF6DF", lineHeight: 0.8 }}>
              {analysis.scores.overall}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#E9C46A" }}>
              {t(`tiers.${analysis.presentation.tier}`)} · {t("card.overall")}
            </div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 999,
                background: "#E9C46A",
                color: "#06101F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 900,
              }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>SkyCards</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            <div style={{ fontSize: 30, color: "#56D6FF", fontWeight: 800 }}>
              SkyCards
            </div>
            <div style={{ fontSize: 68, lineHeight: 1, fontWeight: 900 }}>{name}</div>
            <div style={{ fontSize: 28, color: "#9AA9C1" }}>@{analysis.profile.handle}</div>
            <div style={{ fontSize: 42, color: "#E9C46A", fontWeight: 900 }}>
              {t(`archetypes.${analysis.presentation.archetype}.name`)}
            </div>
            <div style={{ fontSize: 26, color: "#C7D6EC", lineHeight: 1.35 }}>
              {t("share.cta")}
            </div>
          </div>
        </div>
      ),
      size
    );
  } catch (error) {
    const title = isSkyCardError(error)
      ? t("meta.genericTitle")
      : t("meta.genericTitle");

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 20,
            background: "#050B18",
            color: "#F7FAFF",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#56D6FF" }}>{t("meta.genericDescription")}</div>
        </div>
      ),
      size
    );
  }
}
