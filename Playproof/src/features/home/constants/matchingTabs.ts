// src/features/home/constants/matchingTabs.ts

import { GAME_LIST } from "@/features/matching/constants/matchingConfig";

export const GAME_TABS = GAME_LIST;

export const MATCHING_TAB_LABELS = {
  title: "일반 매칭",
  history: "더보기 →",
  placeholder: "챔피언",
  reset: "초기화",
  search: "검색하기",
} as const;
