// src/features/team/api/azitScheduleApi.ts

import { api } from "@/services/api";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";

export type CreateAzitScheduleRequest = {
  title: string;
  maxParticipants: number;
  gameStartAt: string;
  gameEndAt: string;
  recruitmentEndAt: string;
};

export type CreateAzitScheduleResponse = {
  scheduleId?: number | string;
  data?: any;
};

type RawSchedule = Record<string, any>;

const normalizeUser = (item: Record<string, any> | undefined): User | null => {
  if (!item) return null;
  const id = item.id ?? item.user_id ?? item.userId ?? "";
  const nickname = item.nickname ?? item.name ?? "";
  const avatarUrl = item.avatarUrl ?? item.avatar_url ?? item.profile_image ?? undefined;

  return {
    id: String(id),
    nickname: String(nickname),
    avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
  };
};

const normalizeSchedule = (item: RawSchedule): Schedule => {
  const id = item.id ?? item.schedule_id ?? item.scheduleId ?? String(Date.now());
  const title = item.title ?? item.name ?? "";
  const maxMembers =
    item.maxMembers ?? item.max_members ?? item.max_participants ?? item.maxParticipants ?? 0;
  const hostId = item.host_id ?? item.hostId ?? item.user_id ?? item.userId ?? "";
  const isFeedbackDone = item.isFeedbackDone ?? item.is_feedback_done ?? false;

  const startAtRaw =
    item.game_start_at ?? item.gameStartAt ?? item.start_at ?? item.startAt ?? item.start_time;
  const startDate = startAtRaw ? new Date(startAtRaw) : new Date();

  const timeStr = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = `${String(startDate.getMonth() + 1).padStart(2, "0")}.${String(
    startDate.getDate()
  ).padStart(2, "0")}`;

  const rawParticipants = Array.isArray(item.participants)
    ? item.participants
    : Array.isArray(item.members)
      ? item.members
      : [];

  const participants = rawParticipants.map((p: any) => {
    const user = normalizeUser(p.user ?? p.member ?? p);
    const statusRaw = p.status ?? p.participation_status ?? p.state ?? "PENDING";
    const status =
      statusRaw === "JOIN" || statusRaw === "DECLINE" || statusRaw === "PENDING"
        ? statusRaw
        : "PENDING";
    return { user, status } as Schedule["participants"][number];
  });

  return {
    id: String(id),
    title: String(title),
    dateStr,
    timeStr,
    fullDate: startDate,
    hostId: String(hostId),
    maxMembers: Number(maxMembers) || 0,
    participants,
    isFeedbackDone: Boolean(isFeedbackDone),
  };
};

export async function createAzitSchedule(
  azitId: number,
  payload: CreateAzitScheduleRequest
): Promise<CreateAzitScheduleResponse> {
  const res = await api.post(`/azits/${azitId}/schedules`, {
    title: payload.title,
    max_participants: payload.maxParticipants,
    game_start_at: payload.gameStartAt,
    game_end_at: payload.gameEndAt,
    recruitment_end_at: payload.recruitmentEndAt,
  });

  const data = res.data?.data ?? res.data;
  const scheduleId = data?.schedule_id ?? data?.scheduleId ?? data?.id;

  return { scheduleId, data };
}

export async function getAzitSchedules(azitId: number): Promise<Schedule[]> {
  const res = await api.get(`/azits/${azitId}/schedules`);
  const data = res.data?.data ?? res.data;
  const rawList = Array.isArray(data?.schedules)
    ? data.schedules
    : Array.isArray(data)
      ? data
      : [];

  if (!Array.isArray(rawList)) return [];
  return rawList.map((item) => normalizeSchedule(item));
}
