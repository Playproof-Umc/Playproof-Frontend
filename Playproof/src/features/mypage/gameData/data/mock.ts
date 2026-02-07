// src/features/mypage/gameData/data/mock.ts

import type { GameDataDashboardData } from "@/features/mypage/gameData/types/gameDataTypes";

export const MOCK_GAME_DATA_DASHBOARD: GameDataDashboardData = {
  userProfile: {
    displayName: "레나",
    rankLabel: "Rank #1",
    intro: "왜 잔액이 마이너스일까요?",
    noteLabel: "문의/요청",
    noteValue: "레벨 89",
  },
  linkedAccounts: [
    {
      game: "steam",
      title: "Steam",
      subtitle: "연동됨",
      accounts: [
        { label: "최근 플레이", value: "Pico Park" },
        { label: "최근 플레이", value: "Dead by Daylight" },
      ],
    },
    {
      game: "lol",
      title: "리그오브레전드",
      subtitle: "연동됨",
      meta: {
        riot: {
          gameName: "비둘기깃털",
          tagLine: "KR1",
          riotId: "비둘기깃털#KR1",
        },
      },
      accounts: [
        { label: "티어", value: "-" },
        { label: "주 포지션", value: "-" },
        { label: "승률", value: "-" },
      ],
    },

    // ✅ 추가: Valorant (HenrikDev)
    {
      game: "valorant",
      title: "발로란트",
      subtitle: "연동됨",
      meta: {
        riot: {
          gameName: "REMEMBERHYUN",
          tagLine: "LOVEU",
          riotId: "REMEMBERHYUN#LOVEU",
        },
      },
      accounts: [
        { label: "티어", value: "-" },
        { label: "평균 K/D", value: "-" },
      ],
    },

    // ✅ 추가: Overwatch (OverFast)
    {
      game: "overwatch",
      title: "오버워치",
      subtitle: "연동됨",
      meta: {
        overwatch: {
          // Swagger에서 확인된 player_id 형식 그대로
          // (# 대신 -)도 허용하도록 프록시를 아래에서 보강할 거임
          battleTag: "limuzene#3992",
        },
      },
      accounts: [
        { label: "상태", value: "-" },
        { label: "Endorsement", value: "-" },
        { label: "player_id", value: "-" },
      ],
    },
  ],
  lol: {
    linkedProfile: {
      summonerName: "Faker",
      serverLabel: "Kr server",
      currentTier: "Challenger I",
      mainPosition: "원딜",
      winRatePercent: 66,
    },
    aggregate: {
      wins: 340,
      losses: 280,
      winRatePercent: 55,
      avgKdaRatio: 3.23,
      avgKills: 3.5,
      avgDeaths: 4.1,
      avgAssists: 6.2,
      mostChampions: [
        { name: "아리", games: 12 },
        { name: "아지르", games: 9 },
        { name: "오리아나", games: 8 },
      ],
    },
    matches: Array.from({ length: 4 }).map((_, idx) => ({
      id: `match-${idx + 1}`,
      result: "win" as const,
      queueLabel: "솔랭",
      durationText: "38분 40초",
      kdaText: "8/2/12",
      kdaRatioText: "10.00:1 KDA",
      pills: ["피해량", "시야점수", "CS", "골드"],
      itemsCount: 7,
    })),
    pagination: {
      page: 1,
      pageSize: 10,
      totalPages: 12,
    },
  },
};