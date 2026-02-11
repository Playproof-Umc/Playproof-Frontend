// src/features/team/api/azitMemberApi.ts

import { api } from "@/services/api";

export type ApiError = {
  code: string;
  message: string;
  errors?: { field: string; value: unknown; reason: string }[];
};

export type Result<T> =
  | { statusCode: number; data: T; error: null }
  | { statusCode: number; data: null; error: ApiError };

export type AzitMemberResDto = {
  member_id: number;
  nickname: string | null;
  avatar_url: string | null;
  role: string;
};

export type GetAzitMembersResDto = {
  azit_id: number;
  azit_name: string;
  members: AzitMemberResDto[];
  nextCursor: number | null;
  hasNext: boolean;
};

export async function getAzitMembers(params: {
  azitId: number;
  page?: number;
  size?: number;
}): Promise<GetAzitMembersResDto> {
  const { azitId, page, size } = params;
  const qs = new URLSearchParams();
  if (page) qs.set("page", String(page));
  if (size) qs.set("size", String(size));

  const res = await api.get<Result<GetAzitMembersResDto>>(
    `/azits/${azitId}/members${qs.toString() ? `?${qs.toString()}` : ""}`
  );
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "아지트 멤버 조회 실패");
  }
  return res.data.data;
}
