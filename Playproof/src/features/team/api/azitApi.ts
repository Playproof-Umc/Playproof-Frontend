// src/features/team/api/azitApi.ts

import { api } from "@/services/api";
import type { Azit } from "@/features/team/types/types";

type AzitResDto = {
  azit_id: number;
  azit_name: string;
  azit_icon_url: string | null;
  member_count?: number;
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  error: null | { code: string; message: string; errors?: unknown[] };
};

const normalizeAzit = (item: AzitResDto): Azit => ({
  id: item.azit_id,
  name: item.azit_name,
  icon: item.azit_icon_url ?? "",
  memberCount: item.member_count ?? 0,
});

export async function getAzits(): Promise<Azit[]> {
  const res = await api.get<ApiResponse<{ azits: AzitResDto[] }>>("/azits");
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "아지트 목록 조회 실패");
  }
  const list = res.data.data?.azits ?? [];
  return list.map(normalizeAzit);
}

export async function updateAzit(
  azitId: number,
  payload: { azit_name?: string | null; azit_icon?: File | null; is_delete_icon?: boolean }
): Promise<AzitResDto> {
  const formData = new FormData();
  if (payload.azit_name !== undefined) {
    formData.append("azit_name", payload.azit_name ?? "");
  }
  if (payload.is_delete_icon !== undefined) {
    formData.append("is_delete_icon", String(payload.is_delete_icon));
  }
  if (payload.azit_icon) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.patch<ApiResponse<AzitResDto>>(`/azits/${azitId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "아지트 설정 변경 실패");
  }
  return res.data.data;
}

export async function createAzit(payload: {
  azit_name: string;
  azit_icon?: File | null;
}): Promise<AzitResDto> {
  const formData = new FormData();
  formData.append("azit_name", payload.azit_name);
  if (payload.azit_icon) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.post<ApiResponse<AzitResDto>>("/azits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 201)) {
    throw new Error(res.data.error?.message ?? "아지트 생성 실패");
  }
  return res.data.data;
}
