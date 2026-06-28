"use client";

import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { formatNumber } from "@/lib/utils/numbers";

import type { AttributeKey } from "../skycard/card-attributes";
import { scoreForAttribute } from "../skycard/card-attributes";

function rawValues(analysis: SkyCardAnalysis, key: AttributeKey): Array<[string, number]> {
  const { activity, profile } = analysis;

  switch (key) {
    case "activity":
      return [
        ["card.originalPosts", activity.originalPosts],
        ["card.replies", activity.repliesSent],
        ["card.reposts", activity.repostsSent],
      ];
    case "consistency":
      return [
        ["result.activitiesAnalyzed", activity.activitiesAnalyzed],
        ["card.activityWindow", activity.windowDays],
      ];
    case "engagement":
      return [
        ["card.interactions", Math.round(activity.weightedInteractionsReceived)],
        ["card.followers", profile.followers],
      ];
    case "impact":
      return [
        ["card.hitPosts", activity.hitPosts],
        ["result.bestPost", Math.round(activity.bestPostInteractions)],
      ];
    case "replies":
      return [
        ["card.externalReplies", activity.externalReplies],
        ["card.uniqueAccounts", activity.uniqueAccountsReplied],
      ];
    case "network":
      return [
        ["card.followers", profile.followers],
        ["card.following", profile.follows],
        ["card.uniqueAccounts", activity.uniqueAccountsReplied],
      ];
  }
}

function DetailContent({
  analysis,
  attribute,
}: {
  analysis: SkyCardAnalysis;
  attribute: AttributeKey;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const score = scoreForAttribute(analysis.scores, attribute);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-sport text-sm font-black tracking-[.16em] text-[var(--cyan)]">
            {t(`attributes.${attribute}.code`)}
          </div>
          <div className="font-heading text-xl font-black">
            {t(`attributes.${attribute}.name`)}
          </div>
        </div>
        <div className="font-sport text-5xl font-black text-[var(--gold)]">{score}</div>
      </div>
      <p className="text-sm leading-6 text-[#C7D6EC]">
        {t(`attributes.${attribute}.detail`)}
      </p>
      <div className="rounded-[12px] border border-white/10 bg-white/[.04] p-3 text-sm text-muted-foreground">
        {t(`attributes.${attribute}.calculation`)}
      </div>
      <div className="grid gap-2">
        {rawValues(analysis, attribute).map(([label, value]) => (
          <div
            key={`${attribute}-${label}`}
            className="flex items-center justify-between rounded-[10px] bg-white/[.04] px-3 py-2"
          >
            <span className="text-sm text-muted-foreground">
              {label === "result.activitiesAnalyzed"
                ? t("result.activitiesAnalyzedLabel")
                : label === "card.activityWindow"
                  ? t(label, { days: value })
                  : t(label)}
            </span>
            <span className="font-sport text-lg font-black text-foreground">
              {formatNumber(value, locale)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{t("result.entertainment")}</p>
    </div>
  );
}

export function AttributeDetail({
  analysis,
  attribute,
}: {
  analysis: SkyCardAnalysis;
  attribute: AttributeKey;
}) {
  const t = useTranslations();

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <Tooltip>
          <TooltipTrigger render={<span tabIndex={0} className="cursor-help text-[var(--cyan)]" />}>
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent>{t(`attributes.${attribute}.short`)}</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
            {t("result.seeCalculation")}
          </PopoverTrigger>
          <PopoverContent className="w-96 border-white/10 bg-[#0B1428] p-4">
            <PopoverHeader>
              <PopoverTitle className="font-heading font-black">
                {t(`attributes.${attribute}.name`)}
              </PopoverTitle>
            </PopoverHeader>
            <DetailContent analysis={analysis} attribute={attribute} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              <Info className="size-4" />
              {t("result.seeCalculation")}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-white/10 bg-[#0B1428]">
            <DrawerHeader>
              <DrawerTitle>{t(`attributes.${attribute}.name`)}</DrawerTitle>
              <DrawerDescription>{t(`attributes.${attribute}.short`)}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <DetailContent analysis={analysis} attribute={attribute} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
