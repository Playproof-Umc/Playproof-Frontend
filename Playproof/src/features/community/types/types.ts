export type CommunityTab = "하이라이트" | "자유게시판";

export type HighlightPost = {
  id: number;
  author: string;
  date: string;
  title?: string;
  content: string;
  likes: number;
  views?: number;
  comments: number;
  images: string[];
};

export type BoardPost = {
  id: number;
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  thumbnail?: string;
};

export type Comment = {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
  replies: number;
};
