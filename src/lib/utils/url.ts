import type { Locale } from "@/lib/i18n/routing";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

export function localePath(locale: Locale, pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return locale === "en" ? normalized : `/${locale}${normalized}`;
}

export function cardPath(locale: Locale, actor: string): string {
  return localePath(locale, `/c/${encodeURIComponent(actor)}`);
}

export function avatarProxyUrl(url: string | undefined): string | undefined {
  return url ? `/api/avatar?url=${encodeURIComponent(url)}` : undefined;
}

export function atUriToBskyPostUrl(uri: string | undefined, handle: string): string | undefined {
  if (!uri?.startsWith("at://")) {
    return undefined;
  }

  const parts = uri.replace("at://", "").split("/");
  const rkey = parts.at(-1);

  if (!rkey) {
    return undefined;
  }

  return `https://bsky.app/profile/${handle}/post/${rkey}`;
}
