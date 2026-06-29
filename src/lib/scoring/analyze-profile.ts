import {
  INITIAL_WINDOW_DAYS,
  MAX_WINDOW_DAYS,
} from "@/lib/bluesky/constants";
import { SkyCardError } from "@/lib/bluesky/errors";
import { fetchAnalysisSource } from "@/lib/bluesky/fetch-analysis-source";
import type { BlueskyFetchOptions } from "@/lib/bluesky/fetch-options";
import { normalizeActorInput } from "@/lib/bluesky/normalize-actor";
import { normalizeFeedItems } from "@/lib/bluesky/normalize-feed";
import type {
  NormalizedActivity,
  SkyCardActivitySummary,
  SkyCardAnalysis,
  SkyCardProfile,
  SkyCardScores,
} from "@/lib/bluesky/types";
import { addDays, daysBetween, toDateInput } from "@/lib/utils/dates";
import { atUriToBskyPostUrl } from "@/lib/utils/url";

import { calculateActivity } from "./calculate-activity";
import { calculateArchetype } from "./calculate-archetype";
import { calculateBadges } from "./calculate-badges";
import { calculateBorder } from "./calculate-border";
import { calculateConsistency } from "./calculate-consistency";
import { calculateEngagement } from "./calculate-engagement";
import { calculateImpact } from "./calculate-impact";
import { calculateNetwork } from "./calculate-network";
import { calculateOverall } from "./calculate-overall";
import { calculateReplies } from "./calculate-replies";
import { calculateTier } from "./calculate-tier";
import { ALGORITHM_VERSION } from "./config";
import { clamp, roundAttribute } from "./helpers";

function toProfile(profile: Awaited<ReturnType<typeof fetchAnalysisSource>>["profile"]): SkyCardProfile {
  return {
    did: profile.did,
    handle: profile.handle,
    displayName: profile.displayName?.trim() || profile.handle,
    avatar: profile.avatar,
    description: profile.description,
    followers: profile.followersCount ?? 0,
    follows: profile.followsCount ?? 0,
    totalPosts: profile.postsCount ?? 0,
    createdAt: profile.createdAt,
  };
}

