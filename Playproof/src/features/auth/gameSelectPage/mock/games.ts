// src/features/auth/gameSelectPage/mock/games.ts

import type { GameOption } from "@/features/auth/gameSelectPage/types";

/**
 * 요구사항 반영:
 * - 리그/발로란트: 라이엇(빨강)
 * - 스팀 게임: Steam(파랑)
 * - 오버워치: Battle.net(초록)
 * - 기타 & 로스트아크 & (일반) 배틀그라운드: 인증 버튼 X, 직접 입력 O
 */
export const GAME_OPTIONS: GameOption[] = [
  { id: "lol", name: "리그오브레전드", authKind: "riot" },
  { id: "valo", name: "발로란트", authKind: "riot" },
  { id: "ow", name: "오버워치", authKind: "battlenet" },
  { id: "steam", name: "스팀 게임", authKind: "steam" },

  // ✅ 요구사항: 배틀그라운드/로스트아크는 인증 버튼 X
  { id: "pubg", name: "배틀그라운드" },
  { id: "lostark", name: "로스트아크" },

  // (국내 게임도 요구사항에 없으니 인증 X로 둠)
  { id: "korea", name: "국내 게임" },

  { id: "other", name: "기타" },
];