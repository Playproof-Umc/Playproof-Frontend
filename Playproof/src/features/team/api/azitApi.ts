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
