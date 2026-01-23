// src/features/team/types/index.ts

// 사용자 (팀 멤버) 타입
export interface User {
  id: number;
  nickname: string;
  avatarUrl?: string; // 프로필 이미지 URL
  statusMessage?: string; // 상태 메시지
  isOnline?: boolean; // 온라인 여부
}

// 아지트 (팀 공간) 타입
export interface Azit {
  id: number;
  name: string;
  icon?: string; // 아지트 아이콘 URL (없으면 기본 색상/텍스트 표시)
  memberCount: number;
  description?: string;
}

// 일정 (스케줄) 타입
export interface Schedule {
  id: number;
  title: string;
  date: Date; // 날짜 객체
  type: 'regular' | 'instant'; // 정기 매칭 vs 번개
  participants: User[]; // 참여자 목록
  maxParticipants?: number; // 최대 인원
  isCompleted?: boolean; // 완료 여부
}

// 음성/채팅 채널 타입
export interface Channel {
  id: number;
  name: string;
  type: 'voice' | 'text';
  category?: 'lobby' | 'game' | 'chat'; // 채널 카테고리
  participants: User[]; // 현재 접속 중인 유저 (음성 채널용)
}

// 하이라이트 클립 타입
export interface Clip {
  id: number;
  thumbnailUrl: string;
  title: string;
  author: string;
  views: number;
  duration: string; // 예: "0:30"
  createdAt: string;
}