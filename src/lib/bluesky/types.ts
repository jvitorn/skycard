export type ArchetypeId =
  | "the-playmaker"
  | "the-viral-spark"
  | "the-headliner"
  | "the-broadcaster"
  | "the-community-builder"
  | "the-consistent-voice"
  | "the-conversationalist"
  | "the-newcomer"
  | "the-all-rounder";

export type BadgeId =
  | "legacy-member"
  | "viral-spark"
  | "conversation-starter"
  | "consistent-player"
  | "community-builder"
  | "rookie";

export type SkyCardProfile = {
  did: string;
  handle: string;
  displayName: string;
  avatar?: string;
  description?: string;
  followers: number;
  follows: number;
  totalPosts: number;
  createdAt?: string;
};

export type NormalizedActivity = {
  uri: string;
  createdAt: string;
  type: "post" | "reply" | "repost";
  isReplyToSelf: boolean;
  parentAuthorDid?: string;
  parentAuthorHandle?: string;
  likes: number;
  repostsReceived: number;
  repliesReceived: number;
  quotesReceived: number;
  bookmarks: number;
  weightedInteractions: number;
};

export type SkyCardActivitySummary = {
  activitiesAnalyzed: number;
  originalPosts: number;
  repliesSent: number;
  externalReplies: number;
  selfReplies: number;
  repostsSent: number;
  uniqueAccountsReplied: number;
  totalLikesReceived: number;
  totalRepostsReceived: number;
  totalRepliesReceived: number;
  totalQuotesReceived: number;
  totalBookmarksReceived: number;
  weightedInteractionsReceived: number;
  hitPosts: number;
  bestPostUri?: string;
  bestPostInteractions: number;
  periodStart: string;
  periodEnd: string;
  windowDays: number;
};

export type SkyCardScores = {
  overall: number;
  activity: number;
  consistency: number;
  engagement: number;
  impact: number;
  replies: number;
  network: number;
};

export type SkyCardPresentation = {
  tier: "base" | "rare" | "elite" | "icon";
  border: "rookie" | "rising" | "established" | "veteran" | "legacy";
  archetype: ArchetypeId;
  badges: BadgeId[];
  joinedYear?: number;
  isRookieMode: boolean;
  sampleConfidence: number;
};

export type SkyCardAnalysis = {
  algorithmVersion: "1.0.0";
  generatedAt: string;
  profile: SkyCardProfile;
  activity: SkyCardActivitySummary;
  scores: SkyCardScores;
  presentation: SkyCardPresentation;
};
