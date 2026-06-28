"use client";

import { toPng } from "html-to-image";

import type { CardExportThemeId } from "./card-themes";
import { resolveCardExportTheme } from "./card-themes";

async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.onload = () => resolve();
          image.onerror = () => resolve();
        })
    )
  );
}

export async function exportNodeAsPng(
  node: HTMLElement,
  size: { width: number; height: number }
): Promise<string> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await waitForImages(node);

  return toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    width: size.width,
    height: size.height,
    canvasWidth: size.width,
    canvasHeight: size.height,
    backgroundColor: "#050B18",
  });
}

function applyExportTheme(node: HTMLElement, themeId: CardExportThemeId): () => void {
  const theme = resolveCardExportTheme(themeId);
  const values = {
    "--c1": theme.cardStart,
    "--c2": theme.cardEnd,
    "--export-bg": theme.background,
    "--export-glow": theme.glow,
  };
  const previous = Object.entries(values).map(([property]) => [
    property,
    node.style.getPropertyValue(property),
  ] as const);

  for (const [property, value] of Object.entries(values)) {
    node.style.setProperty(property, value);
  }

  return () => {
    for (const [property, value] of previous) {
      if (value) {
        node.style.setProperty(property, value);
      } else {
        node.style.removeProperty(property);
      }
    }
  };
}

export async function exportVisibleCardAsPng(
  node: HTMLElement,
  options: { themeId?: CardExportThemeId } = {}
): Promise<string> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await waitForImages(node);

  const theme = resolveCardExportTheme(options.themeId);
  const restoreTheme = options.themeId ? applyExportTheme(node, options.themeId) : undefined;
  const rect = node.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);

  try {
    return await toPng(node, {
      cacheBust: true,
      pixelRatio: 1000 / width,
      width,
      height,
      canvasWidth: 1000,
      canvasHeight: 1400,
      backgroundColor: options.themeId ? theme.background : "transparent",
      style: {
        animation: "none",
        transform: "none",
        transition: "none",
      },
    });
  } finally {
    restoreTheme?.();
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const blob = await fetch(dataUrl).then((response) => response.blob());
  return new File([blob], filename, { type: "image/png" });
}
