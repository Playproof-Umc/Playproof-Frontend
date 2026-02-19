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
  return {
    azit_id: params.azitId,
    azit_name: "더미 아지트",
    members: [
      { member_id: 1, nickname: "레나", avatar_url: null, role: "OWNER" },
      { member_id: 2, nickname: "철수", avatar_url: null, role: "MEMBER" },
      { member_id: 3, nickname: "민지", avatar_url: null, role: "MEMBER" }
    ],
    nextCursor: null,
    hasNext: false
  };
}

export function mapAzitMembersToUsers(members: AzitMemberResDto[]): User[] {
  return members.map((m) => ({
    id: String(m.member_id),
    nickname: m.nickname ?? "Unknown",
    avatarUrl: m.avatar_url ?? undefined,
    isOnline: false,
  }));
}
