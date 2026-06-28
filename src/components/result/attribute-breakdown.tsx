"use client";

import { useTranslations } from "next-intl";

import { Progress } from "@/components/ui/progress";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";

import {
  ATTRIBUTE_KEYS,
  scoreForAttribute,
} from "../skycard/card-attributes";
import { AttributeDetail } from "./attribute-detail";

export function AttributeBreakdown({ analysis }: { analysis: SkyCardAnalysis }) {
  const t = useTranslations();

  return (
    <section className="space-y-4" aria-labelledby="attribute-breakdown">
      <h2 id="attribute-breakdown" className="font-heading text-xl font-black">
        {t("result.attributes")}
      </h2>
      <div className="grid gap-3">
        {ATTRIBUTE_KEYS.map((attribute) => {
          const score = scoreForAttribute(analysis.scores, attribute);

          return (
            <div
              key={attribute}
              className="rounded-[14px] border border-white/10 bg-white/[.035] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sport text-lg font-black tracking-[.16em] text-[var(--cyan)]">
                      {t(`attributes.${attribute}.code`)}
                    </span>
                    <span className="font-heading font-bold">
                      {t(`attributes.${attribute}.name`)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`attributes.${attribute}.short`)}
                  </p>
                </div>
                <div className="font-sport text-4xl font-black text-foreground">{score}</div>
              </div>
              <Progress value={score} className="mt-3 h-2 bg-white/10" />
              <div className="mt-3">
                <AttributeDetail analysis={analysis} attribute={attribute} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
