// src/features/matching/types/types.ts
export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
}

export interface MatchingData {
  id: number;
  game: string;
  title: string;
  tier: string;
  tags: string[];
  azit: string;
  position: string[];
  memo: string;
  currentMembers: number;
  maxMembers: number;
  time: string;
  views: number;
  likes: number;
  comments: number;
  tsScore: number;
  mic: boolean; // 마이크 사용 여부
  hostUser: User;
}

export interface FilterState {
  minTs: string;
  memberCount: string;
  tags: string[];
  useMic: boolean;
  positions: string[];
  tiers: string[];
}