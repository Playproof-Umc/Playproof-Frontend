// src/features/auth/gameSelectPage/types.ts

export type AuthKind = "riot" | "steam" | "battlenet";

export type GameOption = {
  id: string;
  name: string;

  /**
   * Step 2: 계정 연동(인증) 버튼 노출/스타일을 결정하는 키
   * - riot      -> 빨간 버튼 + "라이엇 계정으로 인증하기"
   * - steam     -> 파란 버튼 + "Steam 계정으로 인증하기"
   * - battlenet -> 초록 버튼 + "Battle.net 계정으로 인증하기"
   * - undefined -> 인증 버튼 X, 직접 입력만 O
   */
  authKind?: AuthKind;
};