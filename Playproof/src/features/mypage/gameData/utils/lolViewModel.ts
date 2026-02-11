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

export const buildLolLinkedProfile = (
  account: AccountDto,
  summoner: SummonerDto | null,
  leagueEntries: LeagueEntryDto[]
): LolLinkedProfile => {
  const solo = pickSoloQueue(leagueEntries);
  const wins = solo?.wins ?? 0;
  const losses = solo?.losses ?? 0;
  const winRatePercent = toPercent(wins, losses);

  return {
    summonerName: account.gameName,
    tagLine: account.tagLine,
    riotId: `${account.gameName}#${account.tagLine}`,
    serverLabel: "Kr server",
    profileIconId: summoner?.profileIconId,
    summonerLevel: summoner?.summonerLevel,
    currentTier: solo ? formatTier(solo.tier, solo.rank) : "Unranked",
    mainPosition: "미정",
    winRatePercent,
  };
};

export const buildLolAggregateStats = (matches: MatchDto[], puuid: string): LolAggregateStats => {
  const validMatches = matches.filter((m) => m && m.info && m.info.participants);

  const recent = validMatches
    .map((m) => m.info.participants.find((p) => p.puuid === puuid))
    .filter(Boolean) as MatchDto["info"]["participants"][number][];

  let wins = 0;
  let losses = 0;
  let sumK = 0;
  let sumD = 0;
  let sumA = 0;

  const champCount = new Map<string, number>();

  for (const p of recent) {
    if (p.win) wins += 1;
    else losses += 1;
    sumK += p.kills;
    sumD += p.deaths;
    sumA += p.assists;
    champCount.set(p.championName, (champCount.get(p.championName) ?? 0) + 1);
  }

  const total = recent.length || 1;
  const mostChampions = [...champCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, games]) => ({ name, games }));

  return {
    wins,
    losses,
    winRatePercent: toPercent(wins, losses),
    avgKdaRatio: kdaRatio(sumK / total, sumD / total, sumA / total),
    avgKills: Math.round((sumK / total) * 10) / 10,
    avgDeaths: Math.round((sumD / total) * 10) / 10,
    avgAssists: Math.round((sumA / total) * 10) / 10,
    mostChampions,
  };
};

// ✅ [수정] 원본 데이터(MatchDto)를 뷰모델(LolMatchItem)로 변환하는 핵심 로직
export const buildLolMatchList = (matches: MatchDto[], puuid: string): LolMatchItem[] => {
  const validMatches = matches.filter((m) => m && m.info && m.info.participants);

  return validMatches.map((m) => {
    const me = m.info.participants.find((x) => x.puuid === puuid);
    if (!me) return null as any;

    const win = me.win;
    const result: MatchResult = win ? "win" : "lose";

    // ✨ 팀 챔피언 정보 추출 (복구 로직)
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
      pills: [`CS ${me.totalMinionsKilled}`, `골드 ${(me.goldEarned / 1000).toFixed(1)}k`],
      itemsCount: extractItemsCount(me),

      // 뷰모델에 데이터 주입
      myChampionName: me.championName,
      teamChampions,
      opponentChampions,
    };
  }).filter(Boolean);
};
