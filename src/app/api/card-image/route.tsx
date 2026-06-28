import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import type { SkyCardAnalysis, SkyCardPresentation } from "@/lib/bluesky/types";
import type { CardExportTheme } from "@/lib/export/card-themes";
import { isCardExportThemeId, resolveCardExportTheme } from "@/lib/export/card-themes";
import { routing, type Locale } from "@/lib/i18n/routing";
import { analyzeProfile } from "@/lib/scoring/analyze-profile";

type ImageKind = "card" | "share";

const sizeByKind: Record<ImageKind, { width: number; height: number }> = {
  card: { width: 1000, height: 1400 },
  share: { width: 1080, height: 1350 },
};

const tierColors: Record<
  SkyCardPresentation["tier"],
  { c1: string; c2: string; accent: string; accent2: string; ovr: string }
> = {
  base: {
    c1: "#16233c",
    c2: "#0b1426",
    accent: "#86A6D8",
    accent2: "#5E7CA8",
    ovr: "#E6EEFF",
  },
  rare: {
    c1: "#0f3050",
    c2: "#0a1830",
    accent: "#56D6FF",
    accent2: "#168AFF",
    ovr: "#E6FAFF",
  },
  elite: {
    c1: "#1c2350",
    c2: "#0c1228",
    accent: "#B9A6FF",
    accent2: "#E9C46A",
    ovr: "#FFF1D9",
  },
  icon: {
    c1: "#241a3a",
    c2: "#0a1024",
    accent: "#E9C46A",
    accent2: "#56D6FF",
    ovr: "#FFF6DF",
  },
};

const borderColors: Record<
  SkyCardPresentation["border"],
  { border: string; border2: string }
> = {
  rookie: { border: "#168AFF", border2: "#56D6FF" },
  rising: { border: "#56D6FF", border2: "#8B7CFF" },
  established: { border: "#C7D2E0", border2: "#8FA0B8" },
  veteran: { border: "#E9C46A", border2: "#C9A24B" },
  legacy: { border: "#E9C46A", border2: "#8C6A2E" },
};

function initials(name: string): string {
  return name
    .replace(/^@/, "")
    .split(/\s+|\./)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function compactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function imageResponseAvatarUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  return url.endsWith("@jpeg") || url.endsWith("@png") ? url : `${url}@jpeg`;
}

function attrRows(analysis: SkyCardAnalysis) {
  return [
    ["activity", analysis.scores.activity],
    ["consistency", analysis.scores.consistency],
    ["engagement", analysis.scores.engagement],
    ["impact", analysis.scores.impact],
    ["replies", analysis.scores.replies],
    ["network", analysis.scores.network],
  ] as const satisfies ReadonlyArray<readonly [string, number]>;
}

