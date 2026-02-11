// src/features/team/api/azitApi.ts

import { api } from "@/services/api";
import type { Azit } from "@/features/team/types";

type RawAzit = Record<string, any>;

type AzitResDto = {
  azit_id: number;
  azit_name: string;
  azit_icon_url: string | null;
  member_count?: number;
};

type AzitListResponse = {
  statusCode: number;
  data: { azits: AzitResDto[] };
  error: null | unknown;
};

type AzitCreateResponse = {
  statusCode: number;
  data: AzitResDto;
  error: null | unknown;
};

type AzitUpdateResponse = {
  statusCode: number;
  data: AzitResDto;
  error: null | unknown;
};

const normalizeAzit = (item: RawAzit): Azit => {
  const id = item.id ?? item.azit_id ?? item.azitId ?? 0;
  const name = item.name ?? item.azit_name ?? item.title ?? "";
  const icon =
    item.icon ??
    item.icon_url ??
    item.iconUrl ??
    item.image_url ??
    item.azit_icon_url ??
    "";
  const memberCount =
    item.memberCount ??
    item.member_count ??
    item.members_count ??
    item.member_cnt ??
    item.membersCount ??
    (Array.isArray(item.members) ? item.members.length : undefined) ??
    (Array.isArray(item.azit_users) ? item.azit_users.length : undefined) ??
    (Array.isArray(item.azitUsers) ? item.azitUsers.length : undefined) ??
    (Array.isArray(item.users) ? item.users.length : undefined) ??
    0;
  const description = item.description ?? item.desc ?? item.detail ?? undefined;

  return {
    id: Number(id),
    name: String(name),
    icon: icon ? String(icon) : undefined,
    memberCount: Number(memberCount) || 0,
    description: description ? String(description) : undefined,
  };
};

export async function getAzits(): Promise<Azit[]> {
  const res = await api.get<AzitListResponse>("/azits");
  if (res.data?.error || (res.data?.statusCode && res.data.statusCode !== 200)) {
    throw new Error("아지트 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const payload = res.data?.data ?? (res.data as unknown);
  const rawList = Array.isArray((payload as any)?.azits)
    ? (payload as any).azits
    : Array.isArray(payload)
      ? payload
      : [];

  if (!Array.isArray(rawList)) return [];
  return rawList.map((item: RawAzit) => normalizeAzit(item)).filter((azit) => Boolean(azit.id));
}

export async function createAzit(payload: { azit_name: string; azit_icon?: File | null }): Promise<AzitResDto> {
  const formData = new FormData();
  formData.append("azit_name", payload.azit_name);
  if (payload.azit_icon) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.post<AzitCreateResponse>("/azits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 201)) {
    throw new Error("아지트 생성에 실패했습니다.");
  }
  return res.data.data;
}

export async function updateAzit(
  azitId: number,
  payload: { azit_name?: string | null; azit_icon?: File | string | null; is_delete_icon?: boolean }
): Promise<AzitResDto> {
  const hasName = payload.azit_name !== undefined;
  const hasFile = payload.azit_icon instanceof File;
  const hasDeleteFlag = payload.is_delete_icon !== undefined;

  if (hasName && !hasFile && !hasDeleteFlag) {
    const res = await api.patch<AzitUpdateResponse>(`/azits/${azitId}`, {
      azit_name: payload.azit_name ?? "",
    });
    if (res.data.error || res.data.statusCode !== 200) {
      throw new Error("아지트 설정 변경에 실패했습니다.");
    }
    return res.data.data;
  }

  const formData = new FormData();
  if (payload.azit_name !== undefined) formData.append("azit_name", payload.azit_name ?? "");
  if (payload.is_delete_icon !== undefined) formData.append("is_delete_icon", String(payload.is_delete_icon));
  if (payload.azit_icon instanceof File) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.patch<AzitUpdateResponse>(`/azits/${azitId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("아지트 설정 변경에 실패했습니다.");
  }
  return res.data.data;
}
