// src/features/mypage/types/types.ts

import type { MatchingData } from '@/features/matching/types';
import type { HighlightPost, BoardPost } from '@/features/community/types';

export interface MyProfileData {
  userId: string;
  nickname: string;
  rank: number;
  profileImage?: string;
  bio: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  tierScore: number;
  ranking: {
    rank: number;
    percentile: number;
  };
  temperScore: number;
  positivityRating: number;
  playStyles: string[];
  preferredTags: string[];
  feedbackTags: string[];
  gameAccounts: {
    game: string;
    nickname: string;
    tag: string;
  }[];
  gameStats: {
    game: string;
    tier?: string;
    playTime?: string;
    position?: string;
    totalGames?: number;
    winRate?: number;
    kda?: number;
  }[];
  favoriteGames: {
    rank?: number;
    game: string;
  }[];
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
  matchingPosts: MatchingData[];
  highlightPosts: HighlightPost[];
  communityPosts: BoardPost[];
}
