// src/types.ts

// Global User Interface
export interface User {
  id: string;
  nickname: string;
  avatarUrl?: string;
  isOnline?: boolean;
  statusMessage?: string;
}

// 도메인별 타입은 각 feature의 types로 이동
