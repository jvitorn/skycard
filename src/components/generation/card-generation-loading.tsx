"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function CardGenerationLoading() {
  const t = useTranslations("generation");
  const steps = [
    t("findingProfile"),
    t("readingPosts"),
    t("calculatingStats"),
    t("choosingArchetype"),
    t("designingCard"),
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % steps.length);
    }, 950);

    return () => window.clearInterval(id);
  }, [steps.length]);

  return (
    <section className="sky-container grid min-h-[70dvh] place-items-center py-20" aria-live="polite">
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[320px_1fr] md:items-center">
        <div className="skycard-shell mx-auto w-[270px]" data-tier="icon" data-border="rising">
          <div className="skycard-face p-6">
            <div className="relative z-10 flex h-full flex-col">
              <Skeleton className="h-16 w-28 rounded-[12px] bg-white/10" />
              <Skeleton className="mx-auto mt-16 size-24 rounded-full bg-white/10" />
              <Skeleton className="mx-auto mt-6 h-7 w-48 rounded-[10px] bg-white/10" />
              <div className="mt-auto grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, item) => (
                  <Skeleton key={item} className="h-12 rounded-[10px] bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="sky-panel rounded-[18px] p-6">
          <p className="font-sport text-sm font-black tracking-[.18em] text-[var(--cyan)]">
            {t("stepOf", { step: index + 1, total: steps.length })}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-black">{t("title")}</h1>
          <p className="mt-3 text-[#C7D6EC]">{steps[index]}</p>
          <Progress value={(index + 1) * 18} className="mt-6 h-2 bg-white/10" />
          <p className="mt-4 text-sm font-semibold text-muted-foreground">{t("almostReady")}</p>
        </div>
      </div>
    </section>
  );
}
