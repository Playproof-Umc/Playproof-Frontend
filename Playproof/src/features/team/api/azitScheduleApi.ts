// src/features/team/api/azitScheduleApi.ts

import { api } from "@/services/api";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";

/** --- [Types] Backend DTO (Elric 브랜치 기반) --- */

export type ApiError = {
  code: string;
  message: string;
  errors?: { field: string; value: unknown; reason: string }[];
};

export type Result<T> =
  | { statusCode: number; data: T; error: null }
  | { statusCode: number; data: null; error: ApiError };

export type AzitScheduleParticipantResDto = {
  member_id: number;
  nickname: string | null;
  avatar_url: string | null;
  status?: "JOIN" | "DECLINE" | "PENDING" | "CANCELLED";
};

export type AzitScheduleDetailResDto = {
  schedule_id: number;
  title: string;
  max_participants: number;
  game_start_at: string;
  game_end_at: string;
  recruitment_end_at: string;
  current_participants: number;
  is_participated: boolean;
  participants: AzitScheduleParticipantResDto[];
  host_id?: number; // 필요 시 추가
};

export type AzitScheduleListResDto = {
  schedules: AzitScheduleDetailResDto[];
  nextCursor: string | null;
  hasNext: boolean;
};

export type CreateSchedulePayload = {
  title: string;
  max_participants: number;
  game_start_at: string;
  game_end_at: string;
  recruitment_end_at: string;
};

/** --- [Helpers] Data Normalization (develop 브랜치 기반 가공) --- */

const normalizeUser = (p: AzitScheduleParticipantResDto): User => ({
  id: String(p.member_id),
  nickname: p.nickname ?? "이름 없음",
  avatarUrl: p.avatar_url ?? undefined,
});

const normalizeSchedule = (item: AzitScheduleDetailResDto): Schedule => {
  const startDate = new Date(item.game_start_at);
  
  return {
    id: String(item.schedule_id),
    title: item.title,
    dateStr: `${String(startDate.getMonth() + 1).padStart(2, "0")}.${String(startDate.getDate()).padStart(2, "0")}`,
    timeStr: startDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
    fullDate: startDate,
    recruitmentEndAt: new Date(item.recruitment_end_at),
    hostId: String(item.host_id ?? ""),
    maxMembers: item.max_participants,
    participants: item.participants.map(p => ({
      user: normalizeUser(p),
      status: p.status ?? "JOIN"
    })),
    isFeedbackDone: false, // 백엔드 필드 추가 시 매핑
  };
};

/** --- [API Functions] --- */

// 1. 스케줄 목록 조회 (Cursor 기반 페이징 지원)
export async function getAzitSchedules(params: {
  azitId: number;
  cursor?: string | null;
  size?: number;
}): Promise<Schedule[]> {
  const { azitId, cursor, size } = params;
  const qs = new URLSearchParams();
  if (cursor) qs.set("cursor", cursor);
  if (size) qs.set("size", String(size));

  const res = await api.get<Result<AzitScheduleListResDto>>(
    `/azits/${azitId}/schedules${qs.toString() ? `?${qs.toString()}` : ""}`
  );

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "목록 조회 실패");
  }

  return res.data.data.schedules.map(normalizeSchedule);
}

// 2. 스케줄 생성
export async function createAzitSchedule(params: {
  azitId: number;
  payload: CreateSchedulePayload;
}): Promise<Schedule> {
  const { azitId, payload } = params;
  const res = await api.post<Result<AzitScheduleDetailResDto>>(`/azits/${azitId}/schedules`, payload);

  if (res.data.error || ![200, 201].includes(res.data.statusCode)) {
    throw new Error(res.data.error?.message ?? "스케줄 생성 실패");
  }

  return normalizeSchedule(res.data.data);
}

// 3. 참여 / 취소 / 상태 변경 (통합)
export async function updateParticipantStatus(params: {
  azitId: number;
  scheduleId: number;
  action: "join" | "leave" | "patch";
  status?: "JOIN" | "DECLINE" | "PENDING" | "CANCELLED";
}) {
  const { azitId, scheduleId, action, status } = params;
  const url = `/azits/${azitId}/schedules/${scheduleId}/participants`;

  let res;
  if (action === "join") res = await api.post<Result<any>>(url);
  else if (action === "leave") res = await api.delete<Result<any>>(url);
  else res = await api.patch<Result<any>>(url, { status });

  if (res.data.error) throw new Error(res.data.error.message);
  return res.data.data;
}

// 4. 내 참여 상태 조회
export async function getMyParticipationStatus(azitId: number, scheduleId: number) {
  const res = await api.get<Result<AzitScheduleParticipantResDto>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants/me`
  );
  if (res.data.error) return null;
  return res.data.data.status ?? null;
}