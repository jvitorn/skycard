"use client";

import { useLocale, useTranslations } from "next-intl";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatShortDate } from "@/lib/utils/dates";
import { formatNumber } from "@/lib/utils/numbers";

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-white/[.04] p-3">
      <div className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-sport text-2xl font-black text-foreground">{value}</div>
    </div>
  );
}

export function AnalysisSummary({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const { activity } = analysis;

  return (
    <section className="space-y-4" aria-labelledby="analysis-summary">
      <div>
        <h2 id="analysis-summary" className="font-heading text-xl font-black">
          {t("result.analysis")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("result.period", {
            start: formatShortDate(activity.periodStart, locale),
            end: formatShortDate(activity.periodEnd, locale),
          })}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SummaryItem
          label={t("result.activitiesAnalyzedLabel")}
          value={formatNumber(activity.activitiesAnalyzed, locale)}
        />
        <SummaryItem label={t("card.originalPosts")} value={formatNumber(activity.originalPosts, locale)} />
        <SummaryItem label={t("card.replies")} value={formatNumber(activity.repliesSent, locale)} />
        <SummaryItem label={t("card.reposts")} value={formatNumber(activity.repostsSent, locale)} />
        <SummaryItem
          label={t("card.uniqueAccounts")}
          value={formatNumber(activity.uniqueAccountsReplied, locale)}
        />
        <SummaryItem
          label={t("card.interactions")}
          value={formatNumber(Math.round(activity.weightedInteractionsReceived), locale)}
        />
      </div>
    </section>
  );
}
