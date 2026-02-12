// src/constants/positions.ts

/**
 * 게임별 포지션 ID 매핑
 */
export const POSITION_MAP: Record<number, Record<string, number>> = {
  1: { // 리그오브레전드
    '탑': 101,
    '미드': 102,
    '정글': 103,
    '원딜': 104,
    '서폿': 105,
  },
  2: { // 발로란트
    '타격대': 201,
    '척후대': 202,
    '전략가': 203,
    '감시자': 204,
  },
  3: { // 오버워치
    '탱커': 301,
    '딜러': 302,
    '힐러': 303,
  },  7: { // 배틀그라운드
    '뉴비': 701,
    '일반': 702,
    '고인물': 703,
  },} as const;

/**
 * 게임 ID와 포지션 이름으로 포지션 ID 조회
 */
export function getPositionId(gameId: number, positionName: string): number | undefined {
  const gamePositions = POSITION_MAP[gameId];
  if (!gamePositions) {
    console.warn(`게임 ID ${gameId}에 대한 포지션 매핑이 없습니다.`);
    return undefined;
  }
  
  const positionId = gamePositions[positionName];
  if (!positionId) {
    console.warn(`게임 ID ${gameId}에 포지션 "${positionName}"이 없습니다.`);
  }
  
  return positionId;
}

/**
 * 게임 ID와 포지션 이름 배열로 포지션 ID 배열 조회
 */
export function getPositionIds(gameId: number, positionNames: string[]): number[] {
  return positionNames
    .map(name => getPositionId(gameId, name))
    .filter((id): id is number => id !== undefined);
}

/**
 * 포지션 ID로 포지션 이름 조회
 */
export function getPositionName(positionId: number): string {
  for (const [_gameId, positions] of Object.entries(POSITION_MAP)) {
    const entry = Object.entries(positions).find(([_, id]) => id === positionId);
    if (entry) return entry[0];
  }
  return '알 수 없는 포지션';
}
