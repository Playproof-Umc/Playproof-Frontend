//src/data/mockData.ts
import type { Schedule, Channel, User, Clip } from '@/types';

// 1. 멤버 리스트
export const mockMembers: User[] = [
  { id: 'u1', nickname: '레나', avatarUrl: '', isOnline: true },
  { id: 'u2', nickname: '엘릭', avatarUrl: '', isOnline: false },
  { id: 'u3', nickname: '발베니', avatarUrl: '', isOnline: true },
  { id: 'u4', nickname: '구름', avatarUrl: '', isOnline: false }
];

// 2. 일정 데이터
export const mockSchedules: Schedule[] = [
  {
    id: '1', title: '데바데 5인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-22'),
    participants: [
      { user: mockMembers[0], status: 'JOIN' },
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[2], status: 'JOIN' },
      { user: mockMembers[3], status: 'JOIN' },
    ]
  },
  {
    id: '2', title: '데바데 5인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-08'),
    isCompleted: true,
    participants: [
      { user: mockMembers[0], status: 'JOIN' },
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[2], status: 'JOIN' },
      { user: mockMembers[3], status: 'JOIN' },
      { user: { id: 'u5', nickname: '유저5', avatarUrl: '' } as User, status: 'JOIN' },
    ]
  },
  {
    id: '3', title: '데바데 3인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-08'),
    needMembers: true,
    participants: [
       { user: mockMembers[0], status: 'JOIN' },
       { user: mockMembers[1], status: 'JOIN' },
       { user: mockMembers[2], status: 'JOIN' },
    ]
  }
];

// 3. 보이스 채널
export const mockVoiceChannels: Channel[] = [
  { 
    id: 'v1', name: '로비', type: 'VOICE', 
    connectedUsers: [ mockMembers[0], mockMembers[2] ] 
  },
  { id: 'v2', name: '스크림 룸', type: 'VOICE', connectedUsers: [] }
  // 필요하면 더 추가...
];

// 4. 채팅 채널
export const mockChatChannels: Channel[] = [
  { id: 'c1', name: '팀채팅', type: 'TEXT' },
  { id: 'c2', name: '수다방', type: 'TEXT' },
  { id: 'c3', name: '공지사항', type: 'TEXT' }
];

// 5. 클립
export const mockClips: Clip[] = [
  { id: 'cl1', date: '2025.12.18', thumbnailUrl: '' },
  { id: 'cl2', date: '2025.12.16', thumbnailUrl: '' },
  { id: 'cl3', date: '2025.12.13', thumbnailUrl: '' }
];