// src/services/loginApi.ts

import { api } from "@/services/api";

export type LoginRequest = {
  phoneNumber: string;
  password: string;
  keepLoggedIn: boolean; // 프론트엔드 로직용으로는 남겨둠 (저장은 안함)
};

export type LoginResponse = {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    nickname: string;
  };
  error: null | unknown;
};

export async function login(body: LoginRequest): Promise<LoginResponse["data"]> {
  // ✅ [수정] payload에서 keepLoggedIn 제거 (서버가 거부함)
  const payload = {
    phone: body.phoneNumber, 
    password: body.password,
  };

  // payload 전송
  const res = await api.post<LoginResponse>("/auth/login", payload);
  
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }
  
  return res.data.data;
}