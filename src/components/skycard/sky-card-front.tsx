"use client";

import { useLocale, useTranslations } from "next-intl";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatCompactNumber } from "@/lib/utils/numbers";

import { CardAttributes } from "./card-attributes";
import { CardBadges } from "./card-badges";
import { SkyCardAvatar } from "./sky-card-avatar";

export function SkyCardFront({
  analysis,
  avatar,
}: {
  analysis: SkyCardAnalysis;
  avatar?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { profile, scores, presentation } = analysis;
  const archetypeName = t(`archetypes.${presentation.archetype}.name`);
  const borderLabel = t(`borders.${presentation.border}`);
  const tierLabel = t(`tiers.${presentation.tier}`);

  return (
    <section className="skycard-face px-[6.5%] py-[5.2%]" aria-label={profile.displayName}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-sport text-[clamp(2.5rem,18cqw,5rem)] font-black leading-[0.78] tracking-normal text-[var(--bd)]">
              {scores.overall}
            </div>
            <div className="mt-2 font-sport text-xs font-black tracking-[.18em] text-[var(--accent)]">
              {t("card.overall")} · {tierLabel.toUpperCase()}
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="rounded-[9px] border border-[var(--bd)] bg-black/20 px-2.5 py-1 font-sport text-xs font-black tracking-[.12em] text-[var(--bd)]">
              {borderLabel}
            </div>
            {presentation.joinedYear && presentation.border === "legacy" ? (
              <div className="text-xs font-bold text-[var(--gold)]">
                {t("card.legacySince", { year: presentation.joinedYear })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center text-center">
          <SkyCardAvatar
            name={profile.displayName}
            avatar={avatar}
            alt={t("card.avatarAlt", { name: profile.displayName })}
            className="w-[28cqw] h-[28cqw] min-w-[84px] min-h-[84px] max-w-[110px] max-h-[110px]"
          />
          <h2 className="mt-2 max-w-full truncate px-2 font-heading text-[clamp(1.15rem,6vw,1.75rem)] font-black leading-none">
            {profile.displayName}
          </h2>
          <p className="mt-1 max-w-full truncate px-2 text-xs font-semibold text-muted-foreground">
            @{profile.handle}
          </p>
          <div className="mt-2 rounded-[10px] border border-white/10 bg-white/[.06] px-3 py-1 font-heading text-xs font-bold text-[var(--accent)]">
            {archetypeName}
          </div>
          <CardBadges badges={presentation.badges} limit={2} className="mt-2 justify-center" />
        </div>

        <CardAttributes scores={scores} compact className="mt-3" />

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="font-heading text-sm font-black">{t("card.brand")}</div>
          <div className="font-sport text-sm font-black text-[var(--accent)]">
            {formatCompactNumber(profile.followers, locale)}
          </div>
        </div>
      </div>
    </section>
  );
}
