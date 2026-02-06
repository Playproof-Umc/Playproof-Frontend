// Prisma 모델 기반 커뮤니티 타입 정의

// User, Game, Azit 등은 실제 프로젝트 타입에 맞게 import 또는 정의 필요
export interface User {
  id: number;
  nickname: string;
  profileImage?: string;
}

export interface Game {
  id: number;
  name: string;
}

export interface Azit {
  id: number;
  name: string;
}

export interface CommunityMedia {
  id: number;
  highlightId?: number;
  postId?: number;
  mediaUrl: string;
  order: number;
  uploadAt: string; // ISO date string
}

export interface CommunityLike {
  id: number;
  userId: number;
  highlightId?: number;
  postId?: number;
  likedAt: string; // ISO date string
  user: User;
  highlight?: Highlight;
  post?: CommunityPost;
}

export interface CommunityComment {
  id: number;
  userId: number;
  highlightId?: number;
  postId?: number;
  parentId?: number;
  content: string;
  isPublic: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
  highlight?: Highlight;
  post?: CommunityPost;
  parent?: CommunityComment;
  replies: CommunityComment[];
}

export interface Highlight {
  id: number;
  userId: number;
  azitId?: number;
  content?: string;
  isPublic: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
  azit?: Azit;
  comments: CommunityComment[];
  likes: CommunityLike[];
  medias: CommunityMedia[];
}

export interface CommunityPost {
  id: number;
  userId: number;
  gameId: number;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
  game: Game;
  comments: CommunityComment[];
  likes: CommunityLike[];
  medias: CommunityMedia[];
}

// UI 전용 타입 (기존 화면/필터/목록에 사용)
export type CommunityTab = "하이라이트" | "자유게시판";

export interface CommentReply {
  id: string | number;
  author: string;
  avatarUrl?: string;
  content: string;
  date: string;
  parentId?: string | number;
}

export interface Comment {
  id: string | number;
  author: string;
  avatarUrl?: string;
  content: string;
  date: string;
  replies: CommentReply[];
}

export interface HighlightPost {
  id: number;
  userId?: number;
  nickname?: string;
  profileUrl?: string | null;
  author?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  content: string;
  likes?: number;
  views?: number;
  comments?: number;
  mediaType?: "photo" | "video";
  images?: string[];
  medias?: string[];
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
}

export interface BoardPost {
  id: number;
  userId?: number;
  gameId?: number;
  author: string;
  date: string;
  createdAt: string;
  game: string;
  title: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  views: number;
  comments: number;
  mediaType?: "photo" | "video";
  thumbnail?: string;
}
