// src/features/matching/types/types.ts

// src/features/matching/types.ts

import type { User } from '@/types'; 

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
  isLiked?: boolean;
  comments: number;
  tsScore: number;
  mic: boolean;
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
