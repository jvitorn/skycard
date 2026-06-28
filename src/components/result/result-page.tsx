"use client";

import { useRef, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandleForm } from "@/components/landing/handle-form";
import { CardFlipControls } from "@/components/skycard/card-flip-controls";
import { SkyCard } from "@/components/skycard/sky-card";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import type { Locale } from "@/lib/i18n/routing";
import { formatShortDate } from "@/lib/utils/dates";
import { formatNumber, formatPercent } from "@/lib/utils/numbers";
import { avatarProxyUrl } from "@/lib/utils/url";

import { AnalysisSummary } from "./analysis-summary";
import { AttributeBreakdown } from "./attribute-breakdown";
import { DownloadDialog } from "./download-dialog";
import { ResultHeader } from "./result-header";
import { RookieNotice } from "./rookie-notice";
import { ShareDialog } from "./share-dialog";

export function ResultPage({
  analysis,
  locale,
}: {
  analysis: SkyCardAnalysis;
  locale: Locale;
}) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const proxiedAvatar = avatarProxyUrl(analysis.profile.avatar);

  return (
    <div className="star-field pb-24 md:pb-0">
      <section className="sky-container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(300px,440px)_1fr] md:items-start">
          <div className="order-1 flex flex-col items-center gap-5 md:sticky md:top-24">
            <SkyCard
              ref={cardRef}
              analysis={analysis}
              flipped={flipped}
              onFlip={() => setFlipped((value) => !value)}
              avatar={proxiedAvatar}
              className="max-w-[min(88vw,410px)]"
            />
            <CardFlipControls flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
            <div className="hidden gap-3 md:flex">
              <DownloadDialog analysis={analysis} cardRef={cardRef} />
              <ShareDialog analysis={analysis} />
            </div>
          </div>

          <div className="order-2 space-y-6">
            <div>
              <ResultHeader analysis={analysis} />
            </div>

            {analysis.presentation.isRookieMode ? <RookieNotice /> : null}

            <div className="sky-panel rounded-[16px] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  <Sparkles className="size-3" />
                  {t(`archetypes.${analysis.presentation.archetype}.name`)}
                </Badge>
                <Badge variant="outline">
                  {t("result.activitiesAnalyzed", {
                    count: formatNumber(analysis.activity.activitiesAnalyzed, currentLocale),
                  })}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#C7D6EC]">
                {t(`archetypes.${analysis.presentation.archetype}.description`)}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div>
                  <span className="font-bold text-foreground">{t("result.periodLabel")}: </span>
                  {formatShortDate(analysis.activity.periodStart, currentLocale)} -{" "}
                  {formatShortDate(analysis.activity.periodEnd, currentLocale)}
                </div>
                <div>
                  <span className="font-bold text-foreground">{t("result.tier")}: </span>
                  {t(`tiers.${analysis.presentation.tier}`)}
                </div>
                <div>
                  <span className="font-bold text-foreground">{t("result.confidence")}: </span>
                  {formatPercent(analysis.presentation.sampleConfidence, currentLocale)}
                </div>
              </div>
            </div>

            <AttributeBreakdown analysis={analysis} />
            <AnalysisSummary analysis={analysis} />

            <section id="methodology" className="sky-panel rounded-[16px] p-5">
              <h2 className="font-heading text-xl font-black">{t("methodology.title")}</h2>
              <p className="mt-2 text-sm leading-6 text-[#C7D6EC]">{t("methodology.intro")}</p>
              <Dialog>
                <DialogTrigger render={<Button type="button" variant="outline" className="mt-4" />}>
                  {t("methodology.title")}
                </DialogTrigger>
                <DialogContent className="border-white/10 bg-[#0B1428] sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl font-black">
                      {t("methodology.title")}
                    </DialogTitle>
                    <DialogDescription>{t("methodology.intro")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 text-sm leading-6 text-[#C7D6EC]">
                    <p>{t("methodology.activity")}</p>
                    <p>{t("methodology.consistency")}</p>
                    <p>{t("methodology.engagement")}</p>
                    <p>{t("methodology.impact")}</p>
                    <p>{t("methodology.replies")}</p>
                    <p>{t("methodology.network")}</p>
                    <p>{t("methodology.overall")}</p>
                    <p>{t("methodology.tierBorder")}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </section>

            <section className="sky-panel rounded-[16px] p-5">
              <h2 className="font-heading text-xl font-black">{t("result.createAnother")}</h2>
              <div className="mt-4">
                <HandleForm locale={locale} compact />
              </div>
            </section>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#050B18]/90 p-3 backdrop-blur-xl md:hidden"
        aria-label={t("result.stickyActions")}
      >
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <DownloadDialog analysis={analysis} cardRef={cardRef} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href = locale === "en" ? "/" : `/${locale}`;
            }}
          >
            <Plus className="size-4" />
            {t("result.newCard")}
          </Button>
        </div>
      </div>
    </div>
  );
}
