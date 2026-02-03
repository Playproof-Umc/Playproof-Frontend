// src/features/team/data/mockTeamData.ts
import type { Azit, User, Schedule, Channel, Clip } from '../types';

// 내 아지트 목록 (네비게이션용)
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

// 멤버 목록
export const mockMembers: User[] = [
  { id: 1, nickname: '레나', statusMessage: '즐겜 유저', isOnline: true },
  { id: 2, nickname: '엘릭', statusMessage: 'FE 개발 중...', isOnline: true },
  { id: 3, nickname: '카이', statusMessage: '밥 먹으러 감', isOnline: false },
  { id: 4, nickname: '제이', statusMessage: '', isOnline: false },
  { id: 5, nickname: '모모', statusMessage: '데바데 할 사람?', isOnline: true },
];

export const mockMembersByAzit: Record<number, User[]> = {
  1: [
    { id: 1, nickname: '레나', statusMessage: '즐겜 유저', isOnline: true },
    { id: 2, nickname: '엘릭', statusMessage: 'FE 개발 중...', isOnline: true },
    { id: 3, nickname: '카이', statusMessage: '밥 먹으러 감', isOnline: false },
  ],
  2: [
    { id: 6, nickname: '로이', statusMessage: 'LoL 랭크 올림', isOnline: true },
    { id: 7, nickname: '노아', statusMessage: '정글 연습 중', isOnline: true },
    { id: 8, nickname: '베카', statusMessage: '서폿 유저', isOnline: false },
  ],
  3: [
    { id: 9, nickname: '수지', statusMessage: '스터디 집중', isOnline: true },
    { id: 10, nickname: '도윤', statusMessage: 'CS 기록 중', isOnline: false },
    { id: 11, nickname: '하린', statusMessage: '자료 공유 가능', isOnline: true },
  ],
};

// 스케줄 목록
export const mockSchedules: Schedule[] = [
  {
    id: 1,
    title: '데바데 4인큐',
    type: 'regular',
    date: new Date(new Date().setHours(20, 0, 0, 0)), 
    participants: [mockMembers[0], mockMembers[1], mockMembers[2]],
    maxParticipants: 4,
    isCompleted: false,
  },
  {
    id: 2,
    title: '리그 5인 랭크',
    type: 'instant',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    participants: [mockMembers[1], mockMembers[3]],
    maxParticipants: 5,
    isCompleted: false,
  },
  {
    id: 3,
    title: '발로란트 5인 스크림',
    type: 'regular',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    participants: [mockMembers[2], mockMembers[4]],
    maxParticipants: 5,
    isCompleted: false,
  },
];

export const mockSchedulesByAzit: Record<number, Schedule[]> = {
  1: [
    {
      id: 1,
      title: '데바데 4인큐',
      type: 'regular',
      date: new Date(new Date().setHours(20, 0, 0, 0)),
      participants: [mockMembers[0], mockMembers[1], mockMembers[2]],
      maxParticipants: 4,
      isCompleted: false,
    },
  ],
  2: [
    {
      id: 2,
      title: '리그 5인 랭크',
      type: 'instant',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      participants: [mockMembers[1], mockMembers[3]],
      maxParticipants: 5,
      isCompleted: false,
    },
  ],
  3: [
    {
      id: 3,
      title: '발로란트 5인 스크림',
      type: 'regular',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      participants: [mockMembers[2], mockMembers[4]],
      maxParticipants: 5,
      isCompleted: false,
    },
  ],
};

// 음성/채팅 채널 목록
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
    participants: [mockMembers[0], mockMembers[1]], // 참여중
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

// 하이라이트 클립 목록
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

export const mockClipsByAzit: Record<number, Clip[]> = {
  1: [
    {
      id: 1,
      title: '펜타킬 하이라이트',
      author: '레나',
      thumbnailUrl: 'https://via.placeholder.com/300x160/000000/FFFFFF?text=PentaKill',
      views: 120,
      duration: '0:45',
      createdAt: '2시간 전',
    },
  ],
  2: [
    {
      id: 2,
      title: '리그 역전 하이라이트',
      author: '로이',
      thumbnailUrl: 'https://via.placeholder.com/300x160/2563eb/FFFFFF?text=LoL',
      views: 210,
      duration: '1:05',
      createdAt: '5시간 전',
    },
  ],
  3: [
    {
      id: 3,
      title: '스터디 밈 모음',
      author: '수지',
      thumbnailUrl: 'https://via.placeholder.com/300x160/16a34a/FFFFFF?text=Study',
      views: 45,
      duration: '0:30',
      createdAt: '어제',
    },
  ],
};
