import { useTranslations } from "next-intl";

import type { SkyCardScores } from "@/lib/bluesky/types";
import { cn } from "@/lib/utils";

export type AttributeKey =
  | "activity"
  | "consistency"
  | "engagement"
  | "impact"
  | "replies"
  | "network";

export const ATTRIBUTE_KEYS: AttributeKey[] = [
  "activity",
  "consistency",
  "engagement",
  "impact",
  "replies",
  "network",
];

export function scoreForAttribute(
  scores: SkyCardScores,
  key: AttributeKey
): number {
  return scores[key];
}

export function CardAttributes({
  scores,
  compact = false,
  className,
}: {
  scores: SkyCardScores;
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations();

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {ATTRIBUTE_KEYS.map((key, index) => (
        <div
          key={key}
          className={cn(
            "reveal-up rounded-[10px] border border-white/10 bg-white/[.055] px-3 py-2",
            compact && "px-2 py-1.5"
          )}
          style={{ animationDelay: `${index * 55}ms` }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-sport text-sm font-black tracking-[.12em] text-[var(--accent)]">
              {t(`attributes.${key}.code`)}
            </span>
            <span className="font-sport text-2xl font-black leading-none text-[var(--ovr)]">
              {scoreForAttribute(scores, key)}
            </span>
          </div>
          {!compact ? (
            <div className="mt-0.5 truncate text-[10px] font-semibold text-muted-foreground">
              {t(`attributes.${key}.name`)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
