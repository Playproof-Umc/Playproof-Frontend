// src/features/community/api/communityApi.ts

import type { BoardPost, HighlightPost } from '@/features/community/types';
import { MOCK_BOARD_POSTS, MOCK_HIGHLIGHT_POSTS } from '@/features/community/data/mockCommunityData';

/**
 * 게시판 글 목록 조회
 * TODO: 실제 API 연동 시 fetch 로직으로 교체
 */
export async function getBoardPosts(page: number = 1, limit: number = 10): Promise<BoardPost[]> {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const start = (page - 1) * limit;
  const end = start + limit;
  return MOCK_BOARD_POSTS.slice(start, end);
}

/**
 * 하이라이트 목록 조회
 * TODO: 실제 API 연동 시 fetch 로직으로 교체
 */
export async function getHighlights(page: number = 1, limit: number = 10): Promise<HighlightPost[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const start = (page - 1) * limit;
  const end = start + limit;
  return MOCK_HIGHLIGHT_POSTS.slice(start, end);
}

/**
 * 베스트 게시글 조회
 */
export async function getBestPosts(limit: number = 5): Promise<BoardPost[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...MOCK_BOARD_POSTS]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}
