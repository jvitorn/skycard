"use client";

import { useState } from "react";
import { Clipboard, Link as LinkIcon, Share2 } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { cardImageUrl } from "@/lib/export/image-url";

export function ShareDialog({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const message = t("share.message", { ovr: analysis.scores.overall });
  const shareUrl = cardImageUrl({ analysis, locale, kind: "share" });

  async function nativeShare() {
    try {
      setPending(true);
      const blob = await fetch(shareUrl).then((response) => response.blob());
      const file = new File([blob], `skycards-${analysis.profile.handle}.png`, {
        type: "image/png",
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "SkyCards",
          text: message,
          url: window.location.href,
        });
      } else {
        toast.message(t("share.unsupported"));
        window.open(shareUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast.error(t("share.failed"));
    } finally {
      setPending(false);
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success(t("share.copied"));
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        <Share2 className="size-4" />
        {t("result.share")}
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0B1428] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-black">
            {t("share.title")}
          </DialogTitle>
          <DialogDescription>{t("share.description")}</DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" disabled={pending} onClick={nativeShare}>
            <Share2 className="size-4" />
            {t("share.native")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => copy(window.location.href)}
          >
            <LinkIcon className="size-4" />
            {t("share.copyLink")}
          </Button>
          <Button type="button" variant="outline" onClick={() => copy(message)}>
            <Clipboard className="size-4" />
            {t("share.copyMessage")}
          </Button>
          <Button
            render={<a href={shareUrl} download={`skycards-${analysis.profile.handle}-share.png`} />}
            variant="secondary"
            onClick={() => toast.success(t("download.started"))}
          >
            <Share2 className="size-4" />
            {t("result.downloadShare")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
