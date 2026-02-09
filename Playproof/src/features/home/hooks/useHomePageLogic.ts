// src/features/home/hooks/useHomePageLogic.ts

import React from "react";
import { useSignupCompleteModal } from "@/features/auth/signup/hooks/useSignupCompleteModal";
import { useAuthStore } from "@/store/authStore";
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";
import { MOCK_MY_AZITS, mockSchedules } from "@/features/team/data/mockTeamData";
import { getBestPosts } from "@/features/community/api/communityApi";
import type { FilterState, MatchingData } from "@/features/matching/types";
import type { HighlightPost, BoardPost, Comment } from "@/features/community/types";
import { useHomeHighlightsLogic } from "@/features/home/hooks/useHomeHighlightsLogic";
import { useHomeMatchingLogic } from "@/features/home/hooks/useHomeMatchingLogic";

type UseHomePageLogicReturn = {
  state: {
    signupModal: {
      open: boolean;
      username: string | null;
    };
    highlights: HighlightPost[];
    bestPosts: BoardPost[];
    activeGameTab: string;
    isHighlightOpen: boolean;
    displayName: string;
    user: UserSummary | null;
    loading: boolean;
    azitSlides: {
      azit: (typeof MOCK_MY_AZITS)[number];
      schedule: (typeof mockSchedules)[number] | undefined;
      timeLabel: string;
    }[];
    azitIndex: number;
    searchKeyword: string;
    isFilterOpen: boolean;
    filteredPopularMatches: MatchingData[];
    highlightUserName: string;
    selectedHighlight: HighlightPost | null;
  };
  handlers: {
    closeSignupComplete: () => void;
    setActiveGameTab: React.Dispatch<React.SetStateAction<string>>;
    setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
    setIsHighlightOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearchSubmit: (text: string) => void;
    handleFilterApply: (filters: FilterState) => void;
    handleHomeMatchClick: (match: MatchingData) => void;
    handleHighlightClick: (post: HighlightPost) => void;
    handlePrevAzit: () => void;
    handleNextAzit: () => void;
    handleHighlightLikeState: (post: HighlightPost) => { count: number; isLiked: boolean };
    handleHighlightComments: (postId: number) => Comment[];
    handleHighlightCommentCount: (post: HighlightPost) => number;
    toggleHighlightLike: (postId: number, fallbackLikes: number) => void;
    deleteHighlightPost: (postId: number) => void;
    addHighlightComment: (postId: number, content: string) => void;
    addHighlightReply: (postId: number, commentId: string, content: string) => void;
    editHighlightComment: (postId: number, commentId: string, content: string) => void;
    editHighlightReply: (postId: number, commentId: string, replyId: string, content: string) => void;
    deleteHighlightComment: (postId: number, commentId: string) => void;
    deleteHighlightReply: (postId: number, commentId: string, replyId: string) => void;
  };
};

export const useHomePageLogic = (): UseHomePageLogicReturn => {
  const { open: isSignupCompleteOpen, username, close } = useSignupCompleteModal();
  const authNickname = useAuthStore((s) => s.nickname);
  const displayName = authNickname ?? "사용자";

  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [azitIndex, setAzitIndex] = React.useState(0);

  const { state: matchingState, handlers: matchingHandlers } = useHomeMatchingLogic();
  const { state: highlightState, handlers: highlightHandlers } = useHomeHighlightsLogic(displayName);

  const azitSlides = React.useMemo(() => {
    const schedules = mockSchedules.length > 0 ? mockSchedules : [undefined];
    return MOCK_MY_AZITS.map((azit, idx) => {
      const schedule = schedules[idx % schedules.length];
      const timeLabel = schedule?.fullDate
        ? schedule.fullDate.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })
        : "시간 미정";
      return { azit, schedule, timeLabel };
    });
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [data, bestData] = await Promise.all([
          fetchUserSummaryMock(),
          getBestPosts(),
        ]);
        if (!alive) return;
        setUser(data);
        setBestPosts(bestData);
      } catch (e) {
        console.error("user summary mock error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handlePrevAzit = () => {
    setAzitIndex((prev) => (prev <= 0 ? azitSlides.length - 1 : prev - 1));
  };

  const handleNextAzit = () => {
    setAzitIndex((prev) => (prev >= azitSlides.length - 1 ? 0 : prev + 1));
  };

  return {
    state: {
      signupModal: {
        open: isSignupCompleteOpen,
        username: username ?? null,
      },
      highlights: highlightState.highlights,
      bestPosts,
      activeGameTab: matchingState.activeGameTab,
      isHighlightOpen: highlightState.isHighlightOpen,
      displayName,
      user,
      loading,
      azitSlides,
      azitIndex,
      searchKeyword: matchingState.searchKeyword,
      isFilterOpen: matchingState.isFilterOpen,
      filteredPopularMatches: matchingState.filteredPopularMatches,
      highlightUserName: highlightState.highlightUserName,
      selectedHighlight: highlightState.selectedHighlight,
    },
    handlers: {
      closeSignupComplete: close,
      setActiveGameTab: matchingHandlers.setActiveGameTab,
      setIsFilterOpen: matchingHandlers.setIsFilterOpen,
      setSearchKeyword: matchingHandlers.setSearchKeyword,
      setIsHighlightOpen: highlightHandlers.setIsHighlightOpen,
      handleSearchSubmit: matchingHandlers.handleSearchSubmit,
      handleFilterApply: matchingHandlers.handleFilterApply,
      handleHomeMatchClick: matchingHandlers.handleHomeMatchClick,
      handleHighlightClick: highlightHandlers.handleHighlightClick,
      handlePrevAzit,
      handleNextAzit,
      handleHighlightLikeState: highlightHandlers.getHighlightLikeState,
      handleHighlightComments: highlightHandlers.getHighlightComments,
      handleHighlightCommentCount: highlightHandlers.getHighlightCommentCount,
      toggleHighlightLike: highlightHandlers.toggleHighlightLike,
      deleteHighlightPost: highlightHandlers.deleteHighlightPost,
      addHighlightComment: highlightHandlers.addHighlightComment,
      addHighlightReply: highlightHandlers.addHighlightReply,
      editHighlightComment: highlightHandlers.editHighlightComment,
      editHighlightReply: highlightHandlers.editHighlightReply,
      deleteHighlightComment: highlightHandlers.deleteHighlightComment,
      deleteHighlightReply: highlightHandlers.deleteHighlightReply,
    },
  };
};
