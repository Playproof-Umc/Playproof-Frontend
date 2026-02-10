// src/features/team/types/types.ts
import type { User } from "@/types";

// ✅ 외부에서 "@/features/team/types/types"로 User를 import 할 수 있게 re-export
export type { User } from "@/types";

// 채널 정보
export interface Channel {
  id: string;
  name: string;
  type: "VOICE" | "TEXT";
  connectedUsers?: User[];
}

// 일정 정보 (UI 조건 처리를 위한 필드 추가)
export interface Schedule {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  fullDate: Date; // 마감/게임 시간

  hostId: string; // 방장 ID (모집중 상태 판단용)
  maxMembers: number; // 목표 인원 (추가 게이머 찾기 조건용)
  isFeedbackDone?: boolean; // 피드백 완료 여부 (완료됨 상태용)

  participants: {
    user: User | null;
    status: "JOIN" | "DECLINE" | "PENDING";
  }[];
}

export interface CustomMatchSchedule {
  id: string;
  title: string;
  startTime: string;
  targetDate: Date;
  currentParticipants: number;
  maxParticipants: number;
  status: "모집중" | "매칭완료";
}
