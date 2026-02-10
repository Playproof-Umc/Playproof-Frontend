// src/features/user/types/types.ts

// src/features/user/types.ts

export interface UserBasicInfo {
  id: string | number;
  nickname: string;
  avatarUrl?: string;
  game?: string;      // 현재 플레이 중인 게임 
  status?: string;    // 상태 메시지나 현재 상태 
  isOnline?: boolean; // 접속 여부 
  tier?: string;      // 티어 정보 
}

// 친구 관계를 나타내는 확장 타입
export interface Friend extends UserBasicInfo {
  isFavorite?: boolean;
  friendedAt?: string;
}
