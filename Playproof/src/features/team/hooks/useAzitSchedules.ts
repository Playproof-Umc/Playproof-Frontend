import React from "react";
import type { Schedule, User } from "@/features/team/types/types";

const coerceUserId = (value: string | number) => String(value);

export function useAzitSchedules(
  currentUserId: string,
  schedulesByAzit: Record<number, Schedule[]>,
  membersByAzit: Record<number, User[]>
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

  return {
    currentAzitId,
    setCurrentAzitId,
    schedules,
    setSchedules,
    handleStatusChange,
  };
}
