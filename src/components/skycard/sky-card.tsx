"use client";

import { KeyboardEvent, PointerEvent, useRef } from "react";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { cn } from "@/lib/utils";

import { SkyCardBack } from "./sky-card-back";
import { SkyCardFront } from "./sky-card-front";

export function SkyCard({
  analysis,
  flipped,
  onFlip,
  className,
  exportMode = false,
  avatar,
}: {
  analysis: SkyCardAnalysis;
  flipped: boolean;
  onFlip?: () => void;
  className?: string;
  exportMode?: boolean;
  avatar?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

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
      ref={ref}
      className={cn(
        "skycard-shell w-full max-w-[360px]",
        !exportMode && "float-card",
        className
      )}
      data-tier={analysis.presentation.tier}
      data-border={analysis.presentation.border}
      role={onFlip ? "button" : undefined}
      tabIndex={onFlip ? 0 : undefined}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-pressed={onFlip ? flipped : undefined}
    >
      <div className="skycard-inner" data-flipped={flipped}>
        <SkyCardFront analysis={analysis} avatar={avatar || analysis.profile.avatar} />
        <SkyCardBack analysis={analysis} />
      </div>
    </div>
  );
}
