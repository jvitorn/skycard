"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { actorInputSchema } from "@/lib/bluesky/normalize-actor";
import type { Locale } from "@/lib/i18n/routing";
import { cardPath } from "@/lib/utils/url";

export function HandleForm({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = actorInputSchema.safeParse(value);

    if (!parsed.success) {
      setError(value.trim() ? t("form.invalid") : t("form.empty"));
      return;
    }

    setError(null);
    router.push(cardPath(locale, parsed.data));
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <label htmlFor={compact ? "handle-compact" : "handle"} className="sr-only">
        {t("landing.label")}
      </label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={compact ? "handle-compact" : "handle"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t("landing.placeholder")}
            className="pl-11"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "handle-error" : undefined}
          />
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          {t("landing.button")}
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error ? (
        <p id="handle-error" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
      {!compact ? (
        <button
          type="button"
          className="text-sm font-bold text-[var(--cyan)] underline-offset-4 hover:underline"
          onClick={() => setValue("bsky.app")}
        >
          {t("landing.tryExample")}
        </button>
      ) : null}
    </form>
  );
}
