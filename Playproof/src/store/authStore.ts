// src/store/authStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // ✅ 추가

type AuthState = {
  accessToken: string | null;
  userId: number | null;
  nickname: string | null;
  setAuth: (p: { accessToken: string; userId: number; nickname: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      userId: null,
      nickname: null,
      setAuth: ({ accessToken, userId, nickname }) =>
        set({ accessToken, userId, nickname }),
      clearAuth: () => set({ accessToken: null, userId: null, nickname: null }),
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // ✅ 로컬 스토리지 사용 명시
    }
  )
);