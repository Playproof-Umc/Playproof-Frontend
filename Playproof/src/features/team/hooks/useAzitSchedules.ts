// src/features/team/hooks/useAzitSchedules.ts

import React from "react";
import axios from "axios";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import type { ScheduleCreatePayload } from "@/features/team/hooks/useScheduleCreateState";
import {
  createAzitSchedule,
  getAzitSchedules,
  getAzitScheduleMyParticipantStatus,
  updateAzitScheduleParticipantStatus,
} from "@/features/team/api/azitScheduleApi";

const coerceUserId = (value: string | number) => String(value);

/** --- [Helper] 날짜 및 시간 계산 로직 --- */
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
  const hour = (time.hour % 12) + (time.ampm === "PM" ? 12 : 0);
  date.setHours(hour, time.minute, 0, 0);
  return date;
};

export function useAzitSchedules(
  currentUserId: string,
  currentUser: User
) {
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(1);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  /** --- 1. 스케줄 목록 로드 및 데이터 보강 --- */
  React.useEffect(() => {
    let isActive = true;

    const fetchSchedules = async () => {
      try {
        // [Integration] 서버에서 가공된 Schedule[] 배열을 직접 받아옴 (api 내부의 normalize 활용)
        const list = await getAzitSchedules(currentAzitId);
        if (!isActive) return;

        // [Develop Logic] 각 스케줄에 '나'의 참여 상태가 포함되어 있는지 확인하고 보강
        const enriched = await Promise.all(
          list.map(async (schedule) => {
            const hasMe = schedule.participants.some(
              (p) => coerceUserId(p.user?.id ?? "") === coerceUserId(currentUserId)
            );
            if (hasMe || !currentUserId) return schedule;

            try {
              const status = await getAzitScheduleMyParticipantStatus(currentAzitId, Number(schedule.id));
              if (!status) return schedule;
              return {
                ...schedule,
                participants: [...schedule.participants, { user: currentUser, status }],
              };
            } catch {
              return schedule;
            }
          })
        );

        if (isActive) setSchedules(enriched);
      } catch (err) {
        console.error("스케줄 로드 실패:", err);
        if (isActive) setSchedules([]);
      }
    };

    fetchSchedules();
    return () => { isActive = false; };
  }, [currentAzitId, currentUser, currentUserId]);

  /** --- 2. 참여 상태 변경 (Optimistic Update 적용) --- */
  const handleStatusChange = React.useCallback(
    async (scheduleId: string, newStatus: "JOIN" | "DECLINE") => {
      const target = schedules.find((sch) => sch.id === scheduleId);
      if (!target) return;

      // 모집 마감 체크
      if (newStatus === "JOIN" && target.recruitmentEndAt) {
        if (Date.now() >= target.recruitmentEndAt.getTime()) {
          alert("모집이 마감된 스케줄입니다.");
          return;
        }
      }

      // UI 즉시 반영 (Optimistic Update)
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

      try {
        await updateAzitScheduleParticipantStatus(currentAzitId, Number(scheduleId), newStatus);
      } catch (error) {
        // 에러 발생 시 원래 상태 복구를 위해 목록 재조회
        const list = await getAzitSchedules(currentAzitId);
        setSchedules(list);
      }
    },
    [currentAzitId, currentUser, currentUserId, schedules]
  );

  /** --- 3. 스케줄 생성 --- */
  const addSchedule = React.useCallback(
    async (data: ScheduleCreatePayload) => {
      if (!data.gameDate || !data.recruitRange?.from) return;

      const gameStartDate = applyTimeToDate(data.gameDate, data.gameStartTime);
      const gameEndDate = applyTimeToDate(data.gameDate, data.gameEndTime);
      const recruitEndBase = data.recruitRange.to ?? data.recruitRange.from;
      const recruitEndDate = applyTimeToDate(recruitEndBase, data.recruitEndTime);

      try {
        // API 요청 (CamelCase Payload 사용)
        const res = await createAzitSchedule(currentAzitId, {
          title: data.title.trim(),
          maxParticipants: data.recruitCount,
          gameStartAt: toLocalDateTimeString(gameStartDate),
          gameEndAt: toLocalDateTimeString(gameEndDate),
          recruitmentEndAt: toLocalDateTimeString(recruitEndDate),
        });

        // 생성 성공 시 목록에 추가 (서버에서 받은 ID 사용)
        const newSchedule: Schedule = {
          id: String(res.scheduleId ?? Date.now()),
          title: data.title.trim(),
          dateStr: `${String(gameStartDate.getMonth() + 1).padStart(2, "0")}.${String(gameStartDate.getDate()).padStart(2, "0")}`,
          timeStr: gameStartDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
          fullDate: gameStartDate,
          recruitmentEndAt: recruitEndDate,
          hostId: String(currentUserId),
          maxMembers: data.recruitCount,
          participants: [{ user: currentUser, status: "JOIN" }],
          isFeedbackDone: false,
        };

        setSchedules((prev) => [newSchedule, ...prev]);
      } catch (err) {
        console.error("스케줄 생성 실패:", err);
      }
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
    handleStatusChange,
    addSchedule,
    markFeedbackDone,
  };
}