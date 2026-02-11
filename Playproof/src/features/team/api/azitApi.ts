// src/features/team/api/azitApi.ts

import { api } from "@/services/api";
import type { Azit } from "@/features/team/types/types";
import type { User } from "@/types";

/** --- Types --- */

type AzitResDto = {
  azit_id: number;
  azit_name: string;
  azit_icon_url: string | null;
  member_count?: number; // 필요시 추가
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  error: null | unknown;
};

/** --- Helper: 데이터 정규화 --- */

const normalizeAzit = (item: any): Azit => {
  return {
    id: item.azit_id ?? item.id,
    name: item.azit_name ?? item.name ?? "",
    icon: item.azit_icon_url ?? item.icon ?? "",
    memberCount: item.member_count ?? 0,
  };
};

/** --- API Functions --- */

// 1. 아지트 목록 조회
export async function getAzits(): Promise<Azit[]> {
  const res = await api.get<ApiResponse<{ azits: AzitResDto[] }>>("/azits");
  
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("아지트 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const rawList = res.data.data?.azits ?? [];
  return rawList.map(normalizeAzit);
}

// 2. 아지트 멤버 조회 (develop 브랜치 내용 반영)
export async function getAzitMembers(azitId: number): Promise<User[]> {
  const res = await api.get<ApiResponse<{ members: any[] }>>(`/azits/${azitId}/members`);
  
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("멤버 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const rawMembers = res.data.data?.members ?? [];
  return rawMembers.map((item) => ({
    id: String(item.member_id ?? item.user_id ?? item.id),
    nickname: String(item.nickname ?? item.name ?? ""),
    avatarUrl: item.avatar_url ?? item.profile_image ?? undefined,
  }));
}

// 3. 아지트 생성
export async function createAzit(payload: { azit_name: string; azit_icon?: File | null }): Promise<AzitResDto> {
  const formData = new FormData();
  formData.append("azit_name", payload.azit_name);
  if (payload.azit_icon) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.post<ApiResponse<AzitResDto>>("/azits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data.error || ![200, 201].includes(res.data.statusCode)) {
    throw new Error("아지트 생성에 실패했습니다.");
  }
  return res.data.data;
}

// 4. 아지트 수정
export async function updateAzit(
  azitId: number,
  payload: { azit_name?: string | null; azit_icon?: File | string | null; is_delete_icon?: boolean }
): Promise<AzitResDto> {
  const hasFile = payload.azit_icon instanceof File;
  
  // JSON으로 보낼지 FormData로 보낼지 결정
  if (!hasFile && payload.azit_icon !== null) {
    const res = await api.patch<ApiResponse<AzitResDto>>(`/azits/${azitId}`, {
      azit_name: payload.azit_name,
      is_delete_icon: payload.is_delete_icon
    });
    if (res.data.error || res.data.statusCode !== 200) throw new Error("수정에 실패했습니다.");
    return res.data.data;
  }

  const formData = new FormData();
  if (payload.azit_name) formData.append("azit_name", payload.azit_name);
  if (payload.is_delete_icon !== undefined) formData.append("is_delete_icon", String(payload.is_delete_icon));
  if (hasFile) formData.append("azit_icon", payload.azit_icon as File);

  const res = await api.patch<ApiResponse<AzitResDto>>(`/azits/${azitId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("아지트 설정 변경에 실패했습니다.");
  }
  return res.data.data;
}