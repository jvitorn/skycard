import { MAX_WINDOW_DAYS } from "./constants";
import type { NormalizedActivity } from "./types";
import type { AuthorFeedItem } from "./schemas";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null
    ? (value as UnknownRecord)
    : {};
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function isValidDate(value: string | undefined): value is string {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()));
}

function getPostCreatedAt(item: AuthorFeedItem): string | undefined {
  const record = asRecord(item.post.record);
  return (
    stringValue(record.createdAt) ||
    item.post.indexedAt ||
    item.reason?.indexedAt
  );
}

function hasReplyRecord(item: AuthorFeedItem): boolean {
  const record = asRecord(item.post.record);
  return Boolean(record.reply || item.reply);
}

function count(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isRepost(item: AuthorFeedItem): boolean {
  return item.reason?.$type?.includes("reasonRepost") ?? Boolean(item.reason);
}

export function weightedInteractions({
  likes,
  repostsReceived,
  repliesReceived,
  quotesReceived,
  bookmarks,
}: Pick<
  NormalizedActivity,
  "likes" | "repostsReceived" | "repliesReceived" | "quotesReceived" | "bookmarks"
>): number {
  return (
    likes +
    repostsReceived * 2 +
    repliesReceived * 1.5 +
    quotesReceived * 2 +
    bookmarks * 1.5
  );
}

export function normalizeFeedItems(
  items: AuthorFeedItem[],
  profileDid: string
): NormalizedActivity[] {
  const cutoff = Date.now() - MAX_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return items
    .map((item): NormalizedActivity | undefined => {
      const createdAt = isRepost(item)
        ? item.reason?.indexedAt || item.post.indexedAt || getPostCreatedAt(item)
        : getPostCreatedAt(item);

      if (!isValidDate(createdAt) || new Date(createdAt).getTime() < cutoff) {
        return undefined;
      }

      const repost = isRepost(item);
      const reply = !repost && hasReplyRecord(item);
      const parentAuthorDid = item.reply?.parent?.author?.did;
      const parentAuthorHandle = item.reply?.parent?.author?.handle;
      const isReplyToSelf = reply && parentAuthorDid === profileDid;
      const baseCounts = repost
        ? {
            likes: 0,
            repostsReceived: 0,
            repliesReceived: 0,
            quotesReceived: 0,
            bookmarks: 0,
          }
        : {
            likes: count(item.post.likeCount),
            repostsReceived: count(item.post.repostCount),
            repliesReceived: count(item.post.replyCount),
            quotesReceived: count(item.post.quoteCount),
            bookmarks: count(item.post.bookmarkCount),
          };

      return {
        uri: item.post.uri,
        createdAt,
        type: repost ? "repost" : reply ? "reply" : "post",
        isReplyToSelf,
        parentAuthorDid,
        parentAuthorHandle,
        ...baseCounts,
        weightedInteractions: weightedInteractions(baseCounts),
      };
    })
    .filter((activity): activity is NormalizedActivity => Boolean(activity));
}
