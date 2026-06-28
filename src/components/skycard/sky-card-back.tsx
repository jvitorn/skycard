"use client";

import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatAccountAge, formatShortDate } from "@/lib/utils/dates";
import { formatCompactNumber, formatNumber } from "@/lib/utils/numbers";

import { ATTRIBUTE_KEYS } from "./card-attributes";
import { CardBadges } from "./card-badges";

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[.045] px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 truncate font-sport text-xl font-black text-[var(--ovr)]">
        {value}
      </div>
    </div>
  );
}

export function SkyCardBack({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const { profile, activity, presentation } = analysis;

  return (
    <section className="skycard-face skycard-back p-[7%]" aria-label={t("result.back")}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-heading text-xl font-black">{t("card.brand")}</div>
            <div className="truncate text-sm font-semibold text-muted-foreground">
              @{profile.handle}
            </div>
          </div>
          <div className="rounded-[9px] border border-[var(--accent)] bg-white/[.06] px-3 py-1 font-sport text-sm font-black tracking-[.12em] text-[var(--accent)]">
            {analysis.scores.overall} {t("card.overall")}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat
            label={t("result.joined")}
            value={
              profile.createdAt
                ? formatShortDate(profile.createdAt, locale)
                : t("card.noDate")
            }
          />
          <Stat
            label={t("result.accountAge")}
            value={formatAccountAge(profile.createdAt, locale)}
          />
          <Stat label={t("card.followers")} value={formatCompactNumber(profile.followers, locale)} />
          <Stat label={t("card.following")} value={formatCompactNumber(profile.follows, locale)} />
          <Stat label={t("card.originalPosts")} value={formatNumber(activity.originalPosts, locale)} />
          <Stat label={t("card.replies")} value={formatNumber(activity.repliesSent, locale)} />
          <Stat label={t("card.reposts")} value={formatNumber(activity.repostsSent, locale)} />
          <Stat
            label={t("card.uniqueAccounts")}
            value={formatNumber(activity.uniqueAccountsReplied, locale)}
          />
          <Stat
            label={t("card.interactions")}
            value={formatCompactNumber(Math.round(activity.weightedInteractionsReceived), locale)}
          />
          <Stat label={t("card.hitPosts")} value={formatNumber(activity.hitPosts, locale)} />
        </div>

        <div className="mt-4 rounded-[12px] border border-white/10 bg-black/15 p-3">
          <div className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--accent)]">
            {t(`archetypes.${presentation.archetype}.name`)}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#C7D6EC]">
            {t(`archetypes.${presentation.archetype}.description`)}
          </p>
        </div>

        <CardBadges badges={presentation.badges} className="mt-3" />

        <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("result.activitiesAnalyzed", {
            count: formatNumber(activity.activitiesAnalyzed, locale),
          })}
          {" · "}
          {t("card.activityWindow", { days: activity.windowDays })}
        </div>

        {activity.bestPostUri ? (
          <a
            href={activity.bestPostUri}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--cyan)]"
          >
            {t("result.openBestPost")}
            <ExternalLink className="size-3" />
          </a>
        ) : null}

        <Separator className="my-3 bg-white/10" />

        <div className="grid grid-cols-3 gap-1.5">
          {ATTRIBUTE_KEYS.map((key) => (
            <div key={key} className="rounded-[8px] bg-white/[.04] px-2 py-1">
              <div className="font-sport text-xs font-black text-[var(--accent)]">
                {t(`attributes.${key}.code`)}
              </div>
              <div className="truncate text-[9px] font-semibold text-muted-foreground">
                {t(`attributes.${key}.name`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
