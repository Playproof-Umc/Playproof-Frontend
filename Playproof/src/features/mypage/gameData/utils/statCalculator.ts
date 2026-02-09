// src/features/mypage/gameData/utils/statCalculator.ts

export interface HexagonStat {
  axis: string;
  value: number; // 0 ~ 100
}

interface ParticipantDto {
  puuid: string;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  goldEarned: number;
}

interface MatchDto {
  info: {
    participants: ParticipantDto[];
  };
}

export const calculateHexagonStats = (
  matches: MatchDto[],
  targetPuuid: string
): HexagonStat[] => {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalDamage = 0;
  let totalVisionScore = 0;
  let totalGold = 0;

  const gameCount = matches.length;
  if (gameCount === 0) return [];

  matches.forEach((match) => {
    const participant = match.info.participants.find(
      (p) => p.puuid === targetPuuid
    );
    if (!participant) return;

    totalKills += participant.kills;
    totalDeaths += participant.deaths;
    totalAssists += participant.assists;
    totalDamage += participant.totalDamageDealtToChampions;
    totalVisionScore += participant.visionScore;
    totalGold += participant.goldEarned;
  });

  const avgKills = totalKills / gameCount;
  const avgDeaths = totalDeaths === 0 ? 1 : totalDeaths / gameCount;
  const avgAssists = totalAssists / gameCount;
  const avgDamage = totalDamage / gameCount;
  const avgVision = totalVisionScore / gameCount;
  const avgGold = totalGold / gameCount;

  const attackScore = Math.min(
    100,
    (avgDamage / 20000) * 50 + (avgKills / 8) * 50
  );
  const defenseScore = Math.min(100, Math.max(0, 100 - avgDeaths * 10));
  const utilityScore = Math.min(100, (avgAssists / 10) * 100);
  const visionScore = Math.min(100, (avgVision / 30) * 100);
  const growthScore = Math.min(100, (avgGold / 12000) * 100);

  const kda =
    (totalKills + totalAssists) /
    (totalDeaths === 0 ? 1 : totalDeaths);
  const survivalScore = Math.min(100, kda * 20);

  return [
    { axis: "공격", value: Math.round(attackScore) },
    { axis: "방어", value: Math.round(defenseScore) },
    { axis: "유틸", value: Math.round(utilityScore) },
    { axis: "시야", value: Math.round(visionScore) },
    { axis: "성장", value: Math.round(growthScore) },
    { axis: "생존", value: Math.round(survivalScore) },
  ];
};

export const generateTags = (stats: HexagonStat[]): string[] => {
  const tags: string[] = [];

  const attack = stats.find((s) => s.axis === "공격")?.value ?? 0;
  const vision = stats.find((s) => s.axis === "시야")?.value ?? 0;

  if (attack > 80) tags.push("#캐리형");
  if (vision > 80) tags.push("#시야장악");
  if (tags.length === 0) tags.push("#밸런스형");

  return tags;
};
