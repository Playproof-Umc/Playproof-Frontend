// src/features/mypage/gameData/utils/lolViewModel.ts

import type { AccountDto, LeagueEntryDto, MatchDto, SummonerDto } from "@/features/mypage/gameData/api/riotApi";
import type { LolAggregateStats, LolLinkedProfile, LolMatchItem, MatchResult } from "@/features/mypage/gameData/types/gameDataTypes";

/* =========================================================
   Local champion images (optional)
========================================================= */
import Ambessa from "@/assets/lol/champions/Ambessa.png";
import Mel from "@/assets/lol/champions/Mel.png";
import Yunara from "@/assets/lol/champions/Yunara.png";
import Zaahen from "@/assets/lol/champions/Zaahen.png";

const LOCAL_CHAMP_MAP: Record<string, string> = {
  Ambessa,
  Mel,
  Yunara,
  Zaahen,
};

/* =========================================================
   Basic utils
========================================================= */

const pickSoloQueue = (entries: LeagueEntryDto[]) =>
  entries.find((e) => e.queueType === "RANKED_SOLO_5x5") ?? null;

const formatTier = (tier: string, rank: string) => {
  if (!tier) return "Unranked";
  if (!rank) return tier;
  return `${tier[0] + tier.slice(1).toLowerCase()} ${rank}`;
};

const toPercent = (wins: number, losses: number) => {
  const total = wins + losses;
  if (total <= 0) return 0;
  return Math.round((wins / total) * 100);
};

const secondsToKoreanDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}분 ${s}초`;
};

const kdaRatio = (k: number, d: number, a: number) => {
  const denom = d <= 0 ? 1 : d;
  const r = (k + a) / denom;
  return Math.round(r * 100) / 100;
};

const extractItemsCount = (p: MatchDto["info"]["participants"][number]) => {
  const items = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6];
  return items.filter((x) => x && x !== 0).length;
};

const readNumberField = <T extends object>(obj: T, key: string): number | null => {
  const v = (obj as unknown as Record<string, unknown>)[key];
  return typeof v === "number" ? v : null;
};

const getCs = (p: MatchDto["info"]["participants"][number]) => {
  const lane = readNumberField(p, "totalMinionsKilled") ?? 0;
  const jungle = readNumberField(p, "neutralMinionsKilled") ?? 0;
  return lane + jungle;
};

const getGold = (p: MatchDto["info"]["participants"][number]) => {
  return readNumberField(p, "goldEarned") ?? 0;
};

/* =========================================================
   buildLolLinkedProfile
========================================================= */

export type BuildLolProfileOptions = {
  fallbackWinRatePercent?: number;
  fallbackMainPosition?: string;
};

export const buildLolLinkedProfile = (
  account: AccountDto,
  summoner: SummonerDto | null,
  leagueEntries: LeagueEntryDto[],
  options?: BuildLolProfileOptions
): LolLinkedProfile => {
  const solo = pickSoloQueue(leagueEntries);
  const wins = solo?.wins ?? 0;
  const losses = solo?.losses ?? 0;
  const winRatePercent =
    typeof options?.fallbackWinRatePercent === "number"
      ? options.fallbackWinRatePercent
      : toPercent(wins, losses);

  return {
    summonerName: account.gameName,
    tagLine: account.tagLine,
    riotId: `${account.gameName}#${account.tagLine}`,
    serverLabel: "Kr server",
    profileIconId: summoner?.profileIconId,
    summonerLevel: summoner?.summonerLevel,
    currentTier: solo ? formatTier(solo.tier, solo.rank) : "Unranked",
    mainPosition: options?.fallbackMainPosition ?? "미정",
    winRatePercent,
  };
};

/* =========================================================
   buildLolAggregateStats
========================================================= */

