import React from "react";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { BoardPost } from "@/features/community/types";

type UseCommunityWriteArgs = {
  activeTab: string;
  currentUserName: string;
  addHighlightPost: (payload: { title?: string; content: string; images: File[] }) => void;
  setBoardPosts: React.Dispatch<React.SetStateAction<BoardPost[]>>;
};

export const useCommunityWrite = ({
  activeTab,
  currentUserName,
  addHighlightPost,
  setBoardPosts,
}: UseCommunityWriteArgs) => {
  const [isWriteOpen, setIsWriteOpen] = React.useState(false);

  const handleWritePost = () => {
    setIsWriteOpen(true);
  };

  const handleWriteSubmit = React.useCallback(
    ({ title, content, images }: { title?: string; content: string; images: File[] }) => {
      if (activeTab === COMMUNITY_PAGE_LABELS.highlightTab) {
        addHighlightPost({ title, content, images });
        return;
      }
      const id = Date.now();
      const newBoardPost: BoardPost = {
        id,
        author: currentUserName,
        date: "방금 전",
        createdAt: new Date().toISOString(),
        title: title?.trim() || "제목 없음",
        content: content || "내용 없음",
        likes: 0,
        views: 0,
        comments: 0,
        mediaType: "photo",
      };
      setBoardPosts((prev) => [newBoardPost, ...prev]);
    },
    [activeTab, currentUserName, addHighlightPost, setBoardPosts]
  );

  return {
    isWriteOpen,
    setIsWriteOpen,
    handleWritePost,
    handleWriteSubmit,
  };
};
