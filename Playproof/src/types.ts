//src/types.ts
// 유저 정보
export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
  isOnline?: boolean;
}

// 채널 정보
export interface Channel {
  id: string;
  name: string;
  type: 'VOICE' | 'TEXT';
  connectedUsers?: User[];
}

// 일정 정보
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

// 클립(하이라이트) 정보
export interface Clip {
  id: string;
  date: string;
  thumbnailUrl: string;
}