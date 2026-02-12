export type GameKey = "lol" | "valorant" | "pubg" | "overwatch" | "steam";

export type LinkedAccountMeta = {
  riot?: {
    gameName: string;
    tagLine: string;
    riotId: string;
  };
  overwatch?: {
    battleTag: string;
    player_id?: string;
    name?: string;
  };
};

export type LinkedAccount = {
  game: GameKey;
  title: string;
  subtitle?: string;
  badge?: string;
  accounts: Array<{
    label: string;
    value: string;
  }>;
  meta?: LinkedAccountMeta;
};

export type SiteUserProfile = {
  displayName: string;
  rankLabel: string;
  intro: string;
  noteLabel: string;
  noteValue: string;
};

export type LolLinkedProfile = {
  summonerName: string;
  tagLine?: string;
  riotId?: string;
  serverLabel: string;
  profileIconId?: number;
  summonerLevel?: number;
  currentTier: string;
  mainPosition: string;
  winRatePercent: number;
};

export type LolAggregateStats = {
  wins: number;
  losses: number;
  winRatePercent: number;
  avgKdaRatio: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  mostChampions: Array<{
    name: string;
    games: number;
  }>;
};

export type MatchResult = "win" | "lose";

// ✅ [수정] MatchRow에서 사용할 데이터 필드 정의 (원본 MatchDto가 아님!)
export type LolMatchItem = {
  id: string;
  result: MatchResult;
  queueLabel: string;
  durationText: string;
  kdaText: string;
  kdaRatioText: string;
  pills: string[];
  itemsCount: number;

  // ✨ 디자인 복구를 위해 추가된 필드
  myChampionName: string;
  teamChampions: string[];     // 우리팀 챔피언 목록
  opponentChampions: string[]; // 적팀 챔피언 목록
};

export type PaginationState = {
  page: number;
  pageSize: number;
  totalPages: number;
};

export type DashboardTabKey = "matches" | "tier";

export type GameDataDashboardData = {
  userProfile: SiteUserProfile;
  linkedAccounts: LinkedAccount[];
  lol: {
    linkedProfile: LolLinkedProfile;
    aggregate: LolAggregateStats;
    matches: LolMatchItem[];
    pagination: PaginationState;
  };
};
