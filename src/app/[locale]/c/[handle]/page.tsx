import { cache } from "react";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ResultPage } from "@/components/result/result-page";
import { ResultState } from "@/components/states/result-state";
import { isSkyCardError } from "@/lib/bluesky/errors";
import { normalizeActorInput } from "@/lib/bluesky/normalize-actor";
import { analyzeProfile } from "@/lib/scoring/analyze-profile";
import { routing, type Locale } from "@/lib/i18n/routing";
import { cardPath, getSiteUrl } from "@/lib/utils/url";

const getAnalysis = cache((handle: string) => analyzeProfile(handle));
const uncachedResultCodes = new Set([
  "public_opt_out",
  "unavailable",
  "timeout",
  "invalid_response",
  "rate_limited",
]);
const retryWithoutCacheCodes = new Set([
  "unavailable",
  "timeout",
  "invalid_response",
  "rate_limited",
]);

function noStoreResultState(error: unknown) {
  if (!isSkyCardError(error) || uncachedResultCodes.has(error.code)) {
    noStore();
  }
}

async function getAnalysisWithFreshRetry(handle: string) {
  try {
    return await getAnalysis(handle);
  } catch (error) {
    if (!isSkyCardError(error) || !retryWithoutCacheCodes.has(error.code)) {
      throw error;
    }

    noStore();
    return analyzeProfile(handle, { cache: "no-store" });
  }
}

type CardParams = {
  locale: string;
  handle: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<CardParams>;
}): Promise<Metadata> {
  const { locale: localeParam, handle } = await params;
  const locale = hasLocale(routing.locales, localeParam)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = getSiteUrl();
  const normalized = (() => {
    try {
      return normalizeActorInput(decodeURIComponent(handle));
    } catch {
      return handle;
    }
  })();
  const canonical = `${siteUrl}${cardPath(locale, normalized)}`;

  try {
    const analysis = await getAnalysisWithFreshRetry(handle);
    const name = analysis.profile.displayName;
    const archetype = (await getTranslations({ locale, namespace: "archetypes" }))(
      `${analysis.presentation.archetype}.name`
    );
    const title = t("cardTitle", { name });
    const description = t("cardDescription", {
      name,
      ovr: analysis.scores.overall,
      archetype,
    });

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        images: [`${canonical}/opengraph-image`],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${canonical}/opengraph-image`],
      },
    };
  } catch (error) {
    noStoreResultState(error);

    return {
      title: t("genericTitle"),
      description: t("genericDescription"),
      alternates: {
        canonical,
      },
      openGraph: {
        title: t("genericTitle"),
        description: t("genericDescription"),
        url: canonical,
      },
      twitter: {
        card: "summary_large_image",
        title: t("genericTitle"),
        description: t("genericDescription"),
      },
    };
  }
}

export default async function CardPage({
  params,
}: {
  params: Promise<CardParams>;
}) {
  const { locale: localeParam, handle } = await params;
  const locale = hasLocale(routing.locales, localeParam)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  setRequestLocale(locale);
  let analysis: Awaited<ReturnType<typeof getAnalysis>>;

  try {
    analysis = await getAnalysisWithFreshRetry(handle);
  } catch (error) {
    noStoreResultState(error);

    if (isSkyCardError(error)) {
      return <ResultState code={error.code} locale={locale} />;
    }

    return <ResultState code="unavailable" locale={locale} />;
  }

  return <ResultPage analysis={analysis} locale={locale} />;
}
