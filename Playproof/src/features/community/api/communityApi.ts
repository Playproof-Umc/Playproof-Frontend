import type { HighlightPost, CommunityComment, User, BoardPost } from '@/features/community/types/types';
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
  const user = normalizeUser(item.user) ?? (item.nickname ? {
    id: item.user_id ?? item.userId ?? 0,
    nickname: item.nickname ?? "",
    profileImage: item.profile_image ?? item.profileImage ?? undefined,
  } : undefined);

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
    user: user as User,
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

const BOARD_GAME_NAME_MAP: Record<number, string> = {
  1: "리그오브레전드",
  2: "발로란트",
  3: "오버워치",
};

const mapBoardPost = (item: any): BoardPost => ({
  id: item.post_id ?? item.id,
  userId: item.user_id ?? item.userId,
  gameId: item.game_id ?? item.gameId,
  author: item.nickname ?? item.author ?? "",
  date: item.created_at ?? "",
  createdAt: item.created_at ?? "",
  game: BOARD_GAME_NAME_MAP[item.game_id ?? item.gameId] ?? item.game_name ?? item.game ?? "",
  title: item.title ?? "",
  content: item.content ?? "",
  likes: item.like_count ?? 0,
  isLiked: item.is_liked ?? item.isLiked ?? false,
  views: item.view_count ?? 0,
  comments: item.comment_count ?? 0,
  mediaType: (item.medias ?? []).length > 0 ? "photo" : undefined,
  thumbnail: item.medias?.[0]?.media_url ?? item.thumbnail ?? undefined,
});

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

// 좋아요 토글
export async function toggleLike({ highlightId, postId }: { highlightId?: number; postId?: number }) {
  let target_type = "";
  let target_id = 0;
  if (highlightId) {
    target_type = "HIGHLIGHT";
    target_id = highlightId;
  } else if (postId) {
    target_type = "POST";
    target_id = postId;
  }
  const res = await api.post("/community/likes", { target_type, target_id });
  return res.data.data;
}

/**
 * 게시판 글 목록 조회 (실제 API 연동)
 */
export async function getBoardPosts(gameId: number, page: number = 1, limit: number = 10): Promise<BoardPost[]> {
  const res = await api.get(`/community/games/${gameId}/posts`, { params: { page, limit } });
  const data = res.data.data;
  const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
  return posts.map((item: any) => mapBoardPost(item));
}

/**
 * 게시판 전체 글 목록 조회
 */
export async function getAllBoardPosts(page: number = 1, limit: number = 10): Promise<BoardPost[]> {
  const res = await api.get("/community/posts", { params: { page, limit } });
  const data = res.data.data;
  const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
  return posts.map((item: any) => mapBoardPost(item));
}

// 자유게시판 글 작성
export async function createBoardPost(payload: {
  game_id: number;
  title: string;
  content: string;
  medias?: { media_url: string; order: number }[];
  files?: File[];
}) {
  if (payload.files && payload.files.length > 0) {
    const formData = new FormData();
    formData.append("game_id", String(payload.game_id));
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    payload.files.forEach((file, index) => {
      formData.append("medias", file);
      formData.append("orders", String(index + 1));
    });

    const res = await api.post('/community/posts', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  }

  const res = await api.post('/community/posts', {
    game_id: payload.game_id,
    title: payload.title,
    content: payload.content,
    medias: payload.medias ?? [],
  });
  return res.data.data;
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
export async function getBestPosts(limit: number = 5): Promise<BoardPost[]> {
  try {
    const res = await api.get('/community/posts/best', { params: { limit } });
    const data = res.data.data;
    const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
    return posts.map((item: any) => mapBoardPost(item));
  } catch {
    return [];
  }
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
