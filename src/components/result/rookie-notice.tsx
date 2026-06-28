"use client";

import { Sprout } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RookieNotice() {
  const t = useTranslations("result");

  return (
    <Alert>
      <Sprout className="size-4 text-[var(--cyan)]" />
      <AlertTitle className="font-heading font-bold">{t("sampleNoticeTitle")}</AlertTitle>
      <AlertDescription>{t("sampleNoticeText")}</AlertDescription>
    </Alert>
  );
}
