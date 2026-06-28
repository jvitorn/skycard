"use client";

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
import { cardImageUrl } from "@/lib/export/image-url";

export function DownloadDialog({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const cardUrl = cardImageUrl({ analysis, locale, kind: "card" });
  const shareUrl = cardImageUrl({ analysis, locale, kind: "share" });

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
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            render={<a href={cardUrl} download={`skycards-${analysis.profile.handle}-card.png`} />}
            variant="outline"
            className="h-auto flex-col items-start px-4 py-4 text-left"
            onClick={() => toast.success(t("download.started"))}
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
