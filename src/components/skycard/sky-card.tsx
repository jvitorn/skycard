"use client";

import {
  forwardRef,
  type CSSProperties,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useRef,
} from "react";
import { useLocale, useTranslations } from "next-intl";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import type { CardExportThemeId } from "@/lib/export/card-themes";
import { resolveCardExportTheme } from "@/lib/export/card-themes";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/utils/numbers";

import { SkyCardBack } from "./sky-card-back";
import { SkyCardFront } from "./sky-card-front";

type SkyCardProps = {
  analysis: SkyCardAnalysis;
  flipped: boolean;
  onFlip?: () => void;
  className?: string;
  exportMode?: boolean;
  avatar?: string;
  exportThemeId?: CardExportThemeId;
};

export const SkyCard = forwardRef<HTMLDivElement, SkyCardProps>(function SkyCard({
  analysis,
  flipped,
  onFlip,
  className,
  exportMode = false,
  avatar,
  exportThemeId,
}, forwardedRef) {
  const t = useTranslations();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const exportTheme = exportThemeId ? resolveCardExportTheme(exportThemeId) : undefined;
  const themeStyle = exportTheme
    ? ({
        "--c1": exportTheme.cardStart,
        "--c2": exportTheme.cardEnd,
        "--export-bg": exportTheme.background,
        "--export-glow": exportTheme.glow,
      } as CSSProperties)
    : undefined;
  const sideLabel = t(flipped ? "result.back" : "result.front");
  const accessibleLabel = t("card.accessibleLabel", {
    name: analysis.profile.displayName,
    handle: analysis.profile.handle,
    side: sideLabel,
    ovr: analysis.scores.overall,
    tier: t(`tiers.${analysis.presentation.tier}`),
    border: t(`borders.${analysis.presentation.border}`),
    archetype: t(`archetypes.${analysis.presentation.archetype}.name`),
    followers: formatCompactNumber(analysis.profile.followers, locale),
    following: formatCompactNumber(analysis.profile.follows, locale),
  });
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (exportMode || !ref.current) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--rx", `${((0.5 - py) * 8).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
  }

  function handlePointerLeave() {
    if (!ref.current) {
      return;
    }

    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onFlip) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  }

  return (
    <div
      ref={setRefs}
      style={themeStyle}
      className={cn(
        "skycard-shell w-full max-w-[360px]",
        !exportMode && "float-card",
        className
      )}
      data-tier={analysis.presentation.tier}
      data-border={analysis.presentation.border}
      role={onFlip ? "button" : "group"}
      tabIndex={onFlip ? 0 : undefined}
      aria-label={accessibleLabel}
      title={onFlip ? t("result.flipCard") : undefined}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-pressed={onFlip ? flipped : undefined}
    >
      <div className="skycard-inner" data-flipped={flipped} aria-live="polite">
        {flipped ? (
          <SkyCardBack analysis={analysis} />
        ) : (
          <SkyCardFront analysis={analysis} avatar={avatar || analysis.profile.avatar} />
        )}
      </div>
    </div>
  );
});
