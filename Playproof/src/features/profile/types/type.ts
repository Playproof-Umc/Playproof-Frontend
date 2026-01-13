// src/features/profile/types/type.ts
export interface UserProfile {
  id: string | number;
  nickname: string;
  tsScore: number;
  mannerScore: number;
  introduction: string;
  mostGames: string[];
  tags: string[];
}