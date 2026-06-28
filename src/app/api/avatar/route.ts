import { NextRequest } from "next/server";

const allowedHosts = new Set([
  "cdn.bsky.app",
  "cdn.bsky.social",
  "cdn.bsky.network",
]);

function isAllowedUrl(value: string | null): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" && allowedHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!isAllowedUrl(url)) {
    return new Response("Invalid avatar URL", {
      status: 400,
    });
  }

  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
    },
    signal: AbortSignal.timeout(8000),
  }).catch(() => undefined);

  if (!response || response.status >= 300 || !response.ok) {
    return new Response("Avatar unavailable", {
      status: 502,
    });
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.startsWith("image/")) {
    return new Response("Avatar response is not an image", {
      status: 415,
    });
  }

  const body = await response.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
