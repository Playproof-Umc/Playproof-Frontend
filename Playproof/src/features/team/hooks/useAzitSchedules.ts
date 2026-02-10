// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";

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
  currentUser: User
) {
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(1);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    const initialSchedules = schedulesByAzit[currentAzitId] ?? [];
    setSchedules(initialSchedules);
  }, [currentAzitId, schedulesByAzit]);

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
            }
          }

          return { ...sch, participants: nextParticipants };
        })
      );
    },
    [currentUserId, currentAzitId, membersByAzit]
  );

  const addSchedule = React.useCallback(
    (data: CreateSchedulePayload) => {
      if (!data.gameDate) return;
      const date = new Date(data.gameDate);
      const hour = data.gameStartTime.hour % 12 + (data.gameStartTime.ampm === "PM" ? 12 : 0);
      date.setHours(hour, data.gameStartTime.minute, 0, 0);

      const timeStr = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateStr = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate()
      ).padStart(2, "0")}`;

      const newSchedule: Schedule = {
        id: String(Date.now()),
        title: data.title.trim(),
        dateStr,
        timeStr,
        fullDate: date,
        hostId: String(currentUserId),
        maxMembers: data.recruitCount,
        participants: [{ user: currentUser, status: "JOIN" }],
        isFeedbackDone: false,
      };

      setSchedules((prev) => [newSchedule, ...prev]);
    },
    [currentUser, currentUserId]
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
