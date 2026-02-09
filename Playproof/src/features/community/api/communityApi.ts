import type { HighlightPost, CommunityComment, User, BoardPost } from '@/features/community/types/types';
import { api } from '@/services/api';

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null;

const readValue = (record: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const toStringValue = (value: unknown) => (typeof value === "string" ? value : undefined);

const normalizeUser = (user: unknown): User | undefined => {
  if (!isRecord(user)) return undefined;
  return {
    id: toNumber(readValue(user, ["id", "user_id", "userId"])) ?? 0,
    nickname: toStringValue(readValue(user, ["nickname", "name"])) ?? "",
    profileImage: toStringValue(readValue(user, ["profileImage", "profile_image"])),
  };
};

const normalizeComment = (raw: unknown): CommunityComment => {
  const item = isRecord(raw) ? raw : {};
  const fallbackUser: User = { id: 0, nickname: "", profileImage: undefined };
  const user =
    normalizeUser(readValue(item, ["user"])) ??
    (toStringValue(readValue(item, ["nickname"]))
      ? {
          id: toNumber(readValue(item, ["user_id", "userId"])) ?? 0,
          nickname: toStringValue(readValue(item, ["nickname"])) ?? "",
          profileImage: toStringValue(readValue(item, ["profile_image", "profileImage"])),
        }
      : fallbackUser);

  return {
    id: toNumber(readValue(item, ["id", "comment_id"])) ?? 0,
    userId: toNumber(readValue(item, ["userId", "user_id"])) ?? 0,
    highlightId: toNumber(readValue(item, ["highlightId", "highlight_id"])),
    postId: toNumber(readValue(item, ["postId", "post_id"])),
    parentId: toNumber(readValue(item, ["parentId", "parent_id"])),
    content: toStringValue(readValue(item, ["content"])) ?? "",
    isPublic: (readValue(item, ["isPublic", "is_public"]) as boolean | undefined) ?? true,
    createdAt: toStringValue(readValue(item, ["createdAt", "created_at"])) ?? "",
    updatedAt: toStringValue(readValue(item, ["updatedAt", "updated_at"])) ?? "",
    user: user ?? fallbackUser,
    highlight: readValue(item, ["highlight"]),
    post: readValue(item, ["post"]),
    parent: readValue(item, ["parent"]),
    replies: Array.isArray(readValue(item, ["replies"]))
      ? (readValue(item, ["replies"]) as unknown[]).map((reply) => normalizeComment(reply))
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

const mapBoardPost = (raw: unknown): BoardPost => {
  const item = isRecord(raw) ? raw : {};
  const gameId = toNumber(readValue(item, ["game_id", "gameId"]));
  const medias = Array.isArray(readValue(item, ["medias"])) ? (readValue(item, ["medias"]) as ApiRecord[]) : [];
  const firstMedia = medias[0];

  return {
    id: toNumber(readValue(item, ["post_id", "id"])) ?? 0,
    userId: toNumber(readValue(item, ["user_id", "userId"])),
    gameId,
    author: toStringValue(readValue(item, ["nickname", "author"])) ?? "",
    date: toStringValue(readValue(item, ["created_at"])) ?? "",
    createdAt: toStringValue(readValue(item, ["created_at"])) ?? "",
    game: BOARD_GAME_NAME_MAP[gameId ?? 0] ?? toStringValue(readValue(item, ["game_name", "game"])) ?? "",
    title: toStringValue(readValue(item, ["title"])) ?? "",
    content: toStringValue(readValue(item, ["content"])) ?? "",
    likes: toNumber(readValue(item, ["like_count"])) ?? 0,
    isLiked: (readValue(item, ["is_liked", "isLiked"]) as boolean | undefined) ?? false,
    views: toNumber(readValue(item, ["view_count"])) ?? 0,
    comments: toNumber(readValue(item, ["comment_count"])) ?? 0,
    mediaType: medias.length > 0 ? "photo" : undefined,
    thumbnail: isRecord(firstMedia) ? toStringValue(readValue(firstMedia, ["media_url"])) ?? toStringValue(readValue(item, ["thumbnail"])) : toStringValue(readValue(item, ["thumbnail"])),
  };
};

// 댓글 목록 조회
export async function getComments({ highlightId, postId, parentId, page = 1, limit = 20 }: { highlightId?: number; postId?: number; parentId?: number; page?: number; limit?: number }) {
  const params: Record<string, unknown> = { page, limit };
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
  const normalized = raw.map((item) => normalizeComment(item));
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
  const payload: Record<string, unknown> = {
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
  return posts.map((item) => mapBoardPost(item));
}

/**
 * 게시판 전체 글 목록 조회
 */
export async function getAllBoardPosts(page: number = 1, limit: number = 10): Promise<BoardPost[]> {
  const res = await api.get("/community/posts", { params: { page, limit } });
  const data = res.data.data;
  const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
  return posts.map((item) => mapBoardPost(item));
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
  return (Array.isArray(highlights) ? highlights : []).map((raw) => {
    const item = isRecord(raw) ? raw : {};
    return {
      id: toNumber(readValue(item, ["highlight_id", "id"])) ?? 0,
      userId: toNumber(readValue(item, ["user_id", "userId"])),
      nickname: toStringValue(readValue(item, ["nickname"])),
      profileUrl: toStringValue(readValue(item, ["profileUrl"])),
      content: toStringValue(readValue(item, ["content"])) ?? "",
      medias: Array.isArray(readValue(item, ["medias"])) ? (readValue(item, ["medias"]) as string[]) : [],
      commentCount: toNumber(readValue(item, ["comment_count"])),
      likeCount: toNumber(readValue(item, ["like_count"])),
      isLiked: (readValue(item, ["is_liked"]) as boolean | undefined) ?? false,
      createdAt: toStringValue(readValue(item, ["created_at"])),
      updatedAt: toStringValue(readValue(item, ["updated_at"])),
    } as HighlightPost;
  });
}

/**
 * 베스트 게시글 조회 (실제 API 연동)
 */
export async function getBestPosts(limit: number = 5): Promise<BoardPost[]> {
  try {
    const res = await api.get('/community/posts/best', { params: { limit } });
    const data = res.data.data;
    const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
    return posts.map((item) => mapBoardPost(item));
  } catch {
    return [];
  }
}

// 하이라이트 상세 조회 (단일)
export async function getHighlightDetail(highlightId: number) {
  const res = await api.get(`/community/highlights/${highlightId}`);
  const item = isRecord(res.data.data) ? res.data.data : {};
  // camelCase로 변환 및 기본 이미지 처리
  return {
    id: toNumber(readValue(item, ["highlight_id", "id"])) ?? highlightId,
    userId: toNumber(readValue(item, ["user_id", "userId"])),
    nickname: toStringValue(readValue(item, ["nickname"])),
    profileUrl: toStringValue(readValue(item, ["profileUrl"])) ?? '/no-image.png',
    content: toStringValue(readValue(item, ["content"])) ?? "",
    medias: (Array.isArray(readValue(item, ["medias"])) && (readValue(item, ["medias"]) as string[]).length > 0)
      ? (readValue(item, ["medias"]) as string[]).map((m) => m.startsWith('http') ? m : `${import.meta.env.VITE_API_BASE_URL}/uploads/${m}`)
      : ['/no-image.png'],
    commentCount: toNumber(readValue(item, ["comment_count"])),
    likeCount: toNumber(readValue(item, ["like_count"])),
    isLiked: (readValue(item, ["is_liked"]) as boolean | undefined) ?? false,
    createdAt: toStringValue(readValue(item, ["created_at"])),
    updatedAt: toStringValue(readValue(item, ["updated_at"])),
  };
}
