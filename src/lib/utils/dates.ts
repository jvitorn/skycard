export const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(start: Date, end: Date): number {
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));
}

export function toDateInput(date: Date): string {
  return date.toISOString();
}

export function formatShortDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatAccountAge(createdAt: string | undefined, locale: string): string {
  if (!createdAt) {
    return "—";
  }

  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) {
    return "—";
  }

  const days = daysBetween(created, new Date());

  if (days < 90) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -days,
      "day"
    );
  }

  if (days < 365) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -Math.round(days / 30),
      "month"
    );
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    -Math.round(days / 365),
    "year"
  );
}
