// src/features/community/hooks/useCommunityWrite.ts

import React from "react";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { BoardPost } from "@/features/community/types";

type UseCommunityWriteArgs = {
  activeTab: string;
  currentUserName: string;
  boardGame: string;
  addHighlightPost: (payload: { title?: string; content: string; images: File[] }) => void;
  setBoardPosts: React.Dispatch<React.SetStateAction<BoardPost[]>>;
};

export const useCommunityWrite = ({
  activeTab,
  currentUserName,
  boardGame,
  addHighlightPost,
  setBoardPosts,
}: UseCommunityWriteArgs) => {
  const [isWriteOpen, setIsWriteOpen] = React.useState(false);
  const boardMediaMapRef = React.useRef<Record<number, string[]>>({});

  const handleWritePost = () => {
    setIsWriteOpen(true);
  };

  const handleWriteSubmit = React.useCallback(
    ({
      title,
      content,
      images,
      game,
    }: {
      title?: string;
      content: string;
      images: File[];
      game?: string;
    }) => {
      if (activeTab === COMMUNITY_PAGE_LABELS.highlightTab) {
        addHighlightPost({ title, content, images });
        return;
      }
      const resolvedGame = game ?? boardGame;
      const id = Date.now();
      const imageUrls = images.map((file) => URL.createObjectURL(file));
      const newBoardPost: BoardPost = {
        id,
        author: currentUserName,
        date: "방금 전",
        createdAt: new Date().toISOString(),
        game: resolvedGame === "전체글" ? undefined : resolvedGame,
        title: title?.trim() || "제목 없음",
        content: content || "내용 없음",
        likes: 0,
        views: 0,
        comments: 0,
        images: imageUrls,
        mediaType: "photo",
      };
      if (imageUrls.length > 0) {
        boardMediaMapRef.current[id] = imageUrls;
      }
      setBoardPosts((prev) => [newBoardPost, ...prev]);
    },
    [activeTab, currentUserName, boardGame, addHighlightPost, setBoardPosts]
  );

  const revokeBoardMedia = React.useCallback(() => {
    Object.values(boardMediaMapRef.current).forEach((urls) => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    });
    boardMediaMapRef.current = {};
  }, []);

  return {
    isWriteOpen,
    setIsWriteOpen,
    handleWritePost,
    handleWriteSubmit,
    revokeBoardMedia,
  };
};
