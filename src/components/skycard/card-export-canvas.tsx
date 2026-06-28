"use client";

import { forwardRef } from "react";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { avatarProxyUrl } from "@/lib/utils/url";

import { SkyCard } from "./sky-card";

export const CardExportCanvas = forwardRef<
  HTMLDivElement,
  { analysis: SkyCardAnalysis }
>(function CardExportCanvas({ analysis }, ref) {
  return (
    <div
      ref={ref}
      className="export-root pointer-events-none fixed left-[-10000px] top-0 overflow-hidden bg-[#050B18]"
      style={{ width: 1000, height: 1400 }}
      aria-hidden="true"
    >
      <SkyCard
        analysis={analysis}
        flipped={false}
        exportMode
        avatar={avatarProxyUrl(analysis.profile.avatar)}
        className="max-w-none w-[1000px]"
      />
    </div>
  );
});
