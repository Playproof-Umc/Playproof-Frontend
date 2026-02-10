// src/features/team/api/azitApi.ts

import { api } from "@/services/api";
import type { Azit } from "@/features/team/types";
import type { User } from "@/types";

type RawAzit = Record<string, any>;

const normalizeAzit = (item: RawAzit): Azit => {
  const id = item.id ?? item.azit_id ?? item.azitId ?? 0;
  const name = item.name ?? item.azit_name ?? item.title ?? "";
  const icon = item.icon ?? item.icon_url ?? item.iconUrl ?? item.image_url ?? "";
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
  const res = await api.get("/azits");
  const data = res.data?.data ?? res.data;
  const rawList = Array.isArray(data?.azits)
    ? data.azits
    : Array.isArray(data)
      ? data
      : [];

  if (!Array.isArray(rawList)) return [];
  return rawList.map((item) => normalizeAzit(item)).filter((azit) => Boolean(azit.id));
}

type RawAzitMember = Record<string, any>;

const normalizeAzitMember = (item: RawAzitMember): User => {
  const id = item.member_id ?? item.user_id ?? item.id ?? "";
  const nickname = item.nickname ?? item.name ?? "";
  const avatarUrl = item.avatar_url ?? item.avatarUrl ?? item.profile_image ?? undefined;

  return {
    id: String(id),
    nickname: String(nickname),
    avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
  };
};

export async function getAzitMembers(azitId: number): Promise<User[]> {
  const res = await api.get(`/azits/${azitId}/members`);
  const data = res.data?.data ?? res.data;
  const rawMembers = Array.isArray(data?.members) ? data.members : [];
  return rawMembers.map((item) => normalizeAzitMember(item));
}
