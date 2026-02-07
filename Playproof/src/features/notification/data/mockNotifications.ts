// src/features/notification/data/mockNotifications.ts

export type NotificationType = 
  | 'FRIEND_REQUEST'   // 친구 요청 
  | 'MATCH_REQUEST'    // 요청 받음 
  | 'MATCH_REJECT'     // 요청 거절 
  | 'AZIT_SCHEDULE'    // 아지트 일정 
  | 'SYSTEM';          // 시스템

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  isRead: boolean;
  sender?: {
    id: string; // 프로필 이동용 ID 추가
    nickname: string;
    avatarUrl?: string;
  };
  targetId?: string; // 이동할 대상 ID (채팅방 ID, 아지트 ID 등)
  azitId?: number;
  scheduleId?: string;
}

const BASE_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'MATCH_REQUEST',
    message: '페이커팬님이 "칼바람 나락 즐겜팟"에 초대를 보냈습니다.',
    time: '방금 전',
    isRead: false,
    sender: { id: 'user1', nickname: '페이커팬' },
    targetId: 'match_1'
  },
  {
    id: 2,
    type: 'FRIEND_REQUEST',
    message: '겐지장인님이 친구 요청을 보냈습니다.',
    time: '10분 전',
    isRead: false,
    sender: { id: 'user2', nickname: '겐지장인' }
  },
  {
    id: 3,
    type: 'MATCH_REJECT',
    message: '신청하신 "빡겜러 구함" 파티 참여가 거절되었습니다.',
    time: '1시간 전',
    isRead: true,
    sender: { id: 'user3', nickname: '파티장' }
  },
  {
    id: 5,
    type: 'FRIEND_REQUEST',
    message: '힐러유저님이 친구 요청을 보냈습니다.',
    time: '1일 전',
    isRead: true,
    sender: { id: 'user4', nickname: '힐러유저' }
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = BASE_NOTIFICATIONS;

import { MOCK_MY_AZITS, mockSchedulesByAzit } from '@/features/team/data/mockTeamData';

export const buildMockNotifications = (currentUserId: string): Notification[] => {
  const scheduleNotifications: Notification[] = [];
  let idCursor = 100;

  Object.entries(mockSchedulesByAzit).forEach(([azitId, schedules]) => {
    const azit = MOCK_MY_AZITS.find((item) => item.id === Number(azitId));
    schedules.forEach((schedule) => {
      if (String(schedule.hostId) !== String(currentUserId)) return;
      const now = new Date();
      const statusLabel = schedule.fullDate <= now ? "완료된" : "시작된";
      scheduleNotifications.push({
        id: idCursor++,
        type: 'AZIT_SCHEDULE',
        message: `아지트 "${azit?.name ?? '아지트'}"의 "${schedule.title}" 일정이 ${statusLabel} 상태입니다.`,
        time: '방금 전',
        isRead: false,
        azitId: Number(azitId),
        scheduleId: schedule.id,
        targetId: `azit_${azitId}`,
      });
    });
  });

  return [...BASE_NOTIFICATIONS, ...scheduleNotifications];
};
