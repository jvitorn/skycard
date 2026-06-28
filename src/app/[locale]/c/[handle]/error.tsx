"use client";

import { useParams } from "next/navigation";

import { ResultState } from "@/components/states/result-state";
import type { Locale } from "@/lib/i18n/routing";

export default function Error() {
  const params = useParams<{ locale?: string }>();
  const locale =
    params.locale === "pt-BR" || params.locale === "es" ? params.locale : "en";

  return <ResultState code="unavailable" locale={locale as Locale} />;
}
