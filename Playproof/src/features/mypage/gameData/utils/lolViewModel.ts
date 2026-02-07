// src/features/mypage/gameData/utils/lolViewModel.ts

import type { AccountDto, LeagueEntryDto, MatchDto, SummonerDto } from "@/features/mypage/gameData/api/riotApi";
import type {
  ChampionIcon,
  LolAggregateStats,
  LolLinkedProfile,
  LolMatchItem,
  MatchResult,
} from "@/features/mypage/gameData/types/gameDataTypes";

const DDRAGON_VERSION = import.meta.env.VITE_DDRAGON_VERSION ?? "14.16.1";

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

const secondsToMsLabel = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
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

/** match-v5 queueId → 한국어 라벨 */
const queueIdToLabel = (queueId?: number): string => {
  switch (queueId) {
    case 420:
      return "솔로 랭크";
    case 440:
      return "자유 랭크";
    case 430:
      return "일반";
    case 450:
      return "칼바람";
    case 490:
      return "일반(빠른대전)";
    case 900:
      return "URF";
    case 1700:
      return "아레나";
    default:
      return "일반";
  }
};

/**
 * ✅ DDragon 챔피언 아이콘 예외 매핑 (기존)
 */
const CHAMPION_ICON_OVERRIDES: Record<string, string> = {
  FiddleSticks: "Fiddlesticks",
  Wukong: "MonkeyKing",
};

/**
 * ✅ 최근 챔피언: 로컬 assets 우선 사용
 * - 파일은 playproof/src/assets/lol/champions/*.png 에 위치해야 함
 */
const LOCAL_CHAMPION_ASSETS: Record<string, string> = {
  Ambessa: new URL("@/assets/lol/champions/Ambessa.png", import.meta.url).href,
  Mel: new URL("@/assets/lol/champions/Mel.png", import.meta.url).href,
  Yunara: new URL("@/assets/lol/champions/Yunara.png", import.meta.url).href,
  Zaahen: new URL("@/assets/lol/champions/Zaahen.png", import.meta.url).href,
};

/**
 * ✅ 챔피언 아이콘 URL 단일 진실 소스
 * 1) 로컬 assets (최근 챔피언)
 * 2) DDragon CDN fallback
 */
export const getChampionIconUrl = (championName: string) => {
  const local = LOCAL_CHAMPION_ASSETS[championName];
  if (local) return local;

  const fixed = CHAMPION_ICON_OVERRIDES[championName] ?? championName;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${fixed}.png`;
};

const toChampionIcon = (championName: string): ChampionIcon => ({
  name: championName,
  iconUrl: getChampionIconUrl(championName),
});

const normalizePosition = (
  raw?: string
): "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY" | null => {
  if (!raw) return null;

  if (raw === "TOP" || raw === "JUNGLE" || raw === "MIDDLE" || raw === "BOTTOM" || raw === "UTILITY") {
    return raw;
  }

  if (raw === "MID") return "MIDDLE";
  if (raw === "BOT") return "BOTTOM";
  if (raw === "NONE") return null;

  return null;
};

const positionToKo = (pos: "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY") => {
  switch (pos) {
    case "TOP":
      return "탑";
    case "JUNGLE":
      return "정글";
    case "MIDDLE":
      return "미드";
    case "BOTTOM":
      return "원딜";
    case "UTILITY":
      return "서폿";
  }
};

export const computeMainPosition = (matches: MatchDto[], puuid: string): string => {
  const counts: Record<"TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY", number> = {
    TOP: 0,
    JUNGLE: 0,
    MIDDLE: 0,
    BOTTOM: 0,
    UTILITY: 0,
  };

  for (const m of matches) {
    const p = m.info.participants.find((x) => x.puuid === puuid);
    if (!p) continue;

    const normalized = normalizePosition(p.teamPosition) ?? normalizePosition(p.lane);
    if (!normalized) continue;

    counts[normalized] += 1;
  }

  const entries = Object.entries(counts) as Array<[keyof typeof counts, number]>;
  entries.sort((a, b) => b[1] - a[1]);

  const top = entries[0];
  if (!top || top[1] <= 0) return "미정";

  return positionToKo(top[0]);
};

export const buildLolLinkedProfile = (
  account: AccountDto,
  summoner: SummonerDto | null,
  leagueEntries: LeagueEntryDto[],
  options?: { fallbackWinRatePercent?: number; fallbackMainPosition?: string }
): LolLinkedProfile => {
  const solo = pickSoloQueue(leagueEntries);

  const leagueWinRatePercent = solo ? toPercent(solo.wins, solo.losses) : 0;
  const fallbackWinRatePercent = options?.fallbackWinRatePercent;

  const winRatePercent =
    solo && solo.wins + solo.losses > 0
      ? leagueWinRatePercent
      : typeof fallbackWinRatePercent === "number"
        ? fallbackWinRatePercent
        : 0;

  const mainPosition = options?.fallbackMainPosition ?? "미정";

  return {
    summonerName: account.gameName,
    tagLine: account.tagLine,
    riotId: `${account.gameName}#${account.tagLine}`,

    serverLabel: "Kr server",

    profileIconId: summoner?.profileIconId,
    summonerLevel: summoner?.summonerLevel,

    currentTier: solo ? formatTier(solo.tier, solo.rank) : "Unranked",
    mainPosition,
    winRatePercent,
  };
};