export const buildLolAggregateStats = (matches: MatchDto[], myPuuid: string): LolAggregateStats => {
  const items = buildLolMatchList(matches, myPuuid);

  const total = items.length;
  const wins = items.filter((x) => x.result === "win").length;
  const losses = total - wins;

  const kda = matches
    .map((m) => m.info.participants.find((p) => p.puuid === myPuuid))
    .filter(Boolean)
    .map((p) => ({
      k: p!.kills,
      d: p!.deaths,
      a: p!.assists,
    }));

  const avgKills = total > 0 ? kda.reduce((s, x) => s + x.k, 0) / total : 0;
  const avgDeaths = total > 0 ? kda.reduce((s, x) => s + x.d, 0) / total : 0;
  const avgAssists = total > 0 ? kda.reduce((s, x) => s + x.a, 0) / total : 0;
  const avgKdaRatio = kdaRatio(avgKills, avgDeaths, avgAssists);

  const champCounts = new Map<string, number>();
  for (const m of matches) {
    const me = m.info.participants.find((p) => p.puuid === myPuuid);
    if (!me) continue;
    const name = typeof me.championName === "string" ? me.championName.trim() : "";
    if (!name) continue;
    champCounts.set(name, (champCounts.get(name) ?? 0) + 1);
  }

  const mostChampions = Array.from(champCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, games]) => ({ name, games }));

  return {
    wins,
    losses,
    winRatePercent: total > 0 ? Math.round((wins / total) * 100) : 0,
    avgKills: Math.round(avgKills * 10) / 10,
    avgDeaths: Math.round(avgDeaths * 10) / 10,
    avgAssists: Math.round(avgAssists * 10) / 10,
    avgKdaRatio: Math.round(avgKdaRatio * 100) / 100,
    mostChampions,
  };
};

/* =========================================================
   buildLolMatchList
========================================================= */

export const buildLolMatchList = (matches: MatchDto[], myPuuid: string): LolMatchItem[] => {
  const validMatches = matches.filter((m) => m && m.info && m.info.participants);

  return validMatches
    .map((m) => {
      const me = m.info.participants.find((x) => x.puuid === myPuuid);
      if (!me) return null as any;

      const win = me.win;
      const result: MatchResult = win ? "win" : "lose";

      const myTeamId = me.teamId;
      const teamChampions = m.info.participants
        .filter((p) => p.teamId === myTeamId)
        .map((p) => p.championName);
      const opponentChampions = m.info.participants
        .filter((p) => p.teamId !== myTeamId)
        .map((p) => p.championName);

      const cs = getCs(me);
      const gold = getGold(me);

      return {
        id: m.metadata.matchId,
        result,
        queueLabel: "솔랭",
        durationText: secondsToKoreanDuration(m.info.gameDuration),
        kdaText: `${me.kills}/${me.deaths}/${me.assists}`,
        kdaRatioText: `${kdaRatio(me.kills, me.deaths, me.assists).toFixed(2)}:1 평점`,
        pills: [`CS ${cs}`, `골드 ${(gold / 1000).toFixed(1)}k`],
        itemsCount: extractItemsCount(me),
        myChampionName: me.championName,
        teamChampions,
        opponentChampions,
      } as LolMatchItem;
    })
    .filter(Boolean) as LolMatchItem[];
};

/* =========================================================
   helpers for UI
========================================================= */

const POSITION_MAP: Record<string, string> = {
  TOP: "탑",
  JUNGLE: "정글",
  MIDDLE: "미드",
  MID: "미드",
  BOTTOM: "원딜",
  ADC: "원딜",
  UTILITY: "서폿",
  SUPPORT: "서폿",
};

export const computeMainPosition = (matches: MatchDto[], puuid: string): string => {
  const counts = new Map<string, number>();
  for (const m of matches ?? []) {
    const me = m?.info?.participants?.find((p) => p.puuid === puuid);
    if (!me) continue;
    const raw = me.teamPosition || me.lane || "UNKNOWN";
    const label = POSITION_MAP[raw] ?? "미정";
    if (label === "미정") continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "미정";
};

export const getChampionIconUrl = (name: string): string => {
  const local = LOCAL_CHAMP_MAP[name];
  if (local) return local;
  const normalized = name.replace(/[^A-Za-z0-9]/g, "");
  if (!normalized) return "";
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${normalized}.png`;
};
