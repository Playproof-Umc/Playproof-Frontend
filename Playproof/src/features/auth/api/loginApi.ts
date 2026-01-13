import { api } from "@/features/auth/api/api";

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
  return res.data;
}