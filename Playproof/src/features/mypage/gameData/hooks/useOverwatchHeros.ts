// src/features/mypage/gameData/hooks/useOverwatchHeros.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { overwatchClient } from "@/services/axios";

type HeroAny = Record<string, unknown>;

export type OverwatchHeroMeta = {
  key: string;
  name: string;
  iconUrl: string | null;
};

function pickString(obj: HeroAny, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

function toHeroMeta(raw: unknown): OverwatchHeroMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as HeroAny;

  const key = pickString(obj, ["key", "id", "hero", "hero_key"]);
  if (!key) return null;

  const name = pickString(obj, ["name", "localized_name", "displayName"]) ?? key;

  // OverFast가 어떤 필드명으로 주든 대응 (추정이 아니라 “방어적 파싱”)
  const iconUrl =
    pickString(obj, ["portrait", "icon", "image", "avatar"]) ??
    // role.icon 같은 구조가 있을 수도 있음
    (typeof obj["role"] === "object" && obj["role"]
      ? pickString(obj["role"] as HeroAny, ["icon"])
      : null);

  return { key: key.toLowerCase(), name, iconUrl };
}

async function fetchHeroes(locale: string): Promise<OverwatchHeroMeta[]> {
  const res = await overwatchClient.get<unknown>("/heroes", {
    params: { locale },
  });

  // 기대 형태: 배열 (OverFast heroes list)
  const data = res.data;
  if (!Array.isArray(data)) return [];

  const mapped = data.map(toHeroMeta).filter((v): v is OverwatchHeroMeta => v !== null);
  return mapped;
}

export function useOverwatchHeroes(input?: { locale?: string; enabled?: boolean }) {
  const locale = input?.locale ?? "ko-kr";
  const enabled = input?.enabled ?? true;

  const q = useQuery({
    queryKey: ["overwatchHeroes", locale],
    queryFn: () => fetchHeroes(locale),
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const map = useMemo(() => {
    const m = new Map<string, OverwatchHeroMeta>();
    for (const h of q.data ?? []) m.set(h.key, h);
    return m;
  }, [q.data]);

  return {
    list: q.data ?? [],
    map,
    isLoading: q.isLoading,
    isError: q.isError,
  };
}
