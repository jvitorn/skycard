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
    <section className="skycard-face p-[6.5%]" aria-label={profile.displayName}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-sport text-[clamp(3rem,18vw,5.8rem)] font-black leading-[0.78] tracking-normal text-[var(--bd)]">
              {scores.overall}
            </div>
            <div className="mt-2 font-sport text-sm font-black tracking-[.18em] text-[var(--accent)]">
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

        <div className="mt-5 flex flex-col items-center text-center">
          <SkyCardAvatar
            name={profile.displayName}
            avatar={avatar}
            alt={t("card.avatarAlt", { name: profile.displayName })}
            className="size-[31%] min-h-24 min-w-24 max-h-32 max-w-32"
          />
          <h2 className="mt-3 max-w-full truncate px-2 font-heading text-[clamp(1.35rem,7vw,2rem)] font-black leading-none">
            {profile.displayName}
          </h2>
          <p className="mt-1 max-w-full truncate px-2 text-sm font-semibold text-muted-foreground">
            @{profile.handle}
          </p>
          <div className="mt-3 rounded-[10px] border border-white/10 bg-white/[.06] px-3 py-1.5 font-heading text-sm font-bold text-[var(--accent)]">
            {archetypeName}
          </div>
          <CardBadges badges={presentation.badges} limit={2} className="mt-3 justify-center" />
        </div>

        <CardAttributes scores={scores} className="mt-4" />

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <div className="font-heading text-lg font-black">{t("card.brand")}</div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
              {t("card.edition")}
            </div>
          </div>
          <div className="text-right font-sport text-lg font-black text-[var(--accent)]">
            {formatCompactNumber(profile.followers, locale)}
          </div>
        </div>
      </div>
    </section>
  );
}
