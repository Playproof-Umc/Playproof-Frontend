// src/features/team/utils/scheduleAction.ts

import type { Schedule } from "@/features/team/types";

export type ScheduleActionStatus =
  | "FEEDBACK_DONE"
  | "RECRUITMENT_FAILED"
  | "TIME_OVER"
  | "CREATOR"
  | "JOINED"
  | "DECLINED"
  | "PENDING";

type ScheduleActionState = {
  status: ScheduleActionStatus;
  joinedParticipants: Schedule["participants"];
  joinedCount: number;
  myStatus: "JOIN" | "DECLINE" | "PENDING";
  isTimeOver: boolean;
  isRecruitmentFailed: boolean;
  isCreator: boolean;
};

export const getScheduleActionState = (
  schedule: Schedule,
  currentUserId: string
): ScheduleActionState => {
  const now = new Date();
  const isTimeOver = now.getTime() >= schedule.fullDate.getTime();
  const joinedParticipants = schedule.participants.filter((p) => p.status === "JOIN");
  const joinedCount = joinedParticipants.length;
  const myInfo = schedule.participants.find(
    (p) => String(p.user?.id) === String(currentUserId)
  );
  const myStatus = myInfo?.status ?? "PENDING";
  const isCreator = String(schedule.hostId) === String(currentUserId);
  const isRecruitmentFailed = isTimeOver && joinedCount < schedule.maxMembers;

  if (schedule.isFeedbackDone) {
    return {
      status: "FEEDBACK_DONE",
      joinedParticipants,
      joinedCount,
      myStatus,
      isTimeOver,
      isRecruitmentFailed,
      isCreator,
    };
  }

  if (isTimeOver) {
    return {
      status: isRecruitmentFailed ? "RECRUITMENT_FAILED" : "TIME_OVER",
      joinedParticipants,
      joinedCount,
      myStatus,
      isTimeOver,
      isRecruitmentFailed,
      isCreator,
    };
  }

  if (isCreator) {
    return {
      status: "CREATOR",
      joinedParticipants,
      joinedCount,
      myStatus,
      isTimeOver,
      isRecruitmentFailed,
      isCreator,
    };
  }

  if (myStatus === "JOIN") {
    return {
      status: "JOINED",
      joinedParticipants,
      joinedCount,
      myStatus,
      isTimeOver,
      isRecruitmentFailed,
      isCreator,
    };
  }

  if (myStatus === "DECLINE") {
    return {
      status: "DECLINED",
      joinedParticipants,
      joinedCount,
      myStatus,
      isTimeOver,
      isRecruitmentFailed,
      isCreator,
    };
  }

  return {
    status: "PENDING",
    joinedParticipants,
    joinedCount,
    myStatus,
    isTimeOver,
    isRecruitmentFailed,
    isCreator,
  };
};
