"use client";

import { forwardRef } from "react";
import { useTranslations } from "next-intl";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { avatarProxyUrl } from "@/lib/utils/url";

import { SkyCard } from "./sky-card";

export const ShareExportCanvas = forwardRef<
  HTMLDivElement,
  { analysis: SkyCardAnalysis }
>(function ShareExportCanvas({ analysis }, ref) {
  const t = useTranslations();

  return (
    <div
      ref={ref}
      className="export-root pointer-events-none fixed left-[-12000px] top-0 overflow-hidden bg-[#050B18] p-[70px]"
      style={{
        width: 1080,
        height: 1350,
        background:
          "radial-gradient(circle at 20% 12%, rgba(86,214,255,.22), transparent 360px), radial-gradient(circle at 82% 18%, rgba(233,196,106,.2), transparent 340px), linear-gradient(180deg,#050B18,#08142a 62%,#050B18)",
      }}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col items-center justify-between text-center text-white">
        <div>
          <div className="font-heading text-5xl font-black">{t("card.brand")}</div>
          <div className="mt-3 font-sport text-8xl font-black leading-none text-[var(--gold)]">
            {analysis.scores.overall} {t("card.overall")}
          </div>
        </div>
        <SkyCard
          analysis={analysis}
          flipped={false}
          exportMode
          avatar={avatarProxyUrl(analysis.profile.avatar)}
          className="max-w-none w-[590px]"
        />
        <div>
          <div className="font-heading text-5xl font-black">
            {t(`archetypes.${analysis.presentation.archetype}.name`)}
          </div>
          <p className="mt-4 max-w-[760px] text-2xl font-semibold leading-snug text-[#C7D6EC]">
            {t("share.message", { ovr: analysis.scores.overall })}
          </p>
          <div className="mt-7 font-heading text-2xl font-black text-[var(--cyan)]">
            {t("share.cta")}
          </div>
        </div>
      </div>
    </div>
  );
});
