import {
  BLUESKY_PUBLIC_API,
} from "./constants";
import { SkyCardError } from "./errors";
import {
  createBlueskyFetchInit,
  type BlueskyFetchOptions,
} from "./fetch-options";
import { blueskyProfileSchema, type BlueskyProfile } from "./schemas";

export async function getProfile(
  actor: string,
  options: BlueskyFetchOptions = {}
): Promise<BlueskyProfile> {
  const url = new URL("/xrpc/app.bsky.actor.getProfile", BLUESKY_PUBLIC_API);
  url.searchParams.set("actor", actor);

  let response: Response;

  try {
    response = await fetch(url, createBlueskyFetchInit(options));
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new SkyCardError("timeout", "Profile request timed out");
    }

    throw new SkyCardError("unavailable", "Profile request failed");
  }

  if (response.status === 400 || response.status === 404) {
    throw new SkyCardError("not_found", "Profile not found", response.status);
  }

  if (response.status === 429) {
    throw new SkyCardError("rate_limited", "Bluesky rate limit", response.status);
  }

  if (response.status >= 500) {
    throw new SkyCardError("unavailable", "Bluesky profile service error", response.status);
  }

  if (!response.ok) {
    throw new SkyCardError("unavailable", "Unexpected profile response", response.status);
  }

  const json: unknown = await response.json().catch(() => undefined);
  const parsed = blueskyProfileSchema.safeParse(json);

  if (!parsed.success) {
    throw new SkyCardError("invalid_response", "Invalid profile response");
  }

  return parsed.data;
}

export function hasPublicOptOut(profile: BlueskyProfile): boolean {
  return Boolean(
    profile.labels?.some((label) => {
      const value = label.val?.toLowerCase();
      return (
        value === "!no-unauthenticated" ||
        value === "no-unauthenticated" ||
        value === "no_unauthenticated"
      );
    })
  );
}
