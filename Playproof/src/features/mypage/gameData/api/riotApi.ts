// src/features/mypage/gameData/api/riotApi.ts

import axios from "axios";

const api = axios.create({
  baseURL: "/api/riot",
  timeout: 10_000,
});

/* =========================
 * DTO
 * ========================= */
export type AccountDto = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type SummonerDto = {
  profileIconId?: number;
  summonerLevel?: number;
};

export type LeagueEntryDto = {
  queueType: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
};

export type MatchDto = {
  metadata: { matchId: string };
  info: {
    queueId?: number;
    gameDuration: number;
    participants: Array<{
      puuid: string;
      teamId?: number;
      win: boolean;
      kills: number;
      deaths: number;
      assists: number;
      championName: string;
      teamPosition?: string;
      lane?: string;
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;
    }>;
  };
};

const parseJsonMaybe = <T,>(value: unknown): T => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
};

/* =========================
 * API functions
 * ========================= */

async function getPuuidByRiotId(gameName: string, tagLine: string): Promise<AccountDto> {
  const { data } = await api.get("/account", { params: { gameName, tagLine } });
  return parseJsonMaybe<AccountDto>(data);
}

async function getSummonerByPuuid(puuid: string): Promise<SummonerDto> {
  const { data } = await api.get("/summoner", { params: { puuid } });
  return parseJsonMaybe<SummonerDto>(data);
}

/**
 * ✅ League-V4 (PUUID 기반)
 */
async function getLeagueEntriesByPuuid(
  puuid: string | null | undefined
): Promise<LeagueEntryDto[]> {
  if (!puuid) return [];

  const res = await api.get("/league", {
    params: { puuid },
    validateStatus: () => true,
  });

  if (res.status === 403 || res.status === 404) return [];

  const parsed = parseJsonMaybe<unknown>(res.data);
  return (Array.isArray(parsed) ? parsed : []) as LeagueEntryDto[];
}

async function getMatchIdsByPuuid(
  puuid: string,
  options?: { start?: number; count?: number }
): Promise<string[]> {
  const { data } = await api.get("/match-ids", {
    params: {
      puuid,
      start: options?.start ?? 0,
      count: options?.count ?? 10,
    },
  });
  return parseJsonMaybe<string[]>(data);
}

async function getMatchDetail(matchId: string): Promise<MatchDto> {
  const { data } = await api.get("/match", { params: { matchId } });
  return parseJsonMaybe<MatchDto>(data);
}

export const riotApi = {
  getPuuidByRiotId,
  getSummonerByPuuid,
  getLeagueEntriesByPuuid,
  getMatchIdsByPuuid,
  getMatchDetail,
};
