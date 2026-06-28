"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatAccountAge, formatShortDate } from "@/lib/utils/dates";
import { formatCompactNumber, formatNumber, formatPercent } from "@/lib/utils/numbers";

import { CardBadges } from "./card-badges";

function Stat({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[.045] px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </div>
      <div
        className={
          emphasis
            ? "mt-0.5 truncate font-sport text-2xl font-black text-[var(--bd)]"
            : "mt-0.5 truncate font-sport text-xl font-black text-foreground"
        }
      >
        {value}
      </div>
    </div>
  );
}

function PanelDetail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-xs font-black text-foreground">{value}</dd>
    </div>
  );
}

export function SkyCardBack({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const { profile, activity, presentation, scores } = analysis;

  return (
    <section className="skycard-face skycard-back p-[6.5%]" aria-label={t("result.back")}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-heading text-xl font-black">{profile.displayName}</div>
            <div className="truncate text-sm font-semibold text-muted-foreground">
              @{profile.handle}
            </div>
          </div>
          <div className="rounded-[9px] border border-[var(--bd)] bg-white/[.06] px-3 py-1 text-right">
            <div className="font-sport text-3xl font-black leading-none text-[var(--bd)]">
              {scores.overall}
            </div>
            <div className="font-sport text-[10px] font-black tracking-[.18em] text-[var(--bd)]">
              {t("card.overall")}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Stat label={t("card.followers")} value={formatCompactNumber(profile.followers, locale)} emphasis />
          <Stat label={t("card.following")} value={formatCompactNumber(profile.follows, locale)} emphasis />
        </div>

        <div className="mt-3 rounded-[14px] border border-[rgba(86,214,255,.14)] bg-[linear-gradient(180deg,rgba(11,20,40,.82),rgba(9,16,34,.76))] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Sparkles className="size-3" />
              {t(`archetypes.${presentation.archetype}.name`)}
            </Badge>
            <Badge variant="outline">
              {t("result.activitiesAnalyzed", {
                count: formatNumber(activity.activitiesAnalyzed, locale),
              })}
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#C7D6EC]">
            {t(`archetypes.${presentation.archetype}.description`)}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            <PanelDetail
              className="col-span-2"
              label={t("result.periodLabel")}
              value={`${formatShortDate(activity.periodStart, locale)} - ${formatShortDate(
                activity.periodEnd,
                locale
              )}`}
            />
            <PanelDetail label={t("result.tier")} value={t(`tiers.${presentation.tier}`)} />
            <PanelDetail
              label={t("result.confidence")}
              value={formatPercent(presentation.sampleConfidence, locale)}
            />
          </dl>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
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
        </div>

        <CardBadges badges={presentation.badges} limit={3} className="mt-auto justify-center pt-3" />

        <div className="mt-3 flex items-end justify-between gap-3 text-xs text-muted-foreground">
          <div>
            <div className="font-heading text-lg font-black text-foreground">{t("card.brand")}</div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em]">
              {t("card.edition")}
            </div>
          </div>
          <div className="text-right font-semibold">
            {t("card.activityWindow", { days: activity.windowDays })}
          </div>
        </div>
      </div>
    </section>
  );
}
