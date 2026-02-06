import type { HighlightPost, CommunityPost, CommunityComment, User } from '@/features/community/types/types';
import { api } from '@/services/api';

const normalizeUser = (user: any): User | undefined => {
  if (!user) return undefined;
  return {
    id: user.id ?? user.user_id ?? 0,
    nickname: user.nickname ?? user.name ?? "",
    profileImage: user.profileImage ?? user.profile_image ?? undefined,
  };
};

const normalizeComment = (item: any): CommunityComment => {
  return {
    id: item.id ?? item.comment_id ?? 0,
    userId: item.userId ?? item.user_id ?? 0,
    highlightId: item.highlightId ?? item.highlight_id ?? undefined,
    postId: item.postId ?? item.post_id ?? undefined,
    parentId: item.parentId ?? item.parent_id ?? undefined,
    content: item.content ?? "",
    isPublic: item.isPublic ?? item.is_public ?? true,
    createdAt: item.createdAt ?? item.created_at ?? "",
    updatedAt: item.updatedAt ?? item.updated_at ?? "",
    user: normalizeUser(item.user) as User,
    highlight: item.highlight,
    post: item.post,
    parent: item.parent,
    replies: Array.isArray(item.replies)
      ? item.replies.map((reply: any) => normalizeComment(reply))
      : [],
  };
};

const buildCommentTree = (items: CommunityComment[]) => {
  const byId = new Map<number, CommunityComment>();
  const roots: CommunityComment[] = [];

  items.forEach((comment) => {
    byId.set(comment.id, { ...comment, replies: comment.replies ?? [] });
  });

  byId.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      const parent = byId.get(comment.parentId)!;
      parent.replies = [...(parent.replies ?? []), comment];
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

// 댓글 목록 조회
export async function getComments({ highlightId, postId, parentId, page = 1, limit = 20 }: { highlightId?: number; postId?: number; parentId?: number; page?: number; limit?: number }) {
  const params: any = { page, limit };
  if (highlightId) {
    params.target_type = 'HIGHLIGHT';
    params.target_id = highlightId;
  }
  if (postId) {
    params.target_type = 'POST';
    params.target_id = postId;
  }
  if (parentId) params.parent_id = parentId;
  const res = await api.get('/community/comments', { params });
  const raw = res.data.data?.comments ?? res.data.data ?? [];
  if (!Array.isArray(raw)) return [];
  const normalized = raw.map((item: any) => normalizeComment(item));
  return buildCommentTree(normalized);
}

// 댓글 작성
export async function addComment({ highlightId, postId, content, parentId }: { highlightId?: number; postId?: number; content: string; parentId?: number }) {
  // 새로운 API 스펙에 맞게 요청 바디 구성
  let target_type = '';
  let target_id = 0;
  if (highlightId) {
    target_type = 'HIGHLIGHT';
    target_id = highlightId;
  } else if (postId) {
    target_type = 'POST';
    target_id = postId;
  }
  const payload: any = {
    target_type,
    target_id,
    content,
  };
  if (typeof parentId === 'number' && Number.isFinite(parentId)) {
    payload.parent_id = parentId;
  }
  const res = await api.post('/community/comments', payload);
  const raw = res.data.data?.comment ?? res.data.data;
  return raw ? normalizeComment(raw) : undefined;
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
export async function getHighlights(page: number = 1, limit: number = 10): Promise<HighlightPost[]> {
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
