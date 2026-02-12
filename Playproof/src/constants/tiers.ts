// src/constants/tiers.ts

/**
 * 게임별 티어 ID 매핑
 */
export const TIER_MAP: Record<number, Record<string, number>> = {
  1: { // 리그오브레전드
    '아이언': 101,
    '브론즈': 102,
    '실버': 103,
    '골드': 104,
    '플래티넘': 105,
    '에메랄드': 106,
    '다이아몬드': 107,
    '마스터': 108,
    '그랜드마스터': 109,
    '챌린저': 110,
  },
  2: { // 발로란트
    '아이언': 201,
    '브론즈': 202,
    '실버': 203,
    '골드': 204,
    '플래티넘': 205,
    '다이아몬드': 206,
    '초월자': 207,
    '불멸': 208,
    '레디언트': 209,
  },
  3: { // 오버워치
    '브론즈': 301,
    '실버': 302,
    '골드': 303,
    '플래티넘': 304,
    '다이아몬드': 305,
    '마스터': 306,
    '그랜드마스터': 307,
    '상위500위': 308,
  },
  7: { // 배틀그라운드
    '브론즈': 701,
    '실버': 702,
    '골드': 703,
    '플래티넘': 704,
    '크리스탈': 705,
    '다이아몬드': 706,
    '마스터': 707,
    '서바이버': 708,
  },
} as const;

/**
 * 게임 ID와 티어 이름으로 티어 ID 조회
 */
export function getTierId(gameId: number, tierName: string): number {
  const gameTiers = TIER_MAP[gameId];
  if (!gameTiers) {
    console.warn(`게임 ID ${gameId}에 대한 티어 매핑이 없습니다.`);
    return 101; // 기본값: 리그오브레전드 아이언
  }
  
  const tierId = gameTiers[tierName];
  if (!tierId) {
    console.warn(`게임 ID ${gameId}에 티어 "${tierName}"이 없습니다.`);
    return Object.values(gameTiers)[0]; // 해당 게임의 첫 번째 티어
  }
  
  return tierId;
}

/**
 * 티어 ID로 티어 이름 조회
 */
export function getTierName(tierId: number): string {
  for (const [_gameId, tiers] of Object.entries(TIER_MAP)) {
    const entry = Object.entries(tiers).find(([_, id]) => id === tierId);
    if (entry) return entry[0];
  }
  return '알 수 없는 티어';
}
