// src/features/team/data/mockTeamData.ts
import type { Azit, Schedule, Channel, Clip } from "../types/types";
import type { User } from "@/types";

// 내 아지트 목록
export const MOCK_MY_AZITS: Azit[] = [
  { id: 1, name: 'Playproof', memberCount: 4, icon: '' },
  { id: 2, name: 'LoL Party', memberCount: 12, icon: 'https://via.placeholder.com/48/2563eb/FFFFFF?text=L' },
  { id: 3, name: 'Dev Study', memberCount: 8, icon: 'https://via.placeholder.com/48/16a34a/FFFFFF?text=D' },
];

// 멤버 목록
export const mockMembers: User[] = [
  { id: "1", nickname: '레나', statusMessage: '즐겜 유저', isOnline: true },
  { id: "2", nickname: '엘릭', statusMessage: 'FE 개발 중...', isOnline: true },
  { id: "3", nickname: '카이', statusMessage: '밥 먹으러 감', isOnline: false },
  { id: "4", nickname: '제이', statusMessage: '', isOnline: false },
  { id: "5", nickname: '모모', statusMessage: '데바데 할 사람?', isOnline: true },
];

// 아지트별 멤버 매핑
export const mockMembersByAzit: Record<number, User[]> = {
  1: mockMembers.slice(0, 3),
  2: mockMembers.slice(0, 5),
  3: mockMembers.slice(2, 5),
};

// [중요] 모든 케이스 테스트를 위한 스케줄 데이터
// 현재 로그인한 유저 ID는 '1'(레나)로 가정합니다.
export const mockSchedules: Schedule[] = [
  // Case 1: [방장] 모집중 (내가 방장이고, 시간이 남음)
  {
    id: '1',
    title: 'Case 1: [방장] 모집중',
    dateStr: '02.20',
    timeStr: '20:00',
    fullDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1일 뒤
    hostId: '1', // 나
    maxMembers: 4,
    participants: [
      { user: mockMembers[0], status: 'JOIN' }, // 나
      { user: mockMembers[1], status: 'JOIN' },
    ],
    isFeedbackDone: false,
  },
  // Case 2: [멤버] 신청 완료 (참여 확정 상태)
  {
    id: '2',
    title: 'Case 2: [멤버] 신청 완료',
    dateStr: '02.21',
    timeStr: '19:00',
    fullDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 48), // 2일 뒤
    hostId: '2', // 다른 사람
    maxMembers: 5,
    participants: [
      { user: mockMembers[1], status: 'JOIN' }, 
      { user: mockMembers[0], status: 'JOIN' }, // 나 (참여)
    ],
    isFeedbackDone: false,
  },
  // Case 3: [멤버] 거절함 (불참 선택)
  {
    id: '3',
    title: 'Case 3: [멤버] 거절함',
    dateStr: '02.22',
    timeStr: '21:00',
    fullDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 72), // 3일 뒤
    hostId: '2',
    maxMembers: 5,
    participants: [
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[0], status: 'DECLINE' }, // 나 (거절)
    ],
    isFeedbackDone: false,
  },
  // Case 4: [멤버] 참여/불참 선택 전 (PENDING)
  {
    id: '4',
    title: 'Case 4: [멤버] 참여/불참 대기',
    dateStr: '02.23',
    timeStr: '22:00',
    fullDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 96), // 4일 뒤
    hostId: '3',
    maxMembers: 4,
    participants: [
      { user: mockMembers[2], status: 'JOIN' },
      // 나는 명단에 없거나 PENDING 상태
      { user: mockMembers[0], status: 'PENDING' }, 
    ],
    isFeedbackDone: false,
  },
  // Case 5: [공통] 추가 게이머 찾기 (시간 종료 + 인원 미달)
  {
    id: '5',
    title: 'Case 5: 시간 종료 & 인원 미달',
    dateStr: '오늘',
    timeStr: '18:00',
    fullDate: new Date(new Date().getTime() - 1000 * 60 * 60), // 1시간 전 (시간 지남)
    hostId: '2',
    maxMembers: 5, // 목표 5명
    participants: [
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[2], status: 'JOIN' },
      // 2명밖에 없음 -> 미달
    ],
    isFeedbackDone: false,
  },
  // Case 6: [공통] 피드백 남기기 (시간 종료 + 인원 충족)
  {
    id: '6',
    title: 'Case 6: 정상 종료 (피드백)',
    dateStr: '오늘',
    timeStr: '14:00',
    fullDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 5), // 5시간 전
    hostId: '2',
    maxMembers: 2,
    participants: [
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[0], status: 'JOIN' },
    ],
    isFeedbackDone: false,
  },
  // Case 7: [공통] 완료됨 (피드백까지 끝남)
  {
    id: '7',
    title: 'Case 7: 모든 절차 완료',
    dateStr: '어제',
    timeStr: '20:00',
    fullDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 어제
    hostId: '1',
    maxMembers: 4,
    participants: [
      { user: mockMembers[0], status: 'JOIN' },
    ],
    isFeedbackDone: true, // 완료됨
  },
];

export const mockSchedulesByAzit: Record<number, Schedule[]> = {
  1: mockSchedules,
  2: [],
  3: [],
};

// ... (채널, 클립 데이터는 기존과 동일하게 유지)
export const mockVoiceChannels: Channel[] = [
  { id: '1', name: '로비', type: 'VOICE', connectedUsers: [] },
  { id: '2', name: '스크림 룸', type: 'VOICE', connectedUsers: [mockMembers[0], mockMembers[1]] },
];

export const mockClips: Clip[] = [
  { id: '1', date: '2시간 전', thumbnailUrl: 'https://via.placeholder.com/300x160/000000/FFFFFF?text=PentaKill' },
];
export const mockClipsByAzit: Record<number, Clip[]> = { 1: mockClips, 2: [], 3: [] };
