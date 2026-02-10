// src/features/team/utils/pendingFeedback.ts

export type PendingFeedback = {
  scheduleId: string;
  azitId?: number;
  targetName: string;
  scheduleTitle?: string;
};

const STORAGE_KEY = "playproof.pendingFeedbacks";

const safeParse = (value: string | null): PendingFeedback[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as PendingFeedback[]) : [];
  } catch {
    return [];
  }
};

export const getPendingFeedbacks = (): PendingFeedback[] => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
};

export const setPendingFeedbacks = (items: PendingFeedback[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addPendingFeedback = (item: PendingFeedback) => {
  const existing = getPendingFeedbacks();
  if (
    existing.some(
      (it) => it.scheduleId === item.scheduleId && it.azitId === item.azitId
    )
  )
    return;
  setPendingFeedbacks([...existing, item]);
};

export const removePendingFeedback = (scheduleId: string, azitId?: number) => {
  const existing = getPendingFeedbacks();
  setPendingFeedbacks(
    existing.filter(
      (it) => !(it.scheduleId === scheduleId && it.azitId === azitId)
    )
  );
};
