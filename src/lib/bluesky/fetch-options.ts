import {
  BLUESKY_TIMEOUT_MS,
  CACHE_REVALIDATE_SECONDS,
} from "./constants";

export type BlueskyFetchOptions = {
  cache?: "default" | "no-store";
};

export function createBlueskyFetchInit(
  options: BlueskyFetchOptions = {}
): RequestInit & {
  next?: {
    revalidate: number;
  };
} {
  const fetchOptions: RequestInit & {
    next?: {
      revalidate: number;
    };
  } = {
    headers: {
      accept: "application/json",
    },
    signal: AbortSignal.timeout(BLUESKY_TIMEOUT_MS),
  };

  if (options.cache === "no-store") {
    fetchOptions.cache = "no-store";
  } else {
    fetchOptions.next = {
      revalidate: CACHE_REVALIDATE_SECONDS,
    };
  }

  return fetchOptions;
}
