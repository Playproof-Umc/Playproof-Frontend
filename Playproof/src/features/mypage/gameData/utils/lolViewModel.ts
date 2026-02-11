import type { AccountDto, LeagueEntryDto, MatchDto, SummonerDto } from "../api/riotApi";
import type { LolAggregateStats, LolLinkedProfile, LolMatchItem, MatchResult } from "../types/gameDataTypes";

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

// ✅ riotApi의 최소 DTO에 없을 수도 있는 필드들을 안전하게 읽기 위한 헬퍼
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

export const buildLolLinkedProfile = (
  account: AccountDto,
  summoner: SummonerDto | null,
  leagueEntries: LeagueEntryDto[]
): LolLinkedProfile => {
  const solo = pickSoloQueue(leagueEntries);
  const tierText = solo ? formatTier(solo.tier, solo.rank) : "Unranked";
  const winRatePercent = solo ? toPercent(solo.wins, solo.losses) : 0;

  return {
    gameKey: "lol",
    title: "리그 오브 레전드",
    subtitle: "League of Legends",
    tierText,
    mainPosition: "미정",
    winRatePercent,
    meta: {
      riot: {
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        summonerName: summoner?.name ?? "",
      },
    },
  };
};

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

  // 모스트 챔피언(단순 빈도)
  const champCounts = new Map<string, number>();
  for (const m of matches) {
    const me = m.info.participants.find((p) => p.puuid === myPuuid);
    if (!me) continue;
    champCounts.set(me.championName, (champCounts.get(me.championName) ?? 0) + 1);
  }
  const mostChampions = Array.from(champCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([championName]) => ({ championName }));

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

export const buildLolMatchList = (matches: MatchDto[], myPuuid: string): LolMatchItem[] => {
  return matches
    .map((m) => {
      const me = m.info.participants.find((p) => p.puuid === myPuuid);
      if (!me) return null;

      const result: MatchResult = me.win ? "win" : "loss";
      const myTeamId = me.teamId;

      const teamChampions = m.info.participants
        .filter((p) => p.teamId === myTeamId)
        .map((p) => p.championName);

      const opponentChampions = m.info.participants
        .filter((p) => p.teamId !== myTeamId)
        .map((p) => p.championName);

      return {
        id: m.metadata.matchId,
        result,
        queueLabel: "솔랭",
        durationText: secondsToKoreanDuration(m.info.gameDuration),
        kdaText: `${me.kills}/${me.deaths}/${me.assists}`,
        kdaRatioText: `${kdaRatio(me.kills, me.deaths, me.assists).toFixed(2)}:1 평점`,
        pills: [`CS ${getCs(me)}`, `골드 ${(getGold(me) / 1000).toFixed(1)}k`],
        itemsCount: extractItemsCount(me),

        // 뷰모델에 데이터 주입
        myChampionName: me.championName,
        teamChampions,
        opponentChampions,
      };
    })
    .filter(Boolean) as LolMatchItem[];
};

// ✅ 챔피언 아이콘 URL 단일 진실 소스
export function getChampionIconUrl(championName: string) {
  const local = new Set(["Ambessa", "Mel", "Yunara", "Zaahen"]);
  const alias: Record<string, string> = {
    FiddleSticks: "Fiddlesticks",
  };

  const normalized = alias[championName] ?? championName;

  if (local.has(normalized)) {
    return new URL(`@/assets/lol/champions/${normalized}.png`, import.meta.url).toString();
  }

  const version = import.meta.env.VITE_DDRAGON_VERSION || "14.16.1";
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalized}.png`;
}

// ✅ 최근 N판 기반 주 포지션 계산 (teamPosition 우선, 없으면 lane fallback)
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
