// src/features/team/api/azitScheduleApi.ts

import { api } from "@/services/api";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";

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

export async function participateSchedule(params: {
  azitId: number;
  scheduleId: number;
}): Promise<void> {
  const { azitId, scheduleId } = params;
  const res = await api.post<Result<null>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 204)) {
    throw new Error(res.data.error?.message ?? "스케줄 참여 실패");
  }
}

export async function cancelScheduleParticipation(params: {
  azitId: number;
  scheduleId: number;
}): Promise<void> {
  const { azitId, scheduleId } = params;
  const res = await api.delete<Result<null>>(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 204)) {
    throw new Error(res.data.error?.message ?? "스케줄 참여 취소 실패");
  }
}

export async function joinAzitScheduleParticipant(
  azitId: number,
  scheduleId: string | number
) {
  const res = await api.post(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  return res.data?.data ?? res.data;
}

export async function updateAzitScheduleParticipantStatus(
  azitId: number,
  scheduleId: string | number,
  status: "JOIN" | "DECLINE" | "PENDING" | "CANCELLED"
) {
  try {
    const res = await api.patch(
      `/azits/${azitId}/schedules/${scheduleId}/participants`,
      {
        status,
      }
    );
    return res.data?.data ?? res.data;
  } catch (error) {
    const message = (error as any)?.response?.data?.error?.message;
    const raw = (error as any)?.response?.data;
    const isHtmlCannotPatch =
      typeof raw === "string" && raw.includes("Cannot PATCH");
    const isMethodNotAllowed =
      isHtmlCannotPatch || message === "Cannot PATCH";
    if (!isMethodNotAllowed) {
      throw error;
    }

    if (status === "JOIN") {
      const res = await api.post(
        `/azits/${azitId}/schedules/${scheduleId}/participants`
      );
      return res.data?.data ?? res.data;
    }

    if (status === "DECLINE" || status === "CANCELLED") {
      const res = await api.delete(
        `/azits/${azitId}/schedules/${scheduleId}/participants`
      );
      return res.data?.data ?? res.data;
    }

    return null;
  }
}

export type MyParticipantStatus = "JOIN" | "DECLINE" | "PENDING" | "CANCELLED";

export async function getAzitScheduleMyParticipantStatus(
  azitId: number,
  scheduleId: string | number
): Promise<MyParticipantStatus | null> {
  const res = await api.get(
    `/azits/${azitId}/schedules/${scheduleId}/participants/me`
  );
  const data = res.data?.data ?? res.data;
  const statusRaw =
    data?.status ??
    data?.participation_status ??
    data?.state ??
    data?.join_status ??
    data?.joinStatus ??
    data?.participant?.status ??
    data?.participant?.participation_status;

  if (statusRaw === "JOIN" || statusRaw === "DECLINE" || statusRaw === "PENDING" || statusRaw === "CANCELLED") {
    return statusRaw;
  }

  return null;
}

export async function getAzitScheduleParticipantsByStatus(
  azitId: number,
  scheduleId: string | number,
  status: "JOIN" | "DECLINE" | "PENDING" | "CANCELLED"
): Promise<User[]> {
  const res = await api.get(
    `/azits/${azitId}/schedules/${scheduleId}/participants`,
    { params: { status } }
  );
  const data = res.data?.data ?? res.data;
  const rawList = Array.isArray(data?.participants)
    ? data.participants
    : Array.isArray(data?.members)
      ? data.members
      : Array.isArray(data)
        ? data
        : [];

  const normalizeUser = (item: Record<string, any> | undefined): User | null => {
    if (!item) return null;
    const id = item.id ?? item.user_id ?? item.userId ?? "";
    const nickname = item.nickname ?? item.name ?? "";
    const avatarUrl =
      item.avatarUrl ??
      item.avatar_url ??
      item.profile_image ??
      item.profileImage ??
      item.profile_url ??
      item.profileUrl ??
      item.image_url ??
      item.imageUrl ??
      item.avatar ??
      undefined;

    return {
      id: String(id),
      nickname: String(nickname),
      avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
    };
  };

  return rawList
    .map((item: any) => normalizeUser(item.user ?? item.member?.user ?? item.member ?? item))
    .filter((u): u is User => Boolean(u));
}

export async function leaveAzitScheduleParticipant(
  azitId: number,
  scheduleId: string | number
) {
  const res = await api.delete(
    `/azits/${azitId}/schedules/${scheduleId}/participants`
  );
  return res.data?.data ?? res.data;
}
