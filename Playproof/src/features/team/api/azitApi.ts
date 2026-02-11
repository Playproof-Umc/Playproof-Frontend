// src/features/team/api/azitApi.ts
import { api } from "@/services/api";
import type { Azit } from "@/features/team/types";

type RawAzit = Record<string, any>;

type AzitResDto = {
  azit_id: number;
  azit_name: string;
  azit_icon_url?: string | null;
  member_count?: number;
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  error: null | unknown;
};

const normalizeAzit = (item: RawAzit): Azit => {
  const id = item.azit_id ?? item.id ?? 0;
  const name = item.azit_name ?? item.name ?? "";
  const icon = item.azit_icon_url ?? item.icon ?? undefined;
  const memberCount = item.member_count ?? item.memberCount ?? 0;

  return {
    id: Number(id),
    name: String(name),
    icon: icon ? String(icon) : undefined,
    memberCount: Number(memberCount) || 0,
  };
};

export async function getAzits(): Promise<Azit[]> {
  const res = await api.get<
    ApiResponse<{ azits: AzitResDto[] }> | { azits: AzitResDto[] } | AzitResDto[]
  >("/azits");

  const payload = (res.data as any)?.data ?? res.data;
  const rawList = Array.isArray((payload as any)?.azits)
    ? (payload as any).azits
    : Array.isArray(payload)
      ? payload
      : [];

  return rawList.map((item: RawAzit) => normalizeAzit(item)).filter((azit) => Boolean(azit.id));
}

export async function createAzit(azitName: string): Promise<Azit> {
  const formData = new FormData();
  formData.append("azit_name", azitName);

  const res = await api.post<ApiResponse<AzitResDto>>("/azits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data.error || res.data.statusCode < 200 || res.data.statusCode >= 300) {
    throw new Error("아지트 생성 중 오류가 발생했습니다.");
  }

  return normalizeAzit(res.data.data);
}
