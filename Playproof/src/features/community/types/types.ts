// src/features/community/types/types.ts

export type CommunityTab = "하이라이트" | "자유게시판";

export type HighlightPost = {
  id: number;
  author: string;
  date: string;
  createdAt?: string;
  title?: string;
  content: string;
  likes: number;
  views?: number;
  comments: number;
  images: string[];
  mediaType?: "photo" | "video";
};

export type BoardPost = {
  id: number;
  author: string;
  date: string;
  createdAt?: string;
  game?: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  thumbnail?: string;
  images?: string[];
  mediaType?: "photo" | "video";
};

export type Comment = {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
  replies: CommentReply[];
};

export type CommentReply = {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
  parentId: string;
};
