// src/features/mypage/gameData/types/gameDataTypes.ts

export type GameKey = "lol" | "valorant" | "pubg" | "overwatch" | "steam";

export type LinkedAccountMeta = {
  riot?: {
    gameName: string;
    tagLine: string;
    riotId: string;
  };

  // ✅ 추가
  overwatch?: {
    /**
     * OverFast에서 player 검색/summary에 쓰는 식별자
     * - BattleTag 형식: Name#1234
     * - player_id 형식: Name-1234
     * 둘 다 들어올 수 있으니 string으로 수용
     */
    battleTag: string;
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

export type ChampionIcon = {
  name: string;
  iconUrl: string;
};

export type LolMatchItem = {
  id: string;
  result: MatchResult;
  queueLabel: string;
  durationText: string;
  kdaText: string;
  kdaRatioText: string;
  pills: string[];
  itemsCount: number;

  /** ✅ MatchRow에서 사용하는 추가 필드(없어도 UI 깨지지 않게 optional) */
  myChampion?: ChampionIcon;
  allies?: ChampionIcon[]; // 5
  enemies?: ChampionIcon[]; // 5
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
