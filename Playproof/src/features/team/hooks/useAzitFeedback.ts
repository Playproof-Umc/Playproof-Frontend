// src/features/team/hooks/useAzitFeedback.ts

import React from "react";
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import { getScheduleActionState } from "@/features/team/utils/scheduleAction";
import {
  addPendingFeedback,
  getPendingFeedbacks,
  removePendingFeedback,
} from "@/features/team/utils/pendingFeedback";

type FeedbackModalState = {
  open: boolean;
  scheduleId?: string;
  targetName?: string;
  targetMeta?: string;
  avatarUrl?: string;
  required?: boolean;
};

type UseAzitFeedbackParams = {
  schedules: Schedule[];
  currentUserId: string;
  currentUser: User;
  currentAzitId: number;
  markFeedbackDone: (scheduleId: string) => void;
};

export const useAzitFeedback = ({
  schedules,
  currentUserId,
  currentUser,
  currentAzitId,
  markFeedbackDone,
}: UseAzitFeedbackParams) => {
  const [feedbackModal, setFeedbackModal] = React.useState<FeedbackModalState>({
    open: false,
  });

  const getFeedbackTargetName = React.useCallback(
    (scheduleId: string) => {
      const targetSchedule = schedules.find((sch) => sch.id === scheduleId);
      if (!targetSchedule) return "상대방";
      const target =
        targetSchedule.participants.find(
          (p) => String(p.user?.id) !== String(currentUser.id)
        )?.user ?? targetSchedule.participants[0]?.user;
      return target?.nickname ?? "상대방";
    },
    [currentUser.id, schedules]
  );

  const getFeedbackTargetMeta = React.useCallback(
    (scheduleId: string) => {
      const targetSchedule = schedules.find((sch) => sch.id === scheduleId);
      if (!targetSchedule) return "Tier TS 90";
      const target =
        targetSchedule.participants.find(
          (p) => String(p.user?.id) !== String(currentUser.id)
        )?.user ?? targetSchedule.participants[0]?.user;
      if (!target) return "Tier TS 90";
      return "Tier TS 90";
    },
    [currentUser.id, schedules]
  );

  const openFeedbackModal = React.useCallback(
    (scheduleId: string, required = false) => {
      const targetName = getFeedbackTargetName(scheduleId);
      const targetMeta = getFeedbackTargetMeta(scheduleId);
      const targetSchedule = schedules.find((sch) => sch.id === scheduleId);
      const target =
        targetSchedule?.participants.find(
          (p) => String(p.user?.id) !== String(currentUser.id)
        )?.user ?? targetSchedule?.participants[0]?.user;
      setFeedbackModal({
        open: true,
        scheduleId,
        targetName,
        targetMeta,
        avatarUrl: target?.avatarUrl,
        required,
      });
    },
    [currentUser.id, getFeedbackTargetMeta, getFeedbackTargetName, schedules]
  );

  const closeFeedbackModal = React.useCallback(() => {
    setFeedbackModal({ open: false });
  }, []);

  React.useEffect(() => {
    schedules.forEach((schedule) => {
      const action = getScheduleActionState(schedule, currentUserId);
      if (action.status !== "TIME_OVER" || schedule.isFeedbackDone) return;
      const targetName = getFeedbackTargetName(schedule.id);
      addPendingFeedback({
        scheduleId: schedule.id,
        azitId: currentAzitId,
        targetName,
        scheduleTitle: schedule.title,
      });
    });
  }, [currentAzitId, currentUserId, getFeedbackTargetName, schedules]);

  const submitFeedback = React.useCallback(
    (scheduleId: string) => {
      markFeedbackDone(scheduleId);
      removePendingFeedback(scheduleId, currentAzitId);
      setFeedbackModal({ open: false });
    },
    [currentAzitId, markFeedbackDone]
  );

  return {
    feedbackModal,
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
    getPendingFeedbacks,
  };
};