export const buildLolAggregateStats = (matches: MatchDto[], puuid: string): LolAggregateStats => {
  const recent = matches
    .map((m) => m.info.participants.find((p) => p.puuid === puuid))
    .filter(Boolean) as MatchDto["info"]["participants"][number][];

  const wins = recent.filter((p) => p.win).length;
  const losses = recent.length - wins;

  const avgKills = recent.reduce((s, p) => s + (p.kills ?? 0), 0) / Math.max(1, recent.length);
  const avgDeaths = recent.reduce((s, p) => s + (p.deaths ?? 0), 0) / Math.max(1, recent.length);
  const avgAssists = recent.reduce((s, p) => s + (p.assists ?? 0), 0) / Math.max(1, recent.length);

  const avgKdaRatio = kdaRatio(avgKills, avgDeaths, avgAssists);
  const winRatePercent = toPercent(wins, losses);

  const championCount: Record<string, number> = {};
  recent.forEach((p) => {
    const c = p.championName ?? "Unknown";
    championCount[c] = (championCount[c] ?? 0) + 1;
  });

  const mostChampions = Object.entries(championCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, games]) => ({ name, games }));

  return {
    wins,
    losses,
    winRatePercent,
    avgKdaRatio,
    avgKills: Math.round(avgKills * 10) / 10,
    avgDeaths: Math.round(avgDeaths * 10) / 10,
    avgAssists: Math.round(avgAssists * 10) / 10,
    mostChampions,
  };
};

export const buildLolMatchList = (matches: MatchDto[], puuid: string): LolMatchItem[] => {
  return matches.map((m) => {
    const p = m.info.participants.find((x) => x.puuid === puuid);
    const win = p?.win ?? false;

    const result: MatchResult = win ? "win" : "lose";
    const k = p?.kills ?? 0;
    const d = p?.deaths ?? 0;
    const a = p?.assists ?? 0;

    const queueLabel = queueIdToLabel(m.info.queueId);

    const myChampion = p?.championName ? toChampionIcon(p.championName) : undefined;

    const myTeamId = p?.teamId;
    const allies =
      typeof myTeamId === "number"
        ? m.info.participants
            .filter((x) => x.teamId === myTeamId)
            .slice(0, 5)
            .map((x) => toChampionIcon(x.championName ?? "Unknown"))
        : undefined;

    const enemies =
      typeof myTeamId === "number"
        ? m.info.participants
            .filter((x) => x.teamId !== myTeamId)
            .slice(0, 5)
            .map((x) => toChampionIcon(x.championName ?? "Unknown"))
        : undefined;

    return {
      id: m.metadata.matchId,
      result,
      queueLabel,
      durationText: secondsToMsLabel(m.info.gameDuration),
      kdaText: `${k}/${d}/${a}`,
      kdaRatioText: `${kdaRatio(k, d, a).toFixed(2)}:1 KDA`,
      pills: ["피해량", "시야점수", "CS", "골드"],
      itemsCount: p ? extractItemsCount(p) : 0,
      myChampion,
      allies,
      enemies,
    };
  });
};
