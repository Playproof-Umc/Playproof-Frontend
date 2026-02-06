import type { Highlight, CommunityPost } from '@/features/community/types/types';
import { api } from '@/services/api';

// 댓글 목록 조회
export async function getComments({ highlightId, postId, parentId, page = 1, limit = 20 }: { highlightId?: number; postId?: number; parentId?: number; page?: number; limit?: number }) {
  // highlightId 또는 postId로 필터링
  const params: any = { page, limit };
  if (highlightId) params.highlight_id = highlightId;
  if (postId) params.post_id = postId;
  if (parentId) params.parent_id = parentId;
  const res = await api.get('/community/comments', { params });
  return res.data.data?.comments || [];
}

// 댓글 작성
export async function addComment({ highlightId, postId, content, parentId }: { highlightId?: number; postId?: number; content: string; parentId?: number }) {
  const payload: any = { content };
  if (highlightId) payload.highlight_id = highlightId;
  if (postId) payload.post_id = postId;
  if (parentId) payload.parent_id = parentId;
  const res = await api.post('/community/comments', payload);
  return res.data.data;
}

// 댓글 수정
export async function editComment({ commentId, content }: { commentId: number; content: string }) {
  const res = await api.patch(`/community/comments/${commentId}`, { content });
  return res.data.data;
}

// 댓글 삭제
export async function deleteComment(commentId: number) {
  const res = await api.delete(`/community/comments/${commentId}`);
  return res.data.data;
}

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

// 하이라이트 상세 조회 (단일)
export async function getHighlightDetail(highlightId: number) {
  const res = await api.get(`/community/highlights/${highlightId}`);
  const item = res.data.data;
  // camelCase로 변환 및 기본 이미지 처리
  return {
    id: item.highlight_id,
    userId: item.user_id,
    nickname: item.nickname,
    profileUrl: item.profileUrl || '/no-image.png',
    content: item.content,
    medias: (item.medias && item.medias.length > 0)
      ? item.medias.map((m: string) => m.startsWith('http') ? m : `${import.meta.env.VITE_API_BASE_URL}/uploads/${m}`)
      : ['/no-image.png'],
    commentCount: item.comment_count,
    likeCount: item.like_count,
    isLiked: item.is_liked,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
