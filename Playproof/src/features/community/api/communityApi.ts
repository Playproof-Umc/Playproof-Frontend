
import type { Highlight, CommunityPost } from '@/features/community/types/types';
import { api } from '@/services/api';

/**
 * 게시판 글 목록 조회 (실제 API 연동)
 */
export async function getBoardPosts(gameId: number, page: number = 1, limit: number = 10): Promise<CommunityPost[]> {
  const res = await api.get(`/community/games/${gameId}/posts`, { params: { page, limit } });
  const data = res.data.data;
  if (Array.isArray(data)) {
    return data as CommunityPost[];
  }
  return [];
}

/**
 * 하이라이트 목록 조회 (실제 API 연동)
 */
export async function getHighlights(page: number = 1, limit: number = 10): Promise<Highlight[]> {
  const res = await api.get('/community/highlights', { params: { page, limit } });
  const highlights = res.data.data?.highlights || [];
  // API 응답을 HighlightPost[]로 매핑
  return highlights.map((item: any) => ({
    id: item.highlight_id,
    userId: item.user_id,
    nickname: item.nickname,
    profileUrl: item.profileUrl,
    content: item.content,
    medias: item.medias,
    commentCount: item.comment_count,
    likeCount: item.like_count,
    isLiked: item.is_liked,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

/**
 * 베스트 게시글 조회 (실제 API 연동)
 */
export async function getBestPosts(limit: number = 5): Promise<CommunityPost[]> {
  const res = await api.get('/community/posts/best', { params: { limit } });
  const data = res.data.data;
  if (Array.isArray(data)) {
    return data as CommunityPost[];
  }
  return [];
}
