import { z } from "zod";

export const blueskyLabelSchema = z
  .object({
    val: z.string().optional(),
  })
  .passthrough();

export const blueskyProfileSchema = z
  .object({
    did: z.string(),
    handle: z.string(),
    displayName: z.string().optional(),
    avatar: z.string().url().optional(),
    description: z.string().optional(),
    followersCount: z.number().optional(),
    followsCount: z.number().optional(),
    postsCount: z.number().optional(),
    createdAt: z.string().optional(),
    labels: z.array(blueskyLabelSchema).optional(),
    associated: z.unknown().optional(),
    verification: z.unknown().optional(),
  })
  .passthrough();

const authorSchema = z
  .object({
    did: z.string(),
    handle: z.string().optional(),
    displayName: z.string().optional(),
    avatar: z.string().url().optional(),
  })
  .passthrough();

const replyRefSchema = z
  .object({
    uri: z.string().optional(),
    author: authorSchema.optional(),
  })
  .passthrough();

export const authorFeedItemSchema = z
  .object({
    post: z
      .object({
        uri: z.string(),
        cid: z.string().optional(),
        author: authorSchema,
        record: z.unknown(),
        indexedAt: z.string().optional(),
        likeCount: z.number().optional(),
        repostCount: z.number().optional(),
        replyCount: z.number().optional(),
        quoteCount: z.number().optional(),
        bookmarkCount: z.number().optional(),
      })
      .passthrough(),
    reply: z
      .object({
        root: replyRefSchema.optional(),
        parent: replyRefSchema.optional(),
      })
      .passthrough()
      .optional(),
    reason: z
      .object({
        $type: z.string().optional(),
        indexedAt: z.string().optional(),
        by: authorSchema.optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const authorFeedPageSchema = z
  .object({
    feed: z.array(authorFeedItemSchema),
    cursor: z.string().optional(),
  })
  .passthrough();

export type BlueskyProfile = z.infer<typeof blueskyProfileSchema>;
export type AuthorFeedItem = z.infer<typeof authorFeedItemSchema>;
export type AuthorFeedPage = z.infer<typeof authorFeedPageSchema>;
