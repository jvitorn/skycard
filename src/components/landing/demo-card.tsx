"use client";

import type { SkyCardAnalysis } from "@/lib/bluesky/types";
import { SkyCard } from "@/components/skycard/sky-card";

export function createDemoAnalysis({
  name,
  handle,
  archetype,
  tier = "icon",
  border = "legacy",
  overall = 93,
}: {
  name: string;
  handle: string;
  archetype: SkyCardAnalysis["presentation"]["archetype"];
  tier?: SkyCardAnalysis["presentation"]["tier"];
  border?: SkyCardAnalysis["presentation"]["border"];
  overall?: number;
}): SkyCardAnalysis {
  return {
    algorithmVersion: "1.0.0",
    generatedAt: new Date("2026-06-28T12:00:00.000Z").toISOString(),
    profile: {
      did: "did:plc:demo",
      handle,
      displayName: name,
      followers: 18400,
      follows: 820,
      totalPosts: 12400,
      createdAt: "2023-01-12T10:00:00.000Z",
      description: "Demo profile",
    },
    activity: {
      activitiesAnalyzed: 240,
      originalPosts: 86,
      repliesSent: 118,
      externalReplies: 109,
      selfReplies: 9,
      repostsSent: 36,
      uniqueAccountsReplied: 42,
      totalLikesReceived: 6810,
      totalRepostsReceived: 920,
      totalRepliesReceived: 710,
      totalQuotesReceived: 244,
      totalBookmarksReceived: 530,
      weightedInteractionsReceived: 10926,
      hitPosts: 9,
      bestPostInteractions: 1600,
      periodStart: "2026-03-30T12:00:00.000Z",
      periodEnd: "2026-06-28T12:00:00.000Z",
      windowDays: 90,
    },
    scores: {
      overall,
      activity: overall - 8,
      consistency: overall - 6,
      engagement: overall - 2,
      impact: overall,
      replies: overall - 4,
      network: overall - 1,
    },
    presentation: {
      tier,
      border,
      archetype,
      badges: ["legacy-member", "conversation-starter"],
      joinedYear: 2023,
      isRookieMode: false,
      sampleConfidence: 1,
    },
  };
}

export function DemoCard({
  analysis,
  className,
}: {
  analysis: SkyCardAnalysis;
  className?: string;
}) {
  return <SkyCard analysis={analysis} flipped={false} className={className} />;
}
