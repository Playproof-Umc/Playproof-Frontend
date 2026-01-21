export interface MyProfileData {
  nickname: string;
  profileImage?: string;
  temperScore: number;
  tier: string;
  favoriteGames: string[];
  playStyle: string[];
  feedbackTags: {
    positive: Array<{ label: string; count: number }>;
    negative: Array<{ label: string; count: number }>;
  };
  gameAccounts: Array<{
    game: string;
    accountName: string;
    tier: string;
  }>;
  stats: {
    matchCount: number;
    winRate: number;
    avgPlayTime: string;
  };
}

export interface FeedbackData {
  id: string;
  fromUser: {
    userId: string;
    nickname: string;
    profileImage?: string;
  };
  game: string;
  temperScoreChange: number;
  tags: string[];
  memo?: string;
  createdAt: string;
}

export interface FriendData {
  userId: string;
  nickname: string;
  profileImage?: string;
  isOnline: boolean;
  lastSeen?: string;
  tier?: string;
  tierScore?: number;
}

export interface BlockedUserData {
  userId: string;
  nickname: string;
  profileImage?: string;
  blockedAt: string;
  tier?: string;
  tierScore?: number;
}

export interface MyPostsData {
  matchingPosts: any[];
  highlightPosts: any[];
  communityPosts: any[];
}