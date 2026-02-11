// @refresh reset
// src/features/community/hooks/useCommunityPageLogic.ts

import { useCommunityUI } from "@/features/community/hooks/useCommunityUI";
import { useCommunityData } from "@/features/community/hooks/useCommunityData";

export const useCommunityPageLogic = () => {
  const { ui: uiState, setters, actions: uiActions } = useCommunityUI();
  const dataState = useCommunityData({
    activeTab: uiState.activeTab,
    currentPage: uiState.currentPage,
    boardGame: uiState.boardGame,
    setBoardGame: setters.setBoardGame,
    setSelectedPost: setters.setSelectedPost,
    setIsModalOpen: setters.setIsModalOpen,
  });

  return {
    ui: {
      activeTab: uiState.activeTab,
      searchQuery: dataState.ui.searchQuery,
      currentPage: uiState.currentPage,
      isFilterOpen: dataState.ui.isFilterOpen,
      filters: dataState.ui.filters,
      boardGame: uiState.boardGame,
    },
    data: {
      bestPosts: dataState.data.bestPosts,
      loading: dataState.data.loading,
      filteredHighlights: dataState.data.filteredHighlights,
      filteredBoardPosts: dataState.data.filteredBoardPosts,
      totalPages: dataState.data.totalPages,
    },
    modal: {
      selectedPost: uiState.selectedPost,
      isModalOpen: uiState.isModalOpen,
      isWriteOpen: dataState.modal.isWriteOpen,
    },
    user: {
      currentUserName: dataState.user.currentUserName,
      userId: dataState.user.userId,
    },
    actions: {
      tab: {
        change: uiActions.tab.change,
      },
      search: {
        setQuery: dataState.actions.search.setQuery,
        submit: dataState.actions.search.submit,
      },
      filter: {
        setOpen: dataState.actions.filter.setOpen,
        setFilters: dataState.actions.filter.setFilters,
      },
      board: {
        openDetail: uiActions.board.openDetail,
        setGame: uiActions.board.setGame,
      },
      pagination: {
        setPage: uiActions.pagination.setPage,
      },
      highlight: {
        openDetail: dataState.actions.highlight.openDetail,
        getLikeState: dataState.actions.highlight.getLikeState,
        getComments: dataState.actions.highlight.getComments,
        getCommentCount: dataState.actions.highlight.getCommentCount,
        toggleLike: dataState.actions.highlight.toggleLike,
        addComment: dataState.actions.highlight.addComment,
        addReply: dataState.actions.highlight.addReply,
        editComment: dataState.actions.highlight.editComment,
        editReply: dataState.actions.highlight.editReply,
        deleteComment: dataState.actions.highlight.deleteComment,
        deleteReply: dataState.actions.highlight.deleteReply,
        deletePost: dataState.actions.highlight.deletePost,
      },
      modal: {
        closeDetail: uiActions.modal.closeDetail,
        setWriteOpen: dataState.actions.modal.setWriteOpen,
      },
      write: {
        open: dataState.actions.write.open,
        submit: dataState.actions.write.submit,
      },
    },
  };
};
