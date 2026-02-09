// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// baseURL은 프로젝트 환경에 맞게 바꿔줘
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: {
    "Content-Type": "application/json",
    ...(import.meta.env.VITE_ACCESS_TOKEN
      ? { Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}` }
      : {}),
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

// 하이라이트 글쓰기 API 요청
// import { Highlight } from "@/features/community/types/types"; // 필요시만 import

export interface CreateHighlightMedia {
  media_url: string;
  order: number;
}

export interface CreateHighlightRequest {
  content: string;
  is_public: boolean;
  medias?: CreateHighlightMedia[] | File[];
}

export interface CreateHighlightResponse {
  statusCode: number;
  data: {
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
  };
  error: unknown;
}

export async function createHighlight(
  payload: CreateHighlightRequest
): Promise<CreateHighlightResponse> {
  const medias = payload.medias ?? [];
  if (medias.length > 0 && medias[0] instanceof File) {
    const formData = new FormData();
    formData.append("content", payload.content);
    formData.append("is_public", String(payload.is_public));
    (medias as File[]).forEach((file, index) => {
      formData.append("medias", file);
      formData.append("orders", String(index + 1));
    });
    const res = await api.post("/community/highlights", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await api.post("/community/highlights", payload);
  return res.data;
}
