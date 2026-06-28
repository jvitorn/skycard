"use client";

import { toPng } from "html-to-image";

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
