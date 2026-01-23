// src/features/team/types.ts
import type { User } from '@/types'; 

// 채널 정보 (Team/Azit 전용)
export interface Channel {
  id: string;
  name: string;
  type: 'VOICE' | 'TEXT';
  connectedUsers?: User[];
}

// 일정 정보 (Team/Azit 전용)
export interface Schedule {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  fullDate: Date;
  isCompleted?: boolean;
  needMembers?: boolean;
  participants: {
    user: User | null;
    status: 'JOIN' | 'DECLINE' | 'PENDING';
  }[];
}

// 클립 정보 (Team/Azit 전용)
export interface Clip {
  id: string;
  date: string;
  thumbnailUrl: string;
}