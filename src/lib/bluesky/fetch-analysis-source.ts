import {
  MAX_ACTIVITIES,
  MAX_FEED_PAGES,
  MAX_WINDOW_DAYS,
} from "./constants";
import { SkyCardError, isSkyCardError } from "./errors";
import type { BlueskyFetchOptions } from "./fetch-options";
import { getAuthorFeedPage } from "./get-author-feed";
import { getProfile, hasPublicOptOut } from "./get-profile";
import type { AuthorFeedItem, BlueskyProfile } from "./schemas";

export type AnalysisSource = {
  profile: BlueskyProfile;
  feed: AuthorFeedItem[];
};

function oldestFeedDate(items: AuthorFeedItem[]): number | undefined {
  const times = items
    .map((item) => {
      const record =
        typeof item.post.record === "object" && item.post.record !== null
          ? (item.post.record as Record<string, unknown>)
          : {};
      const value =
        item.reason?.indexedAt ||
        (typeof record.createdAt === "string" ? record.createdAt : undefined) ||
        item.post.indexedAt;
      const time = value ? new Date(value).getTime() : Number.NaN;
      return Number.isNaN(time) ? undefined : time;
    })
    .filter((time): time is number => typeof time === "number");

  return times.length ? Math.min(...times) : undefined;
}

export async function fetchAnalysisSource(
  actor: string,
  options: BlueskyFetchOptions = {}
): Promise<AnalysisSource> {
  let profile = await getProfile(actor, options);

  if (hasPublicOptOut(profile)) {
    if (options.cache === "no-store") {
      throw new SkyCardError(
        "public_opt_out",
        "Profile is not available for public analysis"
      );
    }

    profile = await getProfile(actor, { cache: "no-store" });

    if (hasPublicOptOut(profile)) {
      throw new SkyCardError(
        "public_opt_out",
        "Profile is not available for public analysis"
      );
    }
  }

  const feed: AuthorFeedItem[] = [];
  let cursor: string | undefined;
  const maxAge = Date.now() - MAX_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  for (let pageIndex = 0; pageIndex < MAX_FEED_PAGES; pageIndex += 1) {
    try {
      const page = await getAuthorFeedPage(profile.did, cursor, options);
      feed.push(...page.feed);
      cursor = page.cursor;

      const oldest = oldestFeedDate(page.feed);
      if (!cursor || feed.length >= MAX_ACTIVITIES || (oldest && oldest < maxAge)) {
        break;
      }
    } catch (error) {
      if (
        feed.length > 0 &&
        isSkyCardError(error) &&
        (error.code === "timeout" || error.code === "invalid_response")
      ) {
        break;
      }

      throw error;
    }
  }

  return {
    profile,
    feed: feed.slice(0, MAX_ACTIVITIES),
  };
}
