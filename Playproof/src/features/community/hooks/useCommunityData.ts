// src/features/community/hooks/useCommunityData.ts

import React from "react";
import { useAuthStore } from "@/store/authStore";
import type { CommunityTab, HighlightPost } from "@/features/community/types";
import { useHighlightFeed } from "@/features/community/hooks/useHighlightFeed";
import { useCommunityDataLoad } from "@/features/community/hooks/useCommunityDataLoad";
import { useCommunityFilters } from "@/features/community/hooks/useCommunityFilters";
import { useCommunityWrite } from "@/features/community/hooks/useCommunityWrite";

const BOARD_GAME_ID_MAP: Record<string, number> = {
  "전체글": 0,
  "리그오브레전드": 1,
  "발로란트": 2,
  "오버워치": 3,
};

type UseCommunityDataArgs = {
  activeTab: CommunityTab;
  currentPage: number;
  boardGame: string;
  setBoardGame: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPost: React.Dispatch<React.SetStateAction<HighlightPost | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useCommunityData = ({
  activeTab,
  currentPage,
  boardGame,
  setBoardGame,
  setSelectedPost,
  setIsModalOpen,
}: UseCommunityDataArgs) => {
  const authUserId = useAuthStore((s) => s.userId);
  const userId = authUserId ? `user-${authUserId}` : undefined;

  const {
    state: highlightState,
    actions: highlightActions,
  } = useHighlightFeed();

  const boardGameId = BOARD_GAME_ID_MAP[boardGame] ?? 0;

  const {
    boardPosts: loadedBoardPosts,
    setBoardPosts: setLoadedBoardPosts,
    bestPosts: loadedBestPosts,
    loading: loadedLoading,
  } = useCommunityDataLoad({
    activeTab,
    currentPage,
    boardGameId,
    hydrateHighlights: highlightActions.hydrateFromPosts,
  });

  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    isFilterOpen,
    setIsFilterOpen,
    filters,
    setFilters,
    filteredHighlights,
    filteredBoardPosts,
    totalPages,
  } = useCommunityFilters({
    highlights: highlightState.highlights,
    boardPosts: loadedBoardPosts,
    itemsPerPage: 10,
    boardGame,
    setBoardGame,
  });

  const {
    isWriteOpen,
    setIsWriteOpen,
    handleWritePost,
    handleWriteSubmit,
    revokeBoardMedia,
  } = useCommunityWrite({
    activeTab,
    boardGame,
    refreshHighlights: () => {
      import("@/features/community/api/communityApi").then(({ getHighlights }) => {
        getHighlights(currentPage).then((posts) => {
          highlightActions.hydrateFromPosts(posts);
        });
      });
    },
    refreshBoardPosts: () => {
      import("@/features/community/api/communityApi").then(({ getBoardPosts, getAllBoardPosts }) => {
        const fetchPosts = boardGameId === 0
          ? getAllBoardPosts(currentPage)
          : getBoardPosts(boardGameId, currentPage);
        fetchPosts.then((posts) => {
          setLoadedBoardPosts(posts);
        });
      });
    },
  });

  React.useEffect(() => {
    return () => {
      revokeBoardMedia();
    };
  }, [revokeBoardMedia]);

  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    highlightActions.fetchComments(post.id);
  };

  return {
    ui: {
      searchQuery,
      isFilterOpen,
      filters,
    },
    data: {
      bestPosts: loadedBestPosts,
      loading: loadedLoading,
      filteredHighlights,
      filteredBoardPosts,
      totalPages,
    },
    modal: {
      isWriteOpen,
    },
    user: {
      currentUserName: highlightState.currentUserName,
      userId,
    },
    actions: {
      search: {
        setQuery: setSearchQuery,
        submit: handleSearch,
      },
      filter: {
        setOpen: setIsFilterOpen,
        setFilters,
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
      write: {
        open: handleWritePost,
        submit: handleWriteSubmit,
      },
      modal: {
        setWriteOpen: setIsWriteOpen,
      },
    },
  };
};
