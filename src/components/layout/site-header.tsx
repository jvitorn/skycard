"use client";

import { Menu, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n/routing";

import { LanguageSwitcher } from "./language-switcher";

function Logo({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");

  return (
    <Link
      href={locale === "en" ? "/" : `/${locale}`}
      className="flex items-center gap-2 font-heading text-lg font-black"
    >
      <span className="grid size-8 place-items-center rounded-[10px] border border-[rgba(86,214,255,.35)] bg-[rgba(86,214,255,.09)] text-[var(--cyan)]">
        <Sparkles className="size-4" />
      </span>
      {t("logo")}
    </Link>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const links = [
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#example-cards", label: t("exploreCards") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/78 backdrop-blur-xl">
      <div className="sky-container flex h-16 items-center justify-between gap-4">
        <Logo locale={locale} />
        <nav className="hidden items-center gap-6 text-sm font-bold text-muted-foreground md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </a>
          ))}
          <LanguageSwitcher locale={locale} />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="icon" aria-label={t("menu")} />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-[#071022] text-foreground">
              <SheetHeader>
                <SheetTitle className="font-heading text-foreground">{t("menu")}</SheetTitle>
              </SheetHeader>
              <div className="mt-8 grid gap-3">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-[10px] border border-white/10 bg-white/[.04] px-4 py-3 font-heading font-bold"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
