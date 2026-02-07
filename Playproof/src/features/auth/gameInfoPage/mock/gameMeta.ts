// src/features/auth/gameInfoPage/mock/gameMeta.ts

import type { GameId } from "@/features/auth/gameInfoPage/types"

export const AUTH_STYLE_GAMES: GameId[] = ["lol", "valo", "ow"];

export const GAME_LABEL: Record<GameId, string> = {
  lol: "리그 오브 레전드",
  valo: "발로란트",
  ow: "오버워치",
  steam: "스팀 게임",
  pubg: "배틀그라운드",
  lostark: "로스트아크",
  korea: "국내 게임",
  other: "기타",
};

// 첫 번째 사진의 “플레이 스타일”은 드롭다운
export const PLAY_STYLE_OPTIONS = ["실력 중심", "매너 중심"];

export function getTierOptionsByGame(gameId: GameId): string[] {
  switch (gameId) {
    case "lol":
      return ["아이언", "브론즈", "실버", "골드", "플래티넘", "에메랄드", "다이아", "마스터", "그랜드마스터", "챌린저"];
    case "valo":
      return ["아이언", "브론즈", "실버", "골드", "플래티넘", "다이아", "초월자", "레디언트"];
    case "ow":
      return ["브론즈", "실버", "골드", "플래티넘", "다이아", "마스터", "그랜드마스터", "챔피언"];
    default:
      // 레이아웃 B에서는 티어/포지션을 안 받지만, 혹시 확장 대비
      return ["초보", "중수", "고수"];
  }
}

export function getPositionOptionsByGame(gameId: GameId): string[] {
  switch (gameId) {
    case "lol":
      return ["탑", "정글", "미드", "원딜", "서폿"];
    case "valo":
      return ["듀얼리스트", "타격대", "감시자", "전략가"];
    case "ow":
      return ["탱커", "딜러", "서포터"];
    default:
      return ["공격", "수비", "서포트", "올라운더"];
  }
}