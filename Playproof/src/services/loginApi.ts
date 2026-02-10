// src/services/loginApi.ts

import { api } from "@/services/api";

export type LoginRequest = {
  phoneNumber: string;
  password: string;
  keepLoggedIn: boolean;
};

export type LoginResponse = {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string; // 현재 명세상 응답에 있으나, 프론트 저장은 하지 않는 기본 정책(B)
    userId: number;
    nickname: string;
  };
  error: null | unknown;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", body);
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }
  return res.data;
}