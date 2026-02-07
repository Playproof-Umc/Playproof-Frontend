// src/features/mypage/gameData/api/valorantApi.ts

import axios from "axios";

type GetMmrParams = { region: string; name: string; tag: string };
type GetMatchesParams = {
  region: string;
  name: string;
  tag: string;
  size?: number;
  offset?: number;
};
type GetMatchDetailParams = { region: string; matchId: string };

type ValorantMmrResponse = {
  tierText: string;
  rr: number | null;
  needsGame?: boolean;
  reason?: string;
  accountLevel?: number | null;
  resolved?: { name: string; tag: string; region: string };
};

type ValorantMatchesResponse = {
  matchIds: string[];
  needsGame?: boolean;
  reason?: string;
  accountLevel?: number | null;
  resolved?: { name: string; tag: string; region: string };
};

type ValorantMatchPlayer = {
  name: string;
  tag: string;
  kills: number;
  deaths: number;
};

type ValorantMatchDetailResponse = {
  matchId: string;
  players: ValorantMatchPlayer[];
};

const client = axios.create({
  baseURL: "/api/valorant",
  headers: { "Content-Type": "application/json" },
});

export const valorantApi = {
  async getMmrByRiotId(params: GetMmrParams): Promise<ValorantMmrResponse> {
    const { region, name, tag } = params;
    const res = await client.get("/mmr", { params: { region, name, tag } });
    return res.data as ValorantMmrResponse;
  },

  async getMatchesByRiotId(params: GetMatchesParams): Promise<ValorantMatchesResponse> {
    const { region, name, tag, size = 10, offset = 0 } = params;
    const res = await client.get("/matches", {
      params: { region, name, tag, size, offset },
    });
    return res.data as ValorantMatchesResponse;
  },

  async getMatchDetail(params: GetMatchDetailParams): Promise<ValorantMatchDetailResponse> {
    const { region, matchId } = params;
    const res = await client.get("/match", { params: { region, matchId } });
    return res.data as ValorantMatchDetailResponse;
  },
};