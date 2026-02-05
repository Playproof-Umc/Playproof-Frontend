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
