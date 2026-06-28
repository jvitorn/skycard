"use client";

import { Download, Layers3, Share2, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Locale } from "@/lib/i18n/routing";

import { DemoCard, createDemoAnalysis } from "./demo-card";
import { HandleForm } from "./handle-form";

export function LandingPage({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const steps = [
    {
      title: t("landing.step1Title"),
      text: t("landing.step1Text"),
      icon: ShieldCheck,
    },
    {
      title: t("landing.step2Title"),
      text: t("landing.step2Text"),
      icon: Layers3,
    },
    {
      title: t("landing.step3Title"),
      text: t("landing.step3Text"),
      icon: WandSparkles,
    },
  ];
  const heroDemo = createDemoAnalysis({
    name: t("landing.demoName"),
    handle: "nova.bsky.social",
    archetype: "the-playmaker",
  });
  const examples = [
    createDemoAnalysis({
      name: "Ari Flux",
      handle: "ari.bsky.social",
      archetype: "the-broadcaster",
      tier: "rare",
      border: "rising",
      overall: 76,
    }),
    createDemoAnalysis({
      name: "Mika Vale",
      handle: "mika.bsky.social",
      archetype: "the-headliner",
      tier: "elite",
      border: "veteran",
      overall: 85,
    }),
    createDemoAnalysis({
      name: t("landing.demoName"),
      handle: "nova.bsky.social",
      archetype: "the-playmaker",
      tier: "icon",
      border: "legacy",
      overall: 93,
    }),
  ];

  return (
    <div className="star-field">
      <section className="sky-container grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-12 md:grid-cols-[1fr_minmax(320px,440px)] md:py-20">
        <div className="max-w-2xl">
          <Badge className="mb-6 normal-case">
            <Sparkles className="size-3" />
            {t("landing.badge")}
          </Badge>
          <h1 className="font-heading text-[clamp(2.55rem,8vw,5.6rem)] font-black leading-[0.95] tracking-normal">
            {t("landing.headline")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#C7D6EC]">
            {t("landing.subheadline")}
          </p>
          <div className="mt-8 max-w-2xl">
            <HandleForm locale={locale} />
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            {t("landing.disclaimer")}
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-[390px] md:justify-self-end">
          <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(86,214,255,.18),transparent_58%)] blur-xl" />
          <DemoCard analysis={heroDemo} className="relative mx-auto max-w-[360px]" />
        </div>
      </section>

      <section id="how-it-works" className="sky-container py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-heading text-3xl font-black md:text-4xl">
            {t("landing.howTitle")}
          </h2>
          <p className="mt-3 text-[#C7D6EC]">{t("landing.howIntro")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ title, text, icon: Icon }, index) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-[12px] border border-[rgba(86,214,255,.3)] bg-[rgba(86,214,255,.09)] text-[var(--cyan)]">
                  <Icon className="size-5" />
                </div>
                <CardTitle>
                  <span className="font-sport text-[var(--cyan)]">0{index + 1}</span>{" "}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {text}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="example-cards" className="sky-container py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-black md:text-4xl">
              {t("landing.examplesTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-[#C7D6EC]">{t("landing.examplesIntro")}</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {examples.map((analysis) => (
            <DemoCard
              key={analysis.profile.handle}
              analysis={analysis}
              className="mx-auto max-w-[280px]"
            />
          ))}
        </div>
      </section>

      <section className="sky-container py-16">
        <div className="sky-panel grid gap-8 rounded-[16px] p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <h2 className="font-heading text-3xl font-black">{t("landing.shareTitle")}</h2>
            <p className="mt-3 max-w-2xl text-[#C7D6EC]">{t("landing.shareText")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-bold md:min-w-80">
            <div className="rounded-[12px] border border-white/10 bg-white/[.04] p-4">
              <Download className="mb-3 size-5 text-[var(--cyan)]" />
              {t("result.downloadCard")}
            </div>
            <div className="rounded-[12px] border border-white/10 bg-white/[.04] p-4">
              <Share2 className="mb-3 size-5 text-[var(--gold)]" />
              {t("result.share")}
            </div>
          </div>
        </div>
      </section>

      <section className="sky-container py-16">
        <h2 className="font-heading text-3xl font-black md:text-4xl">{t("landing.faqTitle")}</h2>
        <Accordion className="mt-6 rounded-[16px] border border-white/10 bg-white/[.03] px-4">
          {[
            ["faqLoginQ", "faqLoginA"],
            ["faqStoreQ", "faqStoreA"],
            ["faqOfficialQ", "faqOfficialA"],
            ["faqScoresQ", "faqScoresA"],
          ].map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="font-heading font-bold">
                {t(`landing.${q}`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`landing.${a}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator className="bg-white/10" />
    </div>
  );
}
