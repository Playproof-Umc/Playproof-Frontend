// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import {
  createAzitSchedule,
  getAzitSchedules,
  type AzitScheduleDetailResDto,
} from "@/features/team/api/azitScheduleApi";

type TimeSelection = {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
};

type CreateSchedulePayload = {
  title: string;
  recruitCount: number;
  gameDate?: Date;
  gameStartTime: TimeSelection;
};

const coerceUserId = (value: string | number) => String(value);

export function useAzitSchedules(
  currentUserId: string,
  schedulesByAzit: Record<number, Schedule[]>,
  membersByAzit: Record<number, User[]>,
  currentUser: User,
  accessToken?: string | null
) {
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(1);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!accessToken) {
        const initialSchedules = schedulesByAzit[currentAzitId] ?? [];
        setSchedules(initialSchedules);
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
        console.error("스케줄 목록 로드 실패:", err);
        const initialSchedules = schedulesByAzit[currentAzitId] ?? [];
        setSchedules(initialSchedules);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId, currentUser, currentUserId, schedulesByAzit]);

  const handleStatusChange = React.useCallback(
    (scheduleId: string, newStatus: "JOIN" | "DECLINE") => {
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
            const members = membersByAzit[currentAzitId] ?? [];
            const me = members.find(
              (member) => coerceUserId(member.id) === coerceUserId(currentUserId)
            );
            if (me) {
              nextParticipants.push({ user: me, status: newStatus });
            } else if (currentUser) {
              nextParticipants.push({ user: currentUser, status: newStatus });
            }
          }

          return { ...sch, participants: nextParticipants };
        })
      );
    },
    [currentUserId, currentAzitId, membersByAzit]
  );

  const addSchedule = React.useCallback(
    async (data: CreateSchedulePayload) => {
      console.log("🗓️ [ScheduleCreate] addSchedule payload", data);
      if (!data.gameDate) return;
      const date = new Date(data.gameDate);
      const hour = data.gameStartTime.hour % 12 + (data.gameStartTime.ampm === "PM" ? 12 : 0);
      date.setHours(hour, data.gameStartTime.minute, 0, 0);

      const endDate = new Date(data.gameDate);
      const endHour = data.gameEndTime.hour % 12 + (data.gameEndTime.ampm === "PM" ? 12 : 0);
      endDate.setHours(endHour, data.gameEndTime.minute, 0, 0);

      const recruitEndBase = data.recruitRange?.to ?? data.recruitRange?.from ?? data.gameDate;
      const recruitEndDate = new Date(recruitEndBase);
      const recruitEndHour =
        data.recruitEndTime.hour % 12 + (data.recruitEndTime.ampm === "PM" ? 12 : 0);
      recruitEndDate.setHours(recruitEndHour, data.recruitEndTime.minute, 0, 0);
      // 서버 검증: 게임 시작 < 게임 종료, 모집 마감 < 게임 시작
      if (endDate.getTime() <= date.getTime()) {
        endDate.setDate(endDate.getDate() + 1);
      }
      if (recruitEndDate.getTime() >= date.getTime()) {
        recruitEndDate.setTime(date.getTime() - 60_000);
      }

      const timeStr = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateStr = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate()
      ).padStart(2, "0")}`;

      if (!accessToken) {
        const newSchedule: Schedule = {
          id: String(Date.now()),
          title: data.title.trim(),
          dateStr,
          timeStr,
          fullDate: endDate,
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
            game_start_at: date.toISOString(),
            game_end_at: endDate.toISOString(),
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
    setSchedules,
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
    hostId,
    maxMembers: dto.max_participants,
    participants,
    isFeedbackDone: false,
  };
}
