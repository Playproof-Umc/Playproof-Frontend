// src/features/team/data/mockTeamData.ts
import type { Azit, User, Schedule, Channel, Clip } from '../types';

// 1. 내 아지트 목록 (네비게이션용)
export const MOCK_MY_AZITS: Azit[] = [
  { 
    id: 1, 
    name: 'Playproof', 
    memberCount: 4, 
    icon: '' // 아이콘이 없으면 기본 UI 표시
  },
  { 
    id: 2, 
    name: 'LoL Party', 
    memberCount: 12, 
    icon: 'https://via.placeholder.com/48/2563eb/FFFFFF?text=L' 
  },
  { 
    id: 3, 
    name: 'Dev Study', 
    memberCount: 8, 
    icon: 'https://via.placeholder.com/48/16a34a/FFFFFF?text=D' 
  },
];

// 2. 멤버 목록
export const mockMembers: User[] = [
  { id: 1, nickname: '레나', statusMessage: '즐겜 유저', isOnline: true },
  { id: 2, nickname: '엘릭', statusMessage: 'FE 개발 중...', isOnline: true },
  { id: 3, nickname: '카이', statusMessage: '밥 먹으러 감', isOnline: false },
  { id: 4, nickname: '제이', statusMessage: '', isOnline: false },
  { id: 5, nickname: '모모', statusMessage: '데바데 할 사람?', isOnline: true },
];

// 3. 스케줄 목록
export const mockSchedules: Schedule[] = [
  {
    id: 1,
    title: '데바데 5인큐',
    type: 'regular',
    date: new Date(new Date().setHours(20, 0, 0, 0)), // 오늘 저녁 8시
    participants: [mockMembers[0], mockMembers[1], mockMembers[2]],
    maxParticipants: 5,
    isCompleted: false,
  },
  {
    id: 2,
    title: '발로란트 내전',
    type: 'instant',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // 내일
    participants: [mockMembers[0], mockMembers[4]],
    maxParticipants: 10,
    isCompleted: false,
  },
];

// 4. 음성/채팅 채널 목록
export const mockVoiceChannels: Channel[] = [
  {
    id: 1,
    name: '로비',
    type: 'voice',
    category: 'lobby',
    participants: [],
  },
  {
    id: 2,
    name: '스크림 룸',
    type: 'voice',
    category: 'game',
    participants: [mockMembers[0], mockMembers[1]], // 레나, 엘릭 참여 중
  },
  {
    id: 3,
    name: '팀 채팅',
    type: 'text',
    category: 'chat',
    participants: [],
  },
  {
    id: 4,
    name: '수다방',
    type: 'text',
    category: 'chat',
    participants: [],
  },
];

// 5. 하이라이트 클립 목록
export const mockClips: Clip[] = [
  {
    id: 1,
    title: '펜타킬 하이라이트',
    author: '레나',
    thumbnailUrl: 'https://via.placeholder.com/300x160/000000/FFFFFF?text=PentaKill',
    views: 120,
    duration: '0:45',
    createdAt: '2시간 전',
  },
  {
    id: 2,
    title: '아니 이걸 못 잡아?',
    author: '엘릭',
    thumbnailUrl: 'https://via.placeholder.com/300x160/333333/FFFFFF?text=Fail',
    views: 55,
    duration: '0:12',
    createdAt: '1일 전',
  },
  {
    id: 3,
    title: '슈퍼 세이브',
    author: '모모',
    thumbnailUrl: 'https://via.placeholder.com/300x160/1e293b/FFFFFF?text=SuperSave',
    views: 89,
    duration: '1:20',
    createdAt: '3일 전',
  },
];