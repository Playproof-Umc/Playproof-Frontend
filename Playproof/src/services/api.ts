// src/services/api.ts

import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// baseURL은 프로젝트 환경에 맞게 바꿔줘
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // refreshToken을 httpOnly 쿠키로 받게 될 때 필요
});

// accessToken 자동 주입(메모리)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});