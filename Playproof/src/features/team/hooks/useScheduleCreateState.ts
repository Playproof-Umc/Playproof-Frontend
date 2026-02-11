// src/features/team/hooks/useScheduleCreateState.ts

import React from "react";
import type { DateRange } from "react-day-picker";

export interface TimeSelection {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
}

export type ScheduleCreatePayload = {
  title: string;
  recruitCount: number;
  gameDate?: Date;
  gameStartTime: TimeSelection;
  gameEndTime: TimeSelection;
  recruitRange?: DateRange;
  recruitStartTime: TimeSelection;
  recruitEndTime: TimeSelection;
};

type UseScheduleCreateStateArgs = {
  anchorEl: HTMLElement | null;
  onCreate: (data: ScheduleCreatePayload) => void;
  onClose: () => void;
};

export function useScheduleCreateState({
  anchorEl,
  onCreate,
  onClose,
}: UseScheduleCreateStateArgs) {
  const position = React.useMemo(() => {
    if (!anchorEl) return { top: 0, left: 0 };
    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    };
  }, [anchorEl]);
  const [title, setTitle] = React.useState("");
  const [recruitCount, setRecruitCount] = React.useState(0);
  const [gameDate, setGameDate] = React.useState<Date | undefined>(undefined);
  const [isGameDateOpen, setIsGameDateOpen] = React.useState(false);
  const [gameStartTime, setGameStartTime] = React.useState<TimeSelection>({
    ampm: "AM",
    hour: 12,
    minute: 0,
  });
  const [gameEndTime, setGameEndTime] = React.useState<TimeSelection>({
    ampm: "AM",
    hour: 12,
    minute: 0,
  });
  const [recruitRange, setRecruitRange] = React.useState<DateRange | undefined>(undefined);
  const [isRecruitDateOpen, setIsRecruitDateOpen] = React.useState(false);
  const [recruitStartTime, setRecruitStartTime] = React.useState<TimeSelection>({
    ampm: "AM",
    hour: 12,
    minute: 0,
  });
  const [recruitEndTime, setRecruitEndTime] = React.useState<TimeSelection>({
    ampm: "AM",
    hour: 12,
    minute: 0,
  });
  const [activeTimePicker, setActiveTimePicker] = React.useState<string | null>(null);

  const handleRecruitCount = (delta: number) => {
    setRecruitCount((prev) => Math.max(0, prev + delta));
  };

  const formatDate = (date: Date | undefined) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`
      : "날짜를 선택해주세요.";

  const formatRange = (range: DateRange | undefined) =>
    range?.from
      ? `${formatDate(range.from)} ~ ${range.to ? formatDate(range.to) : formatDate(range.from)}`
      : "날짜를 선택해주세요.";

  const validateForm = () => {
    if (!title.trim()) return { isValid: false, msg: "제목을 입력해주세요." };
    if (!gameDate) return { isValid: false, msg: "게임 일정을 선택해주세요." };
    if (!recruitRange?.from) return { isValid: false, msg: "모집 기간을 선택해주세요." };

    const gameStart = new Date(gameDate);
    const gameStartHour = gameStartTime.hour % 12 + (gameStartTime.ampm === "PM" ? 12 : 0);
    gameStart.setHours(gameStartHour, gameStartTime.minute, 0, 0);

    const gameEnd = new Date(gameDate);
    const gameEndHour = gameEndTime.hour % 12 + (gameEndTime.ampm === "PM" ? 12 : 0);
    gameEnd.setHours(gameEndHour, gameEndTime.minute, 0, 0);

    if (gameEnd <= gameStart) {
      return { isValid: false, msg: "게임 종료 시간은 시작 시간보다 이후여야 합니다." };
    }

    const game = new Date(gameDate);
    game.setHours(0, 0, 0, 0);

    const recruitStart = new Date(recruitRange.from);
    recruitStart.setHours(0, 0, 0, 0);

    if (recruitStart > game) {
      return { isValid: false, msg: "모집 기간이 게임 일정보다 늦습니다." };
    }

    const recruitEndBase = recruitRange.to ?? recruitRange.from;
    const recruitEnd = new Date(recruitEndBase);
    const recruitEndHour = recruitEndTime.hour % 12 + (recruitEndTime.ampm === "PM" ? 12 : 0);
    recruitEnd.setHours(recruitEndHour, recruitEndTime.minute, 0, 0);

    if (recruitEnd >= gameStart) {
      return { isValid: false, msg: "모집 마감 시간은 게임 시작 시간보다 이전이어야 합니다." };
    }

    return { isValid: true, msg: "" };
  };

  const { isValid, msg } = validateForm();

  const handleSubmit = () => {
    console.log("🗓️ [ScheduleCreate] submit clicked", {
      title,
      recruitCount,
      gameDate,
      gameStartTime,
      gameEndTime,
      recruitRange,
      recruitStartTime,
      recruitEndTime,
      isValid,
      msg,
    });
    if (!isValid) return;
    const payload: ScheduleCreatePayload = {
      title,
      recruitCount,
      gameDate,
      gameStartTime,
      gameEndTime,
      recruitRange,
      recruitStartTime,
      recruitEndTime,
    };
    onCreate(payload);
    onClose();
  };

  return {
    state: {
      position,
      title,
      recruitCount,
      gameDate,
      isGameDateOpen,
      gameStartTime,
      gameEndTime,
      recruitRange,
      isRecruitDateOpen,
      recruitStartTime,
      recruitEndTime,
      activeTimePicker,
      isValid,
      msg,
    },
    actions: {
      setTitle,
      setGameDate,
      setIsGameDateOpen,
      setGameStartTime,
      setGameEndTime,
      setRecruitRange,
      setIsRecruitDateOpen,
      setRecruitStartTime,
      setRecruitEndTime,
      setActiveTimePicker,
      handleRecruitCount,
      handleSubmit,
      formatDate,
      formatRange,
    },
  };
}
