// src/features/matching/data/mockMatchingData.ts
import type { MatchingData } from '@/features/matching/types/types';

export const MOCK_MATCHING_DATA: MatchingData[] = [
  {
    id: 1,
    game: '리그오브레전드',
    title: '칼바람 나락 즐겜팟 구함',
    tier: '골드',
    tags: ['즐겜 유저', '소통 원활'],
    azit: '즐겜러들의 쉼터',
    position: ['top', 'mid'],
    memo: '매너 게임 하실 분만 오세요~',
    currentMembers: 2,
    maxMembers: 5,
    time: '10분 전',
    views: 120,
    likes: 5,
    comments: 2,
    tsScore: 80,
    mic: true,
    hostUser: { id: 'user-1', nickname: '페이커팬', avatarUrl: '' }
  },
  {
    id: 2,
    game: '오버워치',
    title: '경쟁전 빡겜 하실 힐러님',
    tier: '다이아몬드',
    tags: ['실력 중심', '오더가능'],
    azit: '신규 생성',
    position: ['support'],
    memo: '마이크 필수입니다.',
    currentMembers: 1,
    maxMembers: 2,
    time: '방금 전',
    views: 50,
    likes: 1,
    comments: 0,
    tsScore: 92,
    mic: true,
    hostUser: { id: 'user-2', nickname: '겐지장인', avatarUrl: '' }
  },
  {
    id: 3,
    game: '리그오브레전드',
    title: '브론즈 탈출하실 분 (마이크X)',
    tier: '브론즈',
    tags: ['협력 유저'],
    azit: '신규 생성',
    position: ['adc', 'sup'],
    memo: '채팅으로 소통해요.',
    currentMembers: 1,
    maxMembers: 2,
    time: '30분 전',
    views: 30,
    likes: 0,
    comments: 0,
    tsScore: 65,
    mic: false,
    hostUser: { id: 'user-3', nickname: '침묵의고수', avatarUrl: '' }
  }
];