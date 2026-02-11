// src/features/community/hooks/useCommunityUI.ts

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { CommunityTab, HighlightPost, BoardPost } from "@/features/community/types";

export const useCommunityUI = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPost, setSelectedPost] = React.useState<HighlightPost | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [boardGame, setBoardGame] = React.useState("전체글");

  const currentTab = searchParams.get("tab");
  const activeTab: CommunityTab =
    currentTab === COMMUNITY_PAGE_LABELS.freeTab
      ? COMMUNITY_PAGE_LABELS.freeTab
      : COMMUNITY_PAGE_LABELS.highlightTab;

  const handleTabChange = (tab: CommunityTab) => {
    setSearchParams({ tab });
    setCurrentPage(1);
  };

  const handleBoardClick = (post: BoardPost) => {
    navigate(`/community/${post.id}?from=자유게시판`, { state: { post } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return {
    ui: {
      activeTab,
      currentPage,
      boardGame,
      selectedPost,
      isModalOpen,
    },
    setters: {
      setSelectedPost,
      setIsModalOpen,
      setCurrentPage,
      setBoardGame,
    },
    actions: {
      tab: {
        change: handleTabChange,
      },
      pagination: {
        setPage: setCurrentPage,
      },
      board: {
        openDetail: handleBoardClick,
        setGame: setBoardGame,
      },
      modal: {
        closeDetail: handleCloseModal,
      },
    },
  };
};
