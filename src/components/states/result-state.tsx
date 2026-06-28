"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { SkyCardErrorCode } from "@/lib/bluesky/errors";
import type { Locale } from "@/lib/i18n/routing";
import { cardPath, localePath } from "@/lib/utils/url";

const copyByCode: Record<SkyCardErrorCode, { title: string; text: string }> = {
  invalid_actor: { title: "invalidTitle", text: "invalidText" },
  not_found: { title: "notFoundTitle", text: "notFoundText" },
  rate_limited: { title: "rateLimitedTitle", text: "rateLimitedText" },
  unavailable: { title: "unavailableTitle", text: "unavailableText" },
  timeout: { title: "unavailableTitle", text: "unavailableText" },
  invalid_response: { title: "unavailableTitle", text: "unavailableText" },
  public_opt_out: { title: "optOutTitle", text: "optOutText" },
  thin_profile: { title: "thinTitle", text: "thinText" },
};

export function ResultState({
  code,
  locale,
}: {
  code: SkyCardErrorCode;
  locale: Locale;
}) {
  const t = useTranslations("states");
  const copy = copyByCode[code];

  return (
    <section className="sky-container grid min-h-[70dvh] place-items-center py-20">
      <div className="sky-panel max-w-xl rounded-[18px] p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-[16px] border border-[rgba(233,196,106,.35)] bg-[rgba(233,196,106,.12)] text-[var(--gold)]">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-black">{t(copy.title)}</h1>
        <p className="mt-3 text-[#C7D6EC]">{t(copy.text)}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={() => window.location.reload()}>
            <RotateCcw className="size-4" />
            {t("tryAgain")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href = cardPath(locale, "bsky.app");
            }}
          >
            {t("useExample")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              window.location.href = localePath(locale, "/");
            }}
          >
            <Home className="size-4" />
            {t("backHome")}
          </Button>
        </div>
      </div>
    </section>
  );
}
