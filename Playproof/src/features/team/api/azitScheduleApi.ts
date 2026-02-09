// src/features/team/api/azitScheduleApi.ts

import { api } from "@/services/api";

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
