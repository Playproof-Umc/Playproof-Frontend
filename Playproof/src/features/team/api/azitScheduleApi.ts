// src/features/team/api/azitScheduleApi.ts

import { api } from "@/services/api";

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

export async function getAzitSchedules(params: {
  azitId: number;
  cursor?: string | null;
  size?: number;
}): Promise<AzitScheduleListResDto> {
  const { azitId, cursor, size } = params;
  const qs = new URLSearchParams();
  if (cursor) qs.set("cursor", cursor);
  if (size) qs.set("size", String(size));

  const res = await api.get<Result<AzitScheduleListResDto>>(
    `/azits/${azitId}/schedules${qs.toString() ? `?${qs.toString()}` : ""}`
  );
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "스케줄 목록 조회 실패");
  }
  return res.data.data;
}

export async function createAzitSchedule(params: {
  azitId: number;
  payload: CreateSchedulePayload;
}): Promise<AzitScheduleDetailResDto> {
  const { azitId, payload } = params;
  const res = await api.post<Result<AzitScheduleDetailResDto>>(`/azits/${azitId}/schedules`, payload);
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 201)) {
    throw new Error(res.data.error?.message ?? "스케줄 생성 실패");
  }
  return res.data.data;
}
