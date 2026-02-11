// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import axios from "axios";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import type { ScheduleCreatePayload } from "@/features/team/hooks/useScheduleCreateState";
import {
  createAzitSchedule,
  getAzitSchedules,
  updateAzitScheduleParticipantStatus,
  type AzitScheduleDetailResDto,
} from "@/features/team/api/azitScheduleApi";

const coerceUserId = (value: string | number) => String(value);

const applyTimeToDate = (baseDate: Date, time: ScheduleCreatePayload["gameStartTime"]) => {
  const date = new Date(baseDate);
  const hour = time.hour % 12 + (time.ampm === "PM" ? 12 : 0);
  date.setHours(hour, time.minute, 0, 0);
  return date;
};

export function useAzitSchedules(
  currentUserId: string,
  currentUser: User,
  accessToken?: string | null
) {
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(1);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!accessToken) {
        setSchedules([]);
        return;
      }
      try {
        const res = await getAzitSchedules({ azitId: currentAzitId, size: 20 });
        if (!alive) return;
        const mapped = res.schedules.map((dto) =>
          mapScheduleDtoToUi(dto, currentUserId, currentUser)
        );
        setSchedules(mapped);
      } catch (err) {
        if (!alive) return;
        console.error("스케줄 목록 로드 실패:", err);
        setSchedules([]);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId, currentUser, currentUserId]);

  const handleStatusChange = React.useCallback(
    async (scheduleId: string, newStatus: "JOIN" | "DECLINE") => {
      const current = schedules.find((sch) => sch.id === scheduleId);
      const myCurrentStatus =
        current?.participants.find(
          (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
        )?.status ?? "PENDING";

      if (newStatus === "JOIN") {
        const target = schedules.find((sch) => sch.id === scheduleId);
        if (target?.recruitmentEndAt) {
          const now = Date.now();
          if (now >= target.recruitmentEndAt.getTime()) {
            return;
          }
        }
      }

      setSchedules((prevSchedules) =>
        prevSchedules.map((sch) => {
          if (sch.id !== scheduleId) return sch;

          const myIndex = sch.participants.findIndex(
            (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
          );

          const nextParticipants = [...sch.participants];

          if (myIndex !== -1) {
            nextParticipants[myIndex] = {
              ...nextParticipants[myIndex],
              status: newStatus,
            };
          } else {
            nextParticipants.push({ user: currentUser, status: newStatus });
          }

          return { ...sch, participants: nextParticipants };
        })
      );

      const shouldCallApi = newStatus !== myCurrentStatus;
      if (!shouldCallApi) return;

      try {
        await updateAzitScheduleParticipantStatus(currentAzitId, scheduleId, newStatus);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const code = error.response?.data?.error?.code;
          if (
            (newStatus === "JOIN" && code === "PARTICIPATION_ALREADY_PARTICIPATED") ||
            (newStatus === "DECLINE" && code === "PARTICIPATION_NOT_FOUND")
          ) {
            return;
          }
        }

        try {
          const res = await getAzitSchedules({ azitId: currentAzitId, size: 20 });
          setSchedules(res.schedules.map((dto) => mapScheduleDtoToUi(dto, currentUserId, currentUser)));
        } catch {
          // ignore
        }
      }
    },
    [currentAzitId, currentUser, currentUserId, schedules]
  );

  const addSchedule = React.useCallback(
    async (data: ScheduleCreatePayload) => {
      if (!data.gameDate) return;
      if (!data.recruitRange?.from) return;

      const gameStartDate = applyTimeToDate(data.gameDate, data.gameStartTime);
      const gameEndDate = applyTimeToDate(data.gameDate, data.gameEndTime);
      const recruitEndBase = data.recruitRange.to ?? data.recruitRange.from;
      const recruitEndDate = applyTimeToDate(recruitEndBase, data.recruitEndTime);

      if (gameEndDate.getTime() <= gameStartDate.getTime()) {
        gameEndDate.setDate(gameEndDate.getDate() + 1);
      }
      if (recruitEndDate.getTime() >= gameStartDate.getTime()) {
        recruitEndDate.setTime(gameStartDate.getTime() - 60_000);
      }

      const timeStr = gameStartDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateStr = `${String(gameStartDate.getMonth() + 1).padStart(2, "0")}.${String(
        gameStartDate.getDate()
      ).padStart(2, "0")}`;

      if (!accessToken) {
        const newSchedule: Schedule = {
          id: String(Date.now()),
          title: data.title.trim(),
          dateStr,
          timeStr,
          fullDate: gameStartDate,
          recruitmentEndAt: recruitEndDate,
          hostId: String(currentUserId),
          maxMembers: Math.max(2, data.recruitCount),
          participants: [{ user: currentUser, status: "JOIN" }],
          isFeedbackDone: false,
        };
        setSchedules((prev) => [newSchedule, ...prev]);
        return;
      }

      try {
        const created = await createAzitSchedule({
          azitId: currentAzitId,
          payload: {
            title: data.title.trim(),
            max_participants: Math.max(2, data.recruitCount),
            game_start_at: gameStartDate.toISOString(),
            game_end_at: gameEndDate.toISOString(),
            recruitment_end_at: recruitEndDate.toISOString(),
          },
        });
        const mapped = mapScheduleDtoToUi(created, currentUserId, currentUser);
        setSchedules((prev) => [mapped, ...prev]);
      } catch (err) {
        console.error("스케줄 생성 실패:", err);
      }
    },
    [accessToken, currentAzitId, currentUser, currentUserId]
  );

  const markFeedbackDone = React.useCallback((scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((sch) => (sch.id === scheduleId ? { ...sch, isFeedbackDone: true } : sch))
    );
  }, []);

  return {
    currentAzitId,
    setCurrentAzitId,
    schedules,
    handleStatusChange,
    addSchedule,
    markFeedbackDone,
  };
}

function mapScheduleDtoToUi(
  dto: AzitScheduleDetailResDto,
  currentUserId: string,
  currentUser: User
): Schedule {
  const gameStart = new Date(dto.game_start_at);
  const gameEnd = new Date(dto.game_end_at);
  const dateStr = `${String(gameStart.getMonth() + 1).padStart(2, "0")}.${String(
    gameStart.getDate()
  ).padStart(2, "0")}`;
  const timeStr = gameStart.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const participants = (dto.participants ?? []).map((p) => ({
    user: {
      id: String(p.member_id),
      nickname: p.nickname ?? "Unknown",
      avatarUrl: p.avatar_url ?? "",
      isOnline: true,
    },
    status: "JOIN" as const,
  }));

  const currentInList = participants.some((p) => String(p.user?.id) === String(currentUserId));
  if (dto.is_participated && !currentInList) {
    participants.push({ user: currentUser, status: "JOIN" });
  }

  const hostId = dto.participants?.[0]?.member_id
    ? String(dto.participants[0].member_id)
    : String(currentUserId);

  return {
    id: String(dto.schedule_id),
    title: dto.title,
    dateStr,
    timeStr,
    fullDate: gameEnd,
    recruitmentEndAt: new Date(dto.recruitment_end_at),
    hostId,
    maxMembers: dto.max_participants,
    participants,
    isFeedbackDone: false,
  };
}
