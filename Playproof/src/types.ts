// src/types.ts

// Global User Interface
export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
  isOnline?: boolean;
}

// [Added] 아지트 및 데이터 관련 타입 정의
export interface Schedule {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  fullDate: Date;
  participants: {
    user: User;
    status: 'JOIN' | 'pending' | string;
  }[];
  isCompleted?: boolean;
  needMembers?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'VOICE' | 'TEXT';
  connectedUsers?: User[];
}

export interface Clip {
  id: string;
  date: string;
  thumbnailUrl: string;
}