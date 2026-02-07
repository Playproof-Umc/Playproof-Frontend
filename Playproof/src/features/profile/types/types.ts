// src/features/profile/types/types.ts

// src/features/profile/types.ts
export interface UserProfile {
  id: string | number;
  nickname: string;
  tsScore: number;
  mannerScore: number;
  introduction: string;
  mostGames: string[];
  tags: string[];
}
