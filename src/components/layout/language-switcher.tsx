"use client";

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/lib/i18n/routing";
import { routing } from "@/lib/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  "pt-BR": "PT-BR",
  es: "ES",
};

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.replace(`/${locale}`, "");
    }
  }

  return pathname || "/";
}

function localeHref(locale: Locale, pathname: string): string {
  const base = stripLocale(pathname);
  return locale === "en" ? base : `/${locale}${base === "/" ? "" : base}`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" aria-label={t("language")} />
        }
      >
        <Languages className="size-4" />
        {labels[locale]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-white/10 bg-[#0B1428] text-foreground">
        {routing.locales.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${item}; Path=/; SameSite=Lax`;
              window.location.href = localeHref(item, pathname);
            }}
            className="flex cursor-pointer items-center justify-between gap-8"
          >
            {labels[item]}
            {item === locale ? <Check className="size-4 text-[var(--cyan)]" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
