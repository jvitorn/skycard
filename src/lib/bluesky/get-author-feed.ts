import {
  AUTHOR_FEED_LIMIT,
  BLUESKY_PUBLIC_API,
  BLUESKY_TIMEOUT_MS,
  CACHE_REVALIDATE_SECONDS,
} from "./constants";
import { SkyCardError } from "./errors";
import { authorFeedPageSchema, type AuthorFeedPage } from "./schemas";

export async function getAuthorFeedPage(
  actor: string,
  cursor?: string
): Promise<AuthorFeedPage> {
  const url = new URL("/xrpc/app.bsky.feed.getAuthorFeed", BLUESKY_PUBLIC_API);
  url.searchParams.set("actor", actor);
  url.searchParams.set("filter", "posts_with_replies");
  url.searchParams.set("limit", String(AUTHOR_FEED_LIMIT));

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: CACHE_REVALIDATE_SECONDS,
      },
      signal: AbortSignal.timeout(BLUESKY_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new SkyCardError("timeout", "Feed request timed out");
    }

    throw new SkyCardError("unavailable", "Feed request failed");
  }

  if (response.status === 400 || response.status === 404) {
    throw new SkyCardError("not_found", "Feed actor not found", response.status);
  }

  if (response.status === 429) {
    throw new SkyCardError("rate_limited", "Bluesky rate limit", response.status);
  }

  if (response.status >= 500) {
    throw new SkyCardError("unavailable", "Bluesky feed service error", response.status);
  }

  if (!response.ok) {
    throw new SkyCardError("unavailable", "Unexpected feed response", response.status);
  }

  const json: unknown = await response.json().catch(() => undefined);
  const parsed = authorFeedPageSchema.safeParse(json);

  if (!parsed.success) {
    throw new SkyCardError("invalid_response", "Invalid feed response");
  }

  return parsed.data;
}
