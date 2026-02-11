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
      // 초기값은 모두 null (로그인 전 상태)
      accessToken: null,
      userId: null,
      nickname: null,
      setAuth: ({ accessToken, userId, nickname }) =>
        set({ accessToken, userId, nickname }),
      clearAuth: () => set({ accessToken: null, userId: null, nickname: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
