// src/features/team/api/azitMemberApi.ts

import { api } from "@/services/api";
import type { User } from "@/types";

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  error: null | { code: string; message: string; errors?: unknown[] };
};

type AzitMemberResDto = {
  member_id: number;
  nickname: string | null;
  avatar_url: string | null;
  role: string;
};

type GetAzitMembersResDto = {
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
  const { azitId, page = 1, size = 20 } = params;
  const res = await api.get<ApiResponse<GetAzitMembersResDto>>(
    `/azits/${azitId}/members`,
    { params: { page, size } }
  );
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error(res.data.error?.message ?? "아지트 멤버 조회 실패");
  }
  return res.data.data;
}

export function mapAzitMembersToUsers(members: AzitMemberResDto[]): User[] {
  return members.map((m) => ({
    id: String(m.member_id),
    nickname: m.nickname ?? "Unknown",
    avatarUrl: m.avatar_url ?? undefined,
    isOnline: false,
  }));
}