function selectAnalysisWindow(
  activities: NormalizedActivity[],
  now: Date
): {
  activities: NormalizedActivity[];
  periodStart: Date;
  periodEnd: Date;
  windowDays: number;
} {
  const cutoff365 = addDays(now, -MAX_WINDOW_DAYS).getTime();
  const cutoff90 = addDays(now, -INITIAL_WINDOW_DAYS).getTime();
  const within365 = activities
    .filter((activity) => {
      const time = new Date(activity.createdAt).getTime();
      return time >= cutoff365 && time <= now.getTime();
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const within90 = within365.filter(
    (activity) => new Date(activity.createdAt).getTime() >= cutoff90
  );

  if (within90.length >= 30) {
    return {
      activities: within90,
      periodStart: addDays(now, -INITIAL_WINDOW_DAYS),
      periodEnd: now,
      windowDays: INITIAL_WINDOW_DAYS,
    };
  }

  const oldest = within365.at(-1);
  const oldestDate = oldest ? new Date(oldest.createdAt) : addDays(now, -INITIAL_WINDOW_DAYS);
  const expandedDays = clamp(
    Math.max(INITIAL_WINDOW_DAYS, daysBetween(oldestDate, now)),
    INITIAL_WINDOW_DAYS,
    MAX_WINDOW_DAYS
  );

  return {
    activities: within365,
    periodStart: addDays(now, -expandedDays),
    periodEnd: now,
    windowDays: expandedDays,
  };
}

function summarizeActivities({
  activities,
  profile,
  periodStart,
  periodEnd,
  windowDays,
}: {
  activities: NormalizedActivity[];
  profile: SkyCardProfile;
  periodStart: Date;
  periodEnd: Date;
  windowDays: number;
}): SkyCardActivitySummary {
  const originalPosts = activities.filter((activity) => activity.type === "post");
  const replies = activities.filter((activity) => activity.type === "reply");
  const reposts = activities.filter((activity) => activity.type === "repost");
  const externalReplies = replies.filter((activity) => !activity.isReplyToSelf);
  const selfReplies = replies.filter((activity) => activity.isReplyToSelf);
  const uniqueAccountsReplied = new Set(
    externalReplies
      .map((activity) => activity.parentAuthorDid || activity.parentAuthorHandle)
      .filter((value): value is string => Boolean(value))
  ).size;
  const authored = activities.filter((activity) => activity.type !== "repost");
  const bestPost = originalPosts.reduce<NormalizedActivity | undefined>(
    (best, activity) =>
      !best || activity.weightedInteractions > best.weightedInteractions
        ? activity
        : best,
    undefined
  );

  return {
    activitiesAnalyzed: activities.length,
    originalPosts: originalPosts.length,
    repliesSent: replies.length,
    externalReplies: externalReplies.length,
    selfReplies: selfReplies.length,
    repostsSent: reposts.length,
    uniqueAccountsReplied,
    totalLikesReceived: authored.reduce((sum, activity) => sum + activity.likes, 0),
    totalRepostsReceived: authored.reduce(
      (sum, activity) => sum + activity.repostsReceived,
      0
    ),
    totalRepliesReceived: authored.reduce(
      (sum, activity) => sum + activity.repliesReceived,
      0
    ),
    totalQuotesReceived: authored.reduce(
      (sum, activity) => sum + activity.quotesReceived,
      0
    ),
    totalBookmarksReceived: authored.reduce(
      (sum, activity) => sum + activity.bookmarks,
      0
    ),
    weightedInteractionsReceived: authored.reduce(
      (sum, activity) => sum + activity.weightedInteractions,
      0
    ),
    hitPosts: 0,
    bestPostUri: atUriToBskyPostUrl(bestPost?.uri, profile.handle),
    bestPostInteractions: bestPost?.weightedInteractions ?? 0,
    periodStart: toDateInput(periodStart),
    periodEnd: toDateInput(periodEnd),
    windowDays,
  };
}

function adjustScore(rawScore: number, confidence: number): number {
  return 50 + (rawScore - 50) * confidence;
}

function calculateScores({
  activities,
  summary,
  profile,
}: {
  activities: NormalizedActivity[];
  summary: SkyCardActivitySummary;
  profile: SkyCardProfile;
}): {
  scores: SkyCardScores;
  impactDetails: ReturnType<typeof calculateImpact>;
  sampleConfidence: number;
} {
  const authoredActivities = summary.originalPosts + summary.repliesSent;
  const baseConfidence = clamp(authoredActivities / 30, 0.35, 1);
  const sampleConfidence =
    summary.windowDays < 14 ? Math.min(baseConfidence, 0.7) : baseConfidence;
  const impactDetails = calculateImpact(activities);
  const raw = {
    activity: calculateActivity(summary),
    consistency: calculateConsistency(activities, summary),
    engagement: calculateEngagement(summary, profile),
    impact: impactDetails.score,
    replies: calculateReplies(summary),
    network: calculateNetwork(summary, profile),
  };
  const networkConfidence = Math.max(sampleConfidence, 0.65);
  const partialScores = {
    activity: roundAttribute(adjustScore(raw.activity, sampleConfidence)),
    consistency: roundAttribute(adjustScore(raw.consistency, sampleConfidence)),
    engagement: roundAttribute(adjustScore(raw.engagement, sampleConfidence)),
    impact: roundAttribute(adjustScore(raw.impact, sampleConfidence)),
    replies: roundAttribute(adjustScore(raw.replies, sampleConfidence)),
    network: roundAttribute(adjustScore(raw.network, networkConfidence)),
  };
  const overall = clamp(calculateOverall(partialScores), 60, 99);

  return {
    scores: {
      overall,
      ...partialScores,
    },
    impactDetails,
    sampleConfidence,
  };
}

export async function analyzeProfile(
  actorInput: string,
  options: BlueskyFetchOptions = {}
): Promise<SkyCardAnalysis> {
  const actor = normalizeActorInput(decodeURIComponent(actorInput));
  const source = await fetchAnalysisSource(actor, options);
  const profile = toProfile(source.profile);
  const normalized = normalizeFeedItems(source.feed, profile.did);
  const now = new Date();
  const selectedWindow = selectAnalysisWindow(normalized, now);

  if (selectedWindow.activities.length === 0) {
    throw new SkyCardError("thin_profile", "No public activity found");
  }

  const baseSummary = summarizeActivities({
    activities: selectedWindow.activities,
    profile,
    periodStart: selectedWindow.periodStart,
    periodEnd: selectedWindow.periodEnd,
    windowDays: selectedWindow.windowDays,
  });
  const { scores, impactDetails, sampleConfidence } = calculateScores({
    activities: selectedWindow.activities,
    summary: baseSummary,
    profile,
  });
  const summary: SkyCardActivitySummary = {
    ...baseSummary,
    hitPosts: impactDetails.hitPosts,
    bestPostUri:
      atUriToBskyPostUrl(impactDetails.bestPostUri, profile.handle) ||
      baseSummary.bestPostUri,
    bestPostInteractions:
      impactDetails.bestPostInteractions || baseSummary.bestPostInteractions,
  };
  const isRookieMode =
    summary.activitiesAnalyzed >= 1 && summary.activitiesAnalyzed <= 9;
  const border = calculateBorder(profile.createdAt, now);
  const tier = calculateTier(scores.overall);
  const archetype = calculateArchetype({
    scores,
    isRookieMode,
  });
  const badges = calculateBadges({
    scores,
    summary,
    border: border.border,
    isRookieMode,
  });

  return {
    algorithmVersion: ALGORITHM_VERSION,
    generatedAt: now.toISOString(),
    profile,
    activity: summary,
    scores,
    presentation: {
      tier,
      border: border.border,
      archetype,
      badges,
      joinedYear: border.joinedYear,
      isRookieMode,
      sampleConfidence,
    },
  };
}
