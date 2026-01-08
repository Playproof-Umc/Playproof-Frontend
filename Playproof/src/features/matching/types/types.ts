//src/features/matching/types/types.ts
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
  hostUser: {
    id: string | number;
    nickname: string;
    avatarUrl?: string;
  };
}