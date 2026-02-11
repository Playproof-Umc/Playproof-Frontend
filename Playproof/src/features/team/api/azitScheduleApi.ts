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

export type AzitScheduleParticipationStatus = "JOIN" | "DECLINE" | "PENDING" | "CANCELLED";

export type AzitScheduleCreateReqDto = {
  title: string;
  max_participants: number;
  game_start_at: string;
  game_end_at: string;
  recruitment_end_at: string;
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

export type AzitScheduleResDto = {
  schedule_id: number;
  title: string;
  max_participants: number;
  game_start_at: string;
  game_end_at: string;
  recruitment_end_at: string;
};

export type AzitScheduleListResDto = {
  schedules: AzitScheduleDetailResDto[];
  nextCursor: string | null;
  hasNext: boolean;
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
  payload: AzitScheduleCreateReqDto;
}): Promise<AzitScheduleResDto> {
  const { azitId, payload } = params;
  const res = await api.post<Result<AzitScheduleResDto>>(`/azits/${azitId}/schedules`, payload);
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 201)) {
    throw new Error(res.data.error?.message ?? "스케줄 생성 실패");
  }
  return res.data.data;
}

export async function joinAzitScheduleParticipant(params: {
  azitId: number;
  scheduleId: string | number;
}) {
  const { azitId, scheduleId } = params;
  const res = await api.post<Result<null>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  if (res.data.error) {
    throw new Error(res.data.error.message);
  }
  return res.data.data;
}

export async function updateAzitScheduleParticipantStatus(params: {
  azitId: number;
  scheduleId: string | number;
  status: AzitScheduleParticipationStatus;
}) {
  const { azitId, scheduleId, status } = params;
  const res = await api.patch<Result<null>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants`,
    { is_participation: status }
  );
  if (res.data.error) {
    throw new Error(res.data.error.message);
  }
  return res.data.data;
}

export async function leaveAzitScheduleParticipant(params: {
  azitId: number;
  scheduleId: string | number;
}) {
  const { azitId, scheduleId } = params;
  const res = await api.delete<Result<null>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  if (res.data.error) {
    throw new Error(res.data.error.message);
  }
  return res.data.data;
}

export async function getAzitScheduleMyParticipationStatus(params: {
  azitId: number;
  scheduleId: string | number;
}): Promise<AzitScheduleParticipationStatus | null> {
  const { azitId, scheduleId } = params;
  const res = await api.get<Result<{ is_participation: AzitScheduleParticipationStatus }>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants/me`
  );
  if (res.data.error) {
    return null;
  }
  return res.data.data.is_participation ?? null;
}
