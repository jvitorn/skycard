"use client";

import type { RefObject } from "react";
import { useState } from "react";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import {
  downloadDataUrl,
  exportVisibleCardAsPng,
} from "@/lib/export/export-card";
import {
  CARD_EXPORT_THEMES,
  DEFAULT_CARD_EXPORT_THEME_ID,
  type CardExportThemeId,
} from "@/lib/export/card-themes";
import { cardImageUrl } from "@/lib/export/image-url";
import { cn } from "@/lib/utils";

export function DownloadDialog({
  analysis,
  cardRef,
}: {
  analysis: SkyCardAnalysis;
  cardRef?: RefObject<HTMLDivElement | null>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<CardExportThemeId>(
    DEFAULT_CARD_EXPORT_THEME_ID
  );
  const cardUrl = cardImageUrl({
    analysis,
    locale,
    kind: "card",
    themeId: selectedThemeId,
  });
  const shareUrl = cardImageUrl({
    analysis,
    locale,
    kind: "share",
    themeId: selectedThemeId,
  });

  async function downloadVisibleCard() {
    if (!cardRef?.current) {
      window.open(cardUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      setPending(true);
      const dataUrl = await exportVisibleCardAsPng(cardRef.current, {
        themeId: selectedThemeId,
      });
      downloadDataUrl(dataUrl, `skycards-${analysis.profile.handle}-card.png`);
      toast.success(t("download.started"));
    } catch {
      window.open(cardUrl, "_blank", "noopener,noreferrer");
      toast.error(t("download.failed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" />}>
        <Download className="size-4" />
        {t("result.download")}
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0B1428] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-black">
            {t("download.title")}
          </DialogTitle>
          <DialogDescription>{t("download.description")}</DialogDescription>
        </DialogHeader>
        <fieldset className="space-y-2">
          <legend
            id="download-theme-label"
            className="font-heading text-sm font-black text-foreground"
          >
            {t("download.themeLabel")}
          </legend>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="download-theme-label"
          >
            {CARD_EXPORT_THEMES.map((theme) => {
              const selected = theme.id === selectedThemeId;

              return (
                <button
                  key={theme.id}
                  type="button"
                  className={cn(
                    "grid size-9 place-items-center rounded-full border border-white/15 bg-white/[.04] outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35",
                    selected && "border-white/70"
                  )}
                  aria-label={t(`download.colors.${theme.id}`)}
                  aria-checked={selected}
                  role="radio"
                  onClick={() => setSelectedThemeId(theme.id)}
                >
                  <span
                    className="size-6 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.swatch }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            {t("download.themeHelp")}
          </p>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-auto flex-col items-start px-4 py-4 text-left"
            disabled={pending}
            onClick={downloadVisibleCard}
          >
            <Download className="size-5" />
            {t("download.cardFormat")}
          </Button>
          <Button
            render={<a href={shareUrl} download={`skycards-${analysis.profile.handle}-share.png`} />}
            variant="secondary"
            className="h-auto flex-col items-start px-4 py-4 text-left"
            onClick={() => toast.success(t("download.started"))}
          >
            <Download className="size-5" />
            {t("download.shareFormat")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