function CardArt({
  analysis,
  locale,
  t,
  width,
  height,
  showDetails = true,
  exportTheme,
}: {
  analysis: SkyCardAnalysis;
  locale: Locale;
  t: Awaited<ReturnType<typeof getTranslations>>;
  width: number;
  height: number;
  showDetails?: boolean;
  exportTheme?: CardExportTheme;
}) {
  const tier = tierColors[analysis.presentation.tier];
  const border = borderColors[analysis.presentation.border];
  const cardStart = exportTheme?.cardStart ?? tier.c1;
  const cardEnd = exportTheme?.cardEnd ?? tier.c2;
  const cardBase = exportTheme?.background ?? "#060B18";
  const archetype = t(`archetypes.${analysis.presentation.archetype}.name`);
  const name = analysis.profile.displayName;
  const tierLine = `${t("card.overall")} · ${t(`tiers.${analysis.presentation.tier}`).toUpperCase()}`;
  const handleLine = `@${analysis.profile.handle}`;
  const avatarUrl = imageResponseAvatarUrl(analysis.profile.avatar);
  const isSmall = width < 700;
  const pad = isSmall ? 34 : 66;
  const avatarSize = isSmall ? 116 : 170;
  const attrGap = isSmall ? 10 : 18;
  const attrPadding = isSmall ? 10 : 20;
  const attrWidth = (width - pad * 2 - attrGap) / 2 - attrPadding * 2 - 4;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        borderRadius: 54,
        border: `7px solid ${border.border}`,
        background: `linear-gradient(160deg, ${cardStart}, ${cardEnd} 64%, ${cardBase})`,
        color: "#F7FAFF",
        padding: pad,
        boxShadow: `0 0 0 4px rgba(255,255,255,.12) inset, 0 0 70px ${exportTheme?.glow ?? `${border.border}66`}`,
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 2px, transparent 2px 18px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: isSmall ? 94 : 140, lineHeight: 0.78, fontWeight: 900, color: border.border }}>
            {analysis.scores.overall}
          </div>
          <div
            style={{
              marginTop: isSmall ? 18 : 26,
              display: "flex",
              fontSize: isSmall ? 20 : 27,
              letterSpacing: isSmall ? 5 : 8,
              fontWeight: 900,
              color: tier.accent,
            }}
          >
            {tierLine}
          </div>
        </div>
        <div
          style={{
            minHeight: isSmall ? 44 : 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isSmall ? "8px 14px" : "12px 24px",
            borderRadius: 16,
            border: `3px solid ${border.border}`,
            color: border.border,
            fontSize: isSmall ? 19 : 22,
            letterSpacing: isSmall ? 2 : 3,
            fontWeight: 900,
            background: "rgba(0,0,0,.22)",
          }}
        >
          {t(`borders.${analysis.presentation.border}`)}
        </div>
      </div>

      <div
        style={{
          marginTop: isSmall ? 30 : 58,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: 999,
            border: `6px solid ${border.border}`,
            background: `linear-gradient(140deg, ${tier.accent}, ${tier.accent2})`,
            color: "#06101F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isSmall ? 42 : 56,
            fontWeight: 900,
            overflow: "hidden",
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={avatarSize}
              height={avatarSize}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: 999,
                objectFit: "cover",
              }}
            />
          ) : (
            initials(name)
          )}
        </div>
        <div
          style={{
            marginTop: isSmall ? 22 : 32,
            display: "flex",
            justifyContent: "center",
            maxWidth: "100%",
            fontSize: isSmall ? (name.length > 18 ? 34 : 42) : name.length > 18 ? 52 : 60,
            fontWeight: 900,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: isSmall ? 8 : 12,
            display: "flex",
            justifyContent: "center",
            fontSize: isSmall ? 20 : 26,
            color: "#9AA9C1",
            fontWeight: 700,
          }}
        >
          {handleLine}
        </div>
        <div
          style={{
            marginTop: isSmall ? 16 : 22,
            display: "flex",
            justifyContent: "center",
            padding: "16px 24px",
            borderRadius: 18,
            border: "2px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.07)",
            color: tier.accent,
            fontSize: isSmall ? 22 : 27,
            fontWeight: 900,
          }}
        >
          {archetype}
        </div>
      </div>

      {showDetails ? (
        <div
          style={{
            marginTop: 38,
            display: "flex",
            flexWrap: "wrap",
            gap: attrGap,
            position: "relative",
          }}
        >
          {attrRows(analysis).map(([key, value]) => (
            <div
              key={key}
              style={{
                width: attrWidth,
                borderRadius: 18,
                border: "2px solid rgba(255,255,255,.12)",
                background: "rgba(255,255,255,.06)",
                padding: attrPadding,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    color: tier.accent,
                    display: "flex",
                    fontSize: 25,
                    letterSpacing: 5,
                    fontWeight: 900,
                  }}
                >
                  {t(`attributes.${key}.code`)}
                </div>
                <div style={{ marginTop: 7, display: "flex", color: "#9AA9C1", fontSize: 18, fontWeight: 700 }}>
                  {t(`attributes.${key}.name`)}
                </div>
              </div>
              <div style={{ display: "flex", color: border.border, fontSize: 44, fontWeight: 900 }}>{value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {showDetails ? (
        <div
          style={{
            marginTop: 34,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 900 }}>{t("card.brand")}</div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                color: "#9AA9C1",
                fontSize: 18,
                letterSpacing: 6,
                fontWeight: 900,
              }}
            >
              {t("card.edition").toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", color: tier.accent, fontSize: 34, fontWeight: 900 }}>
            {compactNumber(analysis.profile.followers, locale)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ShareArt({
  analysis,
  locale,
  t,
  exportTheme,
}: {
  analysis: SkyCardAnalysis;
  locale: Locale;
  t: Awaited<ReturnType<typeof getTranslations>>;
  exportTheme?: CardExportTheme;
}) {
  const overallLine = `${analysis.scores.overall} ${t("card.overall")}`;
  const background = exportTheme
    ? `radial-gradient(circle at 20% 12%, ${exportTheme.glow}, transparent 360px), radial-gradient(circle at 82% 18%, rgba(255,255,255,.12), transparent 340px), linear-gradient(180deg,${exportTheme.background},${exportTheme.cardEnd} 62%,${exportTheme.background})`
    : "radial-gradient(circle at 20% 12%, rgba(86,214,255,.22), transparent 360px), radial-gradient(circle at 82% 18%, rgba(233,196,106,.2), transparent 340px), linear-gradient(180deg,#050B18,#08142a 62%,#050B18)";

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 70,
        background,
        color: "#F7FAFF",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 54, fontWeight: 900 }}>{t("card.brand")}</div>
        <div style={{ marginTop: 12, display: "flex", color: borderColors[analysis.presentation.border].border, fontSize: 92, fontWeight: 900 }}>
          {overallLine}
        </div>
      </div>

      <CardArt
        analysis={analysis}
        locale={locale}
        t={t}
        width={520}
        height={728}
        showDetails={false}
        exportTheme={exportTheme}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 50, fontWeight: 900 }}>
          {t(`archetypes.${analysis.presentation.archetype}.name`)}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            maxWidth: 780,
            color: "#C7D6EC",
            fontSize: 30,
            lineHeight: 1.25,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          {t("share.message", { ovr: analysis.scores.overall })}
        </div>
        <div style={{ marginTop: 28, display: "flex", color: "#56D6FF", fontSize: 28, fontWeight: 900 }}>
          {t("share.cta")}
        </div>
      </div>
    </div>
  );
}

function FallbackImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        background: "#050B18",
        color: "#F7FAFF",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", fontSize: 72, fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 28, display: "flex", fontSize: 32, lineHeight: 1.35, color: "#56D6FF" }}>
        {description}
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const actor = request.nextUrl.searchParams.get("actor");
  const kindParam = request.nextUrl.searchParams.get("kind");
  const localeParam = request.nextUrl.searchParams.get("locale");
  const themeParam = request.nextUrl.searchParams.get("theme");
  const locale = hasLocale(routing.locales, localeParam)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  const kind: ImageKind = kindParam === "share" ? "share" : "card";
  const exportTheme = isCardExportThemeId(themeParam)
    ? resolveCardExportTheme(themeParam)
    : undefined;
  const size = sizeByKind[kind];
  const t = await getTranslations({ locale });

  if (!actor) {
    return new ImageResponse(
      <FallbackImage title={t("meta.genericTitle")} description={t("meta.genericDescription")} />,
      size
    );
  }

  try {
    const analysis = await analyzeProfile(actor);

    return new ImageResponse(
      kind === "card" ? (
        <CardArt
          analysis={analysis}
          locale={locale}
          t={t}
          width={size.width}
          height={size.height}
          exportTheme={exportTheme}
        />
      ) : (
        <ShareArt analysis={analysis} locale={locale} t={t} exportTheme={exportTheme} />
      ),
      {
        ...size,
        headers: {
          "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
          "content-disposition": `inline; filename="skycards-${analysis.profile.handle}-${kind}.png"`,
        },
      }
    );
  } catch {
    return new ImageResponse(
      <FallbackImage title={t("meta.genericTitle")} description={t("meta.genericDescription")} />,
      size
    );
  }
}
