// src/features/team/api/azitApi.ts

import { api } from "@/services/api";
import type { Azit } from "@/features/team/types";

type RawAzit = Record<string, any>;

const normalizeAzit = (item: RawAzit): Azit => {
  const id = item.id ?? item.azit_id ?? item.azitId ?? 0;
  const name = item.name ?? item.azit_name ?? item.title ?? "";
  const icon = item.icon ?? item.icon_url ?? item.iconUrl ?? item.image_url ?? "";
  const memberCount =
    item.memberCount ??
    item.member_count ??
    item.members_count ??
    (Array.isArray(item.members) ? item.members.length : 0);
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
