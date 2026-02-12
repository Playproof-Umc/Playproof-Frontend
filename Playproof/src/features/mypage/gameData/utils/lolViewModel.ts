// src/features/mypage/gameData/utils/lolViewModel.ts

import type { AccountDto, LeagueEntryDto, MatchDto, SummonerDto } from "@/features/mypage/gameData/api/riotApi";
import type { LolAggregateStats, LolLinkedProfile, LolMatchItem, MatchResult } from "@/features/mypage/gameData/types/gameDataTypes";

/* =========================================================
   ✅ 로컬 챔피언 이미지 (정적 import)
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
   기본 유틸
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

const readStringField = <T extends object>(obj: T | null | undefined, key: string) => {
  const v = (obj as unknown as Record<string, unknown> | null)?.[key];
  return typeof v === "string" ? v : "";
};

const readNumberFieldLoose = <T extends object>(obj: T | null | undefined, key: string): number | null => {
  const v = (obj as unknown as Record<string, unknown> | null)?.[key];
  return typeof v === "number" ? v : null;
};

/* =========================================================
   ✅ buildLolLinkedProfile
   ⭐ FIX: 헤더에서 사용하는 필드들을 실제로 채운다.
========================================================= */

export const buildLolLinkedProfile = (
  account: AccountDto,
  summoner: SummonerDto | null,
  leagueEntries: LeagueEntryDto[]
): LolLinkedProfile => {
  const solo = pickSoloQueue(leagueEntries);

  const tierText = solo ? formatTier(solo.tier, solo.rank) : "Unranked";
  const winRatePercent = solo ? toPercent(solo.wins, solo.losses) : 0;

  // RiotID / Summoner 정보 (최소 DTO라서 안전 접근)
  const summonerName = readStringField(summoner, "name");
  const summonerLevel = readNumberFieldLoose(summoner, "summonerLevel");
  const profileIconId = readNumberFieldLoose(summoner, "profileIconId");

  const riotId = `${account.gameName}#${account.tagLine}`;

  // serverLabel은 네 프로젝트에서 KR 고정으로 쓰는 편이 안전 (필요하면 나중에 확장)
  const serverLabel = "KR";

  return {
    gameKey: "lol",
    title: "리그 오브 레전드",
    subtitle: "League of Legends",

    // 기존 필드
    tierText,
    mainPosition: "미정",
    winRatePercent,

    // ✅ 헤더 카드에서 쓰는 필드들 (없어서 UI가 비어있던 원인)
    riotId,
    summonerName,
    serverLabel,
    summonerLevel: summonerLevel ?? undefined,
    profileIconId: profileIconId ?? undefined,

    // ✅ 헤더가 currentTier를 직접 쓰는 경우도 있어서 같이 제공
    currentTier: tierText,

    meta: {
      riot: {
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        summonerName,
      },
    },
  } as LolLinkedProfile;
};

/* =========================================================
   ✅ buildLolAggregateStats (export 유지)
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
    .map(([name]) => ({ name }));

  return {
    totalGames: total,
    wins,
    losses,
    winRatePercent: total > 0 ? Math.round((wins / total) * 100) : 0,
    avgKills: Math.round(avgKills * 10) / 10,
    avgDeaths: Math.round(avgDeaths * 10) / 10,
    avgAssists: Math.round(avgAssists * 10) / 10,
    avgKdaRatio: Math.round(avgKdaRatio * 100) / 100,
    mostChampions,
    items,
  };
};

/* =========================================================
   ✅ buildLolMatchList (export 유지)
========================================================= */

export const buildLolMatchList = (matches: MatchDto[], myPuuid: string): LolMatchItem[] => {
  return matches
    .map((m) => {
      const me = m.info.participants.find((p) => p.puuid === myPuuid);
      if (!me) return null;

      const result: MatchResult = me.win ? "win" : "loss";
      const myTeamId = me.teamId;

      const teamChampions = m.info.participants
        .filter((p) => p.teamId === myTeamId)
        .map((p) => (typeof p.championName === "string" ? p.championName.trim() : ""))
        .filter((x) => x.length > 0);

      const opponentChampions = m.info.participants
        .filter((p) => p.teamId !== myTeamId)
        .map((p) => (typeof p.championName === "string" ? p.championName.trim() : ""))
        .filter((x) => x.length > 0);

      const myChampionName =
        typeof me.championName === "string" && me.championName.trim().length > 0 ? me.championName.trim() : "Unknown";

      return {
        id: m.metadata.matchId,
        result,
        queueLabel: "솔랭",
        durationText: secondsToKoreanDuration(m.info.gameDuration),
        kdaText: `${me.kills}/${me.deaths}/${me.assists}`,
        kdaRatioText: `${kdaRatio(me.kills, me.deaths, me.assists).toFixed(2)}:1 평점`,
        pills: [`CS ${getCs(me)}`, `골드 ${(getGold(me) / 1000).toFixed(1)}k`],
        itemsCount: extractItemsCount(me),
        myChampionName,
        teamChampions,
        opponentChampions,
      };
    })
    .filter(Boolean) as LolMatchItem[];
};

/* =========================================================
   ✅ getChampionIconUrl (export 유지)
========================================================= */

const CHAMPION_ALIAS: Record<string, string> = {
  FiddleSticks: "Fiddlesticks",
  MonkeyKing: "Wukong",
  Leblanc: "LeBlanc",
  Khazix: "KhaZix",
  RekSai: "RekSai",
};

export function getChampionIconUrl(championName?: string | null) {
  const raw = (championName ?? "").trim();
  if (!raw || raw === "Unknown") return "";

  const normalized = CHAMPION_ALIAS[raw] ?? raw;

  if (LOCAL_CHAMP_MAP[normalized]) return LOCAL_CHAMP_MAP[normalized];

  const versionRaw = import.meta.env.VITE_DDRAGON_VERSION || "14.16.1";
  const version = String(versionRaw).trim();

  return `https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(version)}/img/champion/${encodeURIComponent(
    normalized
  )}.png`;
}

/* =========================================================
   ✅ computeMainPosition (export 유지)
========================================================= */

export function computeMainPosition(participants: Array<{ teamPosition?: string | null; lane?: string | null }>) {
  const counts = new Map<string, number>();

  const add = (raw?: string | null) => {
    const v = (raw ?? "").trim();
    if (!v || v === "NONE" || v === "Invalid" || v === "UNDEFINED") return;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  };

  for (const p of participants) add(p.teamPosition);
  if (counts.size === 0) for (const p of participants) add(p.lane);

  let best = "미정";
  let bestCount = 0;
  for (const [k, c] of counts.entries()) {
    if (c > bestCount) {
      best = k;
      bestCount = c;
    }
  }

  const labelMap: Record<string, string> = {
    TOP: "TOP",
    JUNGLE: "JUNGLE",
    MIDDLE: "MID",
    MID: "MID",
    BOTTOM: "ADC",
    ADC: "ADC",
    SUPPORT: "SUP",
    UTILITY: "SUP",
  };

  return labelMap[best] ?? best;
}
