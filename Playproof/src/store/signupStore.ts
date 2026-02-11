// src/store/signupStore.ts

import { create } from "zustand";

// 회원가입 3단계 데이터 타입
type SignupBasicInfo = {
  phone: string;
  password: string;
  nickname: string;
  terms: Array<{
    id: number;
    agree: boolean;
  }>;
};

type GameInfo = {
  gameId: number;
  gameName: string;
  gameNickname: string;
  accountId: string;
  playStyle: string;
  positionId: number;
  tierId: number;
};

type SignupState = {
  // Step 1: 기본 정보
  basicInfo: SignupBasicInfo | null;
  
  // Step 2: 게임 선택 + 계정 연동
  selectedGameId: number | null;
  accountId: string; // Riot 계정 검증 시 puuid 저장
  
  // Step 3: 게임 정보
  gameInfo: GameInfo | null;
  
  // Actions
  setBasicInfo: (info: SignupBasicInfo) => void;
  setSelectedGame: (gameId: number, accountId?: string) => void;
  setGameInfo: (info: GameInfo) => void;
  clearSignupData: () => void;
  
  // 최종 데이터 조합
  getFinalSignupData: () => {
    nickname: string;
    password: string;
    phone: string;
    terms: Array<{ id: number; agree: boolean }>;
    gameInfo: GameInfo;
  } | null;
};

export const useSignupStore = create<SignupState>((set, get) => ({
  basicInfo: null,
  selectedGameId: null,
  accountId: "", // 기본값은 빈 문자열 (수동 회원가입)
  gameInfo: null,

  setBasicInfo: (info) => set({ basicInfo: info }),
  
  setSelectedGame: (gameId, accountId = "") => set({ 
    selectedGameId: gameId,
    accountId: accountId // 계정 검증 성공 시 puuid, 수동이면 ""
  }),
  
  setGameInfo: (info) => set({ gameInfo: info }),
  
  clearSignupData: () => set({
    basicInfo: null,
    selectedGameId: null,
    accountId: "",
    gameInfo: null,
  }),
  
  getFinalSignupData: () => {
    const { basicInfo, gameInfo } = get();
    
    if (!basicInfo || !gameInfo) {
      return null;
    }
    
    return {
      nickname: basicInfo.nickname,
      password: basicInfo.password,
      phone: basicInfo.phone,
      terms: basicInfo.terms,
      gameInfo: gameInfo,
    };
  },
}));
