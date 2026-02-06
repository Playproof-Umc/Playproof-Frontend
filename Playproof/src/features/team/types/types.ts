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

export interface CustomMatchSchedule {
  id: string;
  title: string;        // 유저가 직접 입력하는 제목
  startTime: string;    // 시작 시간 (예: "20:00")
  targetDate: Date;     // 매칭 마감 시각 (카운트다운 기준)
  currentParticipants: number;
  maxParticipants: number;
  status: '모집중' | '매칭완료';
}