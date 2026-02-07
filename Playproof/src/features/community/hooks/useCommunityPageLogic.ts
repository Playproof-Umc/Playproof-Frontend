// src/features/community/hooks/useCommunityPageLogic.ts

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { CommunityTab, HighlightPost, BoardPost } from "@/features/community/types";
import { useHighlightFeed } from "@/features/community/hooks/useHighlightFeed";
import { useCommunityDataLoad } from "@/features/community/hooks/useCommunityDataLoad";
import { useCommunityFilters } from "@/features/community/hooks/useCommunityFilters";
import { useCommunityWrite } from "@/features/community/hooks/useCommunityWrite";

export const useCommunityPageLogic = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authUserId = useAuthStore((s) => s.userId);
  const userId = authUserId ? `user-${authUserId}` : undefined;
  const {
    state: highlightState,
    actions: highlightActions,
  } = useHighlightFeed();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPost, setSelectedPost] = React.useState<HighlightPost | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const currentTab = searchParams.get("tab");
  const activeTab: CommunityTab =
    currentTab === COMMUNITY_PAGE_LABELS.freeTab
      ? COMMUNITY_PAGE_LABELS.freeTab
      : COMMUNITY_PAGE_LABELS.highlightTab;

  const handleTabChange = (tab: CommunityTab) => {
    setSearchParams({ tab });
    setCurrentPage(1);
  };

  const { boardPosts, setBoardPosts, bestPosts, loading } = useCommunityDataLoad({
    activeTab,
    currentPage,
    hydrateHighlights: highlightActions.hydrateFromPosts,
  });

  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleBoardClick = (post: BoardPost) => {
    navigate(`/community/${post.id}?from=자유게시판`, { state: { post } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    isFilterOpen,
    setIsFilterOpen,
    filters,
    setFilters,
    boardGame,
    setBoardGame,
    filteredHighlights,
    filteredBoardPosts,
    totalPages,
  } = useCommunityFilters({
    highlights: highlightState.highlights,
    boardPosts,
    itemsPerPage: 10,
  });

  const {
    isWriteOpen,
    setIsWriteOpen,
    handleWritePost,
    handleWriteSubmit,
    revokeBoardMedia,
  } = useCommunityWrite({
    activeTab,
    currentUserName: highlightState.currentUserName,
    boardGame,
    addHighlightPost: highlightActions.addHighlightPost,
    setBoardPosts,
  });

  React.useEffect(() => {
    return () => {
      revokeBoardMedia();
    };
  }, [revokeBoardMedia]);

  return {
    ui: {
      activeTab,
      searchQuery,
      currentPage,
      isFilterOpen,
      filters,
      boardGame,
    },
    data: {
      bestPosts,
      loading,
      filteredHighlights,
      filteredBoardPosts,
      totalPages,
    },
    modal: {
      selectedPost,
      isModalOpen,
      isWriteOpen,
    },
    user: {
      currentUserName: highlightState.currentUserName,
      userId,
    },
    actions: {
      tab: {
        change: handleTabChange,
      },
      search: {
        setQuery: setSearchQuery,
        submit: handleSearch,
      },
      filter: {
        setOpen: setIsFilterOpen,
        setFilters,
      },
      board: {
        openDetail: handleBoardClick,
        setGame: setBoardGame,
      },
      pagination: {
        setPage: setCurrentPage,
      },
      highlight: {
        openDetail: handleHighlightClick,
        getLikeState: highlightActions.getLikeState,
        getComments: highlightActions.getComments,
        getCommentCount: highlightActions.getCommentCount,
        toggleLike: highlightActions.toggleLike,
        addComment: highlightActions.addComment,
        addReply: highlightActions.addReply,
        editComment: highlightActions.editComment,
        editReply: highlightActions.editReply,
        deleteComment: highlightActions.deleteComment,
        deleteReply: highlightActions.deleteReply,
        deletePost: highlightActions.deletePost,
      },
      modal: {
        closeDetail: handleCloseModal,
        setWriteOpen: setIsWriteOpen,
      },
      write: {
        open: handleWritePost,
        submit: handleWriteSubmit,
      },
    },
  };
};
