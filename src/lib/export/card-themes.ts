export const CARD_EXPORT_THEMES = [
  {
    id: "sky",
    swatch: "#0ea5e9",
    background: "#020617",
    cardStart: "#075985",
    cardEnd: "#082f49",
    glow: "rgba(14, 165, 233, 0.34)",
  },
  {
    id: "indigo",
    swatch: "#6366f1",
    background: "#111827",
    cardStart: "#3730a3",
    cardEnd: "#1e1b4b",
    glow: "rgba(99, 102, 241, 0.34)",
  },
  {
    id: "emerald",
    swatch: "#10b981",
    background: "#022c22",
    cardStart: "#047857",
    cardEnd: "#064e3b",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  {
    id: "rose",
    swatch: "#f43f5e",
    background: "#1f1020",
    cardStart: "#9f1239",
    cardEnd: "#4c0519",
    glow: "rgba(244, 63, 94, 0.3)",
  },
  {
    id: "amber",
    swatch: "#f59e0b",
    background: "#1c1917",
    cardStart: "#92400e",
    cardEnd: "#451a03",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: "slate",
    swatch: "#94a3b8",
    background: "#020617",
    cardStart: "#334155",
    cardEnd: "#0f172a",
    glow: "rgba(148, 163, 184, 0.26)",
  },
] as const;

export type CardExportTheme = (typeof CARD_EXPORT_THEMES)[number];
export type CardExportThemeId = CardExportTheme["id"];

export const DEFAULT_CARD_EXPORT_THEME_ID: CardExportThemeId = "sky";

export function isCardExportThemeId(
  value: string | null | undefined
): value is CardExportThemeId {
  return CARD_EXPORT_THEMES.some((theme) => theme.id === value);
}

export function resolveCardExportTheme(
  value: string | null | undefined
): CardExportTheme {
  return (
    CARD_EXPORT_THEMES.find((theme) => theme.id === value) ||
    CARD_EXPORT_THEMES.find((theme) => theme.id === DEFAULT_CARD_EXPORT_THEME_ID) ||
    CARD_EXPORT_THEMES[0]
  );
}
