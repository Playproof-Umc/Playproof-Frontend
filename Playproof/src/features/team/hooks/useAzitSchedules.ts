// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import type { ScheduleCreatePayload } from "@/features/team/hooks/useScheduleCreateState";
import { createAzitSchedule, getAzitSchedules } from "@/features/team/api/azitScheduleApi";

const coerceUserId = (value: string | number) => String(value);

const toLocalDateTimeString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
};

const applyTimeToDate = (baseDate: Date, time: ScheduleCreatePayload["gameStartTime"]) => {
  const date = new Date(baseDate);
  const hour = time.hour % 12 + (time.ampm === "PM" ? 12 : 0);
  date.setHours(hour, time.minute, 0, 0);
  return date;
};

export function useAzitSchedules(
  currentUserId: string,
  currentUser: User
) {
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(1);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    let isActive = true;

    const fetchSchedules = async () => {
      try {
        const list = await getAzitSchedules(currentAzitId);
        if (!isActive) return;
        setSchedules(list);
      } catch {
        if (!isActive) return;
        setSchedules([]);
      }
    };

    fetchSchedules();

    return () => {
      isActive = false;
    };
  }, [currentAzitId]);

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
            nextParticipants.push({ user: currentUser, status: newStatus });
          }

          return { ...sch, participants: nextParticipants };
        })
      );
    },
    [currentUser, currentUserId]
  );

  const addSchedule = React.useCallback(
    async (data: ScheduleCreatePayload) => {
      if (!data.gameDate) return;
      if (!data.recruitRange?.from) return;

      const gameStartDate = applyTimeToDate(data.gameDate, data.gameStartTime);
      const gameEndDate = applyTimeToDate(data.gameDate, data.gameEndTime);
      const recruitEndBase = data.recruitRange.to ?? data.recruitRange.from;
      const recruitEndDate = applyTimeToDate(recruitEndBase, data.recruitEndTime);

      const timeStr = gameStartDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateStr = `${String(gameStartDate.getMonth() + 1).padStart(2, "0")}.${String(
        gameStartDate.getDate()
      ).padStart(2, "0")}`;

      let scheduleId = String(Date.now());

      try {
        const res = await createAzitSchedule(currentAzitId, {
          title: data.title.trim(),
          maxParticipants: data.recruitCount,
          gameStartAt: toLocalDateTimeString(gameStartDate),
          gameEndAt: toLocalDateTimeString(gameEndDate),
          recruitmentEndAt: toLocalDateTimeString(recruitEndDate),
        });
        if (res.scheduleId !== undefined && res.scheduleId !== null) {
          scheduleId = String(res.scheduleId);
        }
      } catch {
        // 실패 시 로컬 상태만 반영
      }

      const newSchedule: Schedule = {
        id: scheduleId,
        title: data.title.trim(),
        dateStr,
        timeStr,
        fullDate: gameStartDate,
        hostId: String(currentUserId),
        maxMembers: data.recruitCount,
        participants: [{ user: currentUser, status: "JOIN" }],
        isFeedbackDone: false,
      };

      setSchedules((prev) => [newSchedule, ...prev]);
    },
    [currentAzitId, currentUser, currentUserId]
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
