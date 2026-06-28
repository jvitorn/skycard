"use client";

import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatCompactNumber } from "@/lib/utils/numbers";

import { CardBadges } from "../skycard/card-badges";

function initials(name: string): string {
  return name
    .split(/\s+|\./)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();
}

export function ResultHeader({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const { profile, presentation, scores } = analysis;

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-white/10 bg-white/[.035] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-14 border border-[rgba(86,214,255,.35)]">
          <AvatarImage src={profile.avatar} alt={t("card.avatarAlt", { name: profile.displayName })} />
          <AvatarFallback className="bg-[linear-gradient(140deg,var(--cyan),var(--gold))] font-heading font-black text-[#06101f]">
            {initials(profile.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl font-black">{profile.displayName}</h1>
          <p className="truncate text-sm font-semibold text-muted-foreground">@{profile.handle}</p>
          <p className="mt-1 text-sm font-bold text-[var(--cyan)]">
            {t(`archetypes.${presentation.archetype}.name`)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Badge variant="secondary">{t(`tiers.${presentation.tier}`)}</Badge>
        <Badge>{t(`borders.${presentation.border}`)}</Badge>
        <div className="rounded-[12px] border border-[rgba(233,196,106,.35)] bg-[rgba(233,196,106,.1)] px-4 py-2 text-right">
          <div className="font-sport text-4xl font-black leading-none text-[var(--gold)]">
            {scores.overall}
          </div>
          <div className="font-sport text-xs font-black tracking-[.18em] text-[var(--gold)]">
            {t("card.overall")}
          </div>
        </div>
        <div className="hidden w-full basis-full sm:block" />
        <CardBadges badges={presentation.badges} limit={2} />
        <div className="text-xs font-semibold text-muted-foreground">
          {formatCompactNumber(profile.followers, locale)} {t("card.followers").toLowerCase()}
        </div>
      </div>
    </div>
  );
}
