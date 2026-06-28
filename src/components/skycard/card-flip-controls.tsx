"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function CardFlipControls({
  flipped,
  onFlip,
}: {
  flipped: boolean;
  onFlip: () => void;
}) {
  const t = useTranslations("result");

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="group"
      aria-label={t("cardSideControls")}
    >
      <Button
        type="button"
        variant={!flipped ? "default" : "outline"}
        onClick={!flipped ? undefined : onFlip}
        aria-pressed={!flipped}
        aria-label={t("showFront")}
      >
        <RotateCcw className="size-4" />
        {t("front")}
      </Button>
      <Button
        type="button"
        variant={flipped ? "default" : "outline"}
        onClick={flipped ? undefined : onFlip}
        aria-pressed={flipped}
        aria-label={t("showBack")}
      >
        <RotateCw className="size-4" />
        {t("back")}
      </Button>
    </div>
  );
}
