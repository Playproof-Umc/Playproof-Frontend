// src/features/mypage/gameData/utils/valorantHenrikMapper.ts

export type ValorantMatchResult = "WIN" | "LOSS" | "DRAW";

export interface ValorantAgent {
  id: string;
  name: string;
  iconUrl: string;
}

export interface ValorantMatchRowVM {
  result: ValorantMatchResult;
  durationText: string; // "22m 3s"
  queueTypeText: string; // "경쟁전", "일반전", ...
  myAgent: ValorantAgent;
  allyAgents: ValorantAgent[];
  enemyAgents: ValorantAgent[];
  kdaText: string; // "18 / 12 / 6"
}

/**
 * HenrikDev Match(v2/v4 계열)에서 우리가 필요한 최소 필드만 DTO로 정의
 * - metadata: mode(=Competitive 등), game_length(ms)
 * - players.all_players: puuid, team(Red/Blue), character, assets.agent.small, stats(k/d/a)
 * - teams.red/blue.has_won, rounds_won/lost
 *
 * 참고: HenrikDev Match 문서 예시 구조 :contentReference[oaicite:1]{index=1}
 */
export interface HenrikMatchDto {
  metadata: {
    mode?: string; // "Competitive", "Unrated", ...
    mode_id?: string; // "competitive", "unrated", ...
    game_length?: number; // ms (v2 예시)
    game_length_in_ms?: number; // ms (v4 matchlist 등에서 보임)
  };
  players: {
    all_players: Array<{
      puuid: string;
      team: "Red" | "Blue";
      character: string; // agent name
      assets?: {
        agent?: {
          small?: string;
          full?: string;
          bust?: string;
          killfeed?: string;
        };
      };
      stats?: {
        kills?: number;
        deaths?: number;
        assists?: number;
      };
    }>;
  };
  teams?: {
    red?: { has_won?: boolean; rounds_won?: number; rounds_lost?: number };
    blue?: { has_won?: boolean; rounds_won?: number; rounds_lost?: number };
  };
}

export function formatDurationFromSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function formatDurationFromMs(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return formatDurationFromSeconds(seconds);
}

/** mode/mode_id를 “텍스트 라벨”로만 표시 (LoL 톤과 동일) */
export function mapHenrikModeToKoreanText(mode?: string, modeId?: string): string {
  const key = (modeId || mode || "").toLowerCase();

  // 주로 쓰는 큐들 우선 매핑
  if (key.includes("competitive")) return "경쟁전";
  if (key.includes("unrated")) return "일반전";
  if (key.includes("swiftplay")) return "스위프트";
  if (key.includes("spikerush")) return "스파이크 러쉬";
  if (key.includes("deathmatch")) return "데스매치";
  if (key.includes("teamdeathmatch")) return "팀 데스매치";
  if (key.includes("escalation")) return "에스컬레이션";
  if (key.includes("replication")) return "레플리케이션";
  if (key.includes("snowball")) return "스노우볼";
  if (key.includes("custom")) return "커스텀";

  // fallback: mode 원문이 있으면 원문(영문)이라도 표시
  return mode ?? "일반전";
}

function toAgent(player: HenrikMatchDto["players"]["all_players"][number]): ValorantAgent {
  const iconUrl =
    player.assets?.agent?.small ||
    player.assets?.agent?.killfeed ||
    player.assets?.agent?.bust ||
    player.assets?.agent?.full ||
    ""; // 비어있으면 UI에서 placeholder 처리 가능

  // id는 고유 uuid가 없으면 name 기반으로 안정화
  const id = `${player.character}`.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    name: player.character,
    iconUrl,
  };
}

function safeKda(stats?: { kills?: number; deaths?: number; assists?: number }) {
  return {
    kills: stats?.kills ?? 0,
    deaths: stats?.deaths ?? 0,
    assists: stats?.assists ?? 0,
  };
}

export function buildValorantRowVMFromHenrikMatch(params: {
  match: HenrikMatchDto;
  myPuuid: string;
}): ValorantMatchRowVM | null {
  const { match, myPuuid } = params;

  const me = match.players.all_players.find((p) => p.puuid === myPuuid);
  if (!me) return null;

  const myTeam = me.team; // "Red" | "Blue"

  const redWon = !!match.teams?.red?.has_won;
  const blueWon = !!match.teams?.blue?.has_won;

  // 보통 한쪽만 true인데, 방어적으로 DRAW 처리
  const isDraw = redWon === blueWon;

  const isWin =
    isDraw ? false : myTeam === "Red" ? redWon : blueWon;

  const result: ValorantMatchResult = isDraw ? "DRAW" : isWin ? "WIN" : "LOSS";

  const durationMs =
    match.metadata.game_length_in_ms ??
    match.metadata.game_length ??
    0;

  const durationText = formatDurationFromMs(durationMs);

  const queueTypeText = mapHenrikModeToKoreanText(match.metadata.mode, match.metadata.mode_id);

  const allyPlayers = match.players.all_players.filter((p) => p.team === myTeam);
  const enemyPlayers = match.players.all_players.filter((p) => p.team !== myTeam);

  const { kills, deaths, assists } = safeKda(me.stats);

  return {
    result,
    durationText,
    queueTypeText,
    myAgent: toAgent(me),
    allyAgents: allyPlayers.map(toAgent),
    enemyAgents: enemyPlayers.map(toAgent),
    kdaText: `${kills} / ${deaths} / ${assists}`,
  };
}

export function computeValorantOverviewFromRows(rows: ValorantMatchRowVM[]) {
  const matchCount = rows.length;

  const wins = rows.filter((r) => r.result === "WIN").length;
  const losses = rows.filter((r) => r.result === "LOSS").length;
  const draws = rows.filter((r) => r.result === "DRAW").length;

  const winRatePercent =
    matchCount === 0 ? 0 : (wins / matchCount) * 100;

  // KDA 텍스트에서 숫자 파싱(정확도는 충분: "K / D / A" 고정 포맷)
  let sumK = 0;
  let sumD = 0;
  let sumA = 0;

  for (const r of rows) {
    const parts = r.kdaText.split("/").map((x) => Number(x.trim()));
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
      sumK += parts[0];
      sumD += parts[1];
      sumA += parts[2];
    }
  }

  const denom = Math.max(1, matchCount);
  const avgKills = sumK / denom;
  const avgDeaths = sumD / denom;
  const avgAssists = sumA / denom;

  return {
    matchCount,
    wins,
    losses,
    draws,
    winRatePercent,
    avgKills,
    avgDeaths,
    avgAssists,
  };
}
