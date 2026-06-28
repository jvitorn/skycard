"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/10 bg-[#040915]">
      <div className="sky-container flex flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="font-heading text-base font-black text-foreground">SkyCards</div>
        <p className="max-w-2xl">{t("disclaimer")}</p>
        <div className="flex flex-wrap gap-4 font-semibold">
          <a href="#how-it-works" className="hover:text-foreground">
            {t("about")}
          </a>
          <a href="#methodology" className="hover:text-foreground">
            {t("scores")}
          </a>
          <span>{t("privacy")}</span>
          <span>{t("terms")}</span>
        </div>
      </div>
    </footer>
  );
}
