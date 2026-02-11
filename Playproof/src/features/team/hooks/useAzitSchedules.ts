// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import type { ScheduleCreatePayload } from "@/features/team/hooks/useScheduleCreateState";
import {
  createAzitSchedule,
  getAzitSchedules,
  getAzitScheduleMyParticipationStatus,
  joinAzitScheduleParticipant,
  updateAzitScheduleParticipantStatus,
  type AzitScheduleDetailResDto,
} from "@/features/team/api/azitScheduleApi";

const coerceUserId = (value: string | number) => String(value);

const toLocalDateTimeString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
};

const applyTimeToDate = (
  baseDate: Date,
  time: ScheduleCreatePayload["gameStartTime"]
) => {
  const date = new Date(baseDate);
  const hour = time.hour % 12 + (time.ampm === "PM" ? 12 : 0);
  date.setHours(hour, time.minute, 0, 0);
  return date;
};

const mapScheduleDtoToUi = (
  dto: AzitScheduleDetailResDto,
  currentUserId: string,
  currentUser: User
): Schedule => {
  const gameStart = new Date(dto.game_start_at);
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

  const hasMe = participants.some(
    (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
  );
  if (dto.is_participated && !hasMe) {
    participants.push({ user: currentUser, status: "JOIN" });
  }

  const hostId =
    (dto as unknown as { host_id?: number; hostId?: number }).host_id ??
    (dto as unknown as { host_id?: number; hostId?: number }).hostId ??
    (dto.participants?.[0]?.member_id ?? "");

  return {
    id: String(dto.schedule_id),
    title: dto.title,
    dateStr,
    timeStr,
    fullDate: gameStart,
    hostId: String(hostId ?? ""),
    maxMembers: dto.max_participants,
    participants,
    isFeedbackDone: false,
  };
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
        const baseList = res.schedules.map((dto) =>
          mapScheduleDtoToUi(dto, currentUserId, currentUser)
        );

        const enriched = await Promise.all(
          baseList.map(async (schedule) => {
            const hasMe = schedule.participants.some(
              (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
            );
            if (hasMe || !currentUserId) return schedule;

            try {
              const status = await getAzitScheduleMyParticipationStatus({
                azitId: currentAzitId,
                scheduleId: schedule.id,
              });
              if (!status) return schedule;

              const normalizedStatus = status === "CANCELLED" ? "DECLINE" : status;
              if (normalizedStatus === "JOIN") return schedule;

              return {
                ...schedule,
                participants: [
                  ...schedule.participants,
                  { user: currentUser, status: normalizedStatus },
                ],
              };
            } catch {
              return schedule;
            }
          })
        );

        setSchedules(enriched);
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
      const prevSchedules = schedules;
      setSchedules((prev) =>
        prev.map((sch) => {
          if (sch.id !== scheduleId) return sch;
          const participants = [...sch.participants];
          const myIndex = participants.findIndex(
            (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
          );
          if (myIndex !== -1) {
            participants[myIndex] = { ...participants[myIndex], status: newStatus };
          } else {
            participants.push({ user: currentUser, status: newStatus });
          }
          return { ...sch, participants };
        })
      );

      if (!accessToken) return;
      try {
        if (newStatus === "JOIN") {
          await joinAzitScheduleParticipant({ azitId: currentAzitId, scheduleId });
        } else {
          await updateAzitScheduleParticipantStatus({
            azitId: currentAzitId,
            scheduleId,
            status: newStatus,
          });
        }
      } catch (err) {
        console.error("스케줄 참여 상태 변경 실패:", err);
        setSchedules(prevSchedules);
      }
    },
    [accessToken, currentAzitId, currentUser, currentUserId, schedules]
  );

  const addSchedule = React.useCallback(
    async (data: ScheduleCreatePayload) => {
      if (!data.gameDate || !data.recruitRange?.from) return;

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

      if (!accessToken) return;
      try {
        await createAzitSchedule({
          azitId: currentAzitId,
          payload: {
            title: data.title.trim(),
            max_participants: Math.max(2, data.recruitCount),
            game_start_at: toLocalDateTimeString(gameStartDate),
            game_end_at: toLocalDateTimeString(gameEndDate),
            recruitment_end_at: toLocalDateTimeString(recruitEndDate),
          },
        });
        const res = await getAzitSchedules({ azitId: currentAzitId, size: 20 });
        const list = res.schedules.map((dto) =>
          mapScheduleDtoToUi(dto, currentUserId, currentUser)
        );
        setSchedules(list);
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
