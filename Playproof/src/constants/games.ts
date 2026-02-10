// src/constants/games.ts

/**
 * 게임 ID와 게임 이름 매핑
 */
export const GAME_MAP: Record<number, string> = {
  1: '리그오브레전드',
  2: '발로란트',
  3: '오버워치',
  4: 'Steam',
  5: '로스트아크',
  6: '메이플스토리',
  7: '배틀그라운드',
} as const;

/**
 * 게임 ID로 게임 이름 조회
 */
export function getGameName(gameId: number): string {
  return GAME_MAP[gameId] || '알 수 없는 게임';
}

/**
 * 게임 이름으로 게임 ID 조회
 */
export function getGameId(gameName: string): number | undefined {
  const entry = Object.entries(GAME_MAP).find(([_, name]) => name === gameName);
  return entry ? Number(entry[0]) : undefined;
}

/**
 * 모든 게임 목록
 */
export const GAMES = Object.entries(GAME_MAP).map(([id, name]) => ({
  id: Number(id),
  name,
}));
