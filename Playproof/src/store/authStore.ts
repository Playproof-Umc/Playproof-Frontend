// src/store/authStore.ts

import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  userId: number | null;
  nickname: string | null;
  setAuth: (p: { accessToken: string; userId: number; nickname: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // 개발 환경에서 .env에 설정된 테스트 토큰 사용
  accessToken: import.meta.env.VITE_DEV_ACCESS_TOKEN ?? null,
  userId: null,
  nickname: null,
  setAuth: ({ accessToken, userId, nickname }) =>
    set({ accessToken, userId, nickname }),
  clearAuth: () => set({ accessToken: null, userId: null, nickname: null }),
}));