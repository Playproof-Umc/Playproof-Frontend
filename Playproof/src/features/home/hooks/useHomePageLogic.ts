// src/features/home/hooks/useHomePageLogic.ts

import React from "react";
import { useSignupCompleteModal } from "@/features/auth/signup/hooks/useSignupCompleteModal";
import { useAuthStore } from "@/store/authStore";
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";
import { getBestPosts } from "@/features/community/api/communityApi";
import { getFriends, type Friend } from "@/services/friendApi";
import { getAzits } from "@/features/team/api/azitApi";
import { getAzitSchedules } from "@/features/team/api/azitScheduleApi";
import type { FilterState, MatchingData } from "@/features/matching/types";
import type { HighlightPost, BoardPost, CommunityComment } from "@/features/community/types";
import type { AzitSlide } from "@/features/home/components/sections/types";
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
    azitSlides: AzitSlide[];
    azitIndex: number;
    friends: Friend[];
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
    handleHighlightComments: (postId: number) => CommunityComment[];
    handleHighlightCommentCount: (post: HighlightPost) => number;
    toggleHighlightLike: (postId: number, fallbackLikes: number) => void;
    deleteHighlightPost: (postId: number) => void;
    addHighlightComment: (postId: number, content: string) => void | Promise<void>;
    addHighlightReply: (postId: number, commentId: number, content: string) => void | Promise<void>;
    editHighlightComment: (postId: number, commentId: number, content: string) => void | Promise<void>;
    editHighlightReply: (postId: number, commentId: number, replyId: number, content: string) => void | Promise<void>;
    deleteHighlightComment: (postId: number, commentId: number) => void | Promise<void>;
    deleteHighlightReply: (postId: number, commentId: number, replyId: number) => void | Promise<void>;
  };
};

export const useHomePageLogic = (): UseHomePageLogicReturn => {
  const { open: isSignupCompleteOpen, username, close } = useSignupCompleteModal();
  const authNickname = useAuthStore((s) => s.nickname);
  const accessToken = useAuthStore((s) => s.accessToken);
  const displayName = authNickname ?? "사용자";

  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [azitIndex, setAzitIndex] = React.useState(0);
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [azitSlides, setAzitSlides] = React.useState<AzitSlide[]>([]);

  const { state: matchingState, handlers: matchingHandlers } = useHomeMatchingLogic();
  const { state: highlightState, handlers: highlightHandlers } = useHomeHighlightsLogic(displayName);

  React.useEffect(() => {
    let alive = true;
    if (!accessToken) return;

    (async () => {
      try {
        setLoading(true);
        
        const [userData, bestData, friendsData, azitsData] = await Promise.all([
          fetchUserSummaryMock(),
          getBestPosts(),
          getFriends(),
          getAzits()
        ]);

        if (!alive) return;
        setUser(userData);
        setBestPosts(bestData);
        setFriends(friendsData);

        const slides = await Promise.all(
          azitsData.map(async (azit) => {
            try {
              const scheduleList = await getAzitSchedules({ azitId: azit.id, size: 1 });
              const latestSchedule = scheduleList.schedules[0];
              
              let timeLabel = "시간 미정";
              if (latestSchedule?.game_start_at) {
                timeLabel = new Date(latestSchedule.game_start_at).toLocaleTimeString("ko-KR", { 
                  hour: "numeric", minute: "2-digit" 
                });
              }

              return {
                azit: { id: azit.id, name: azit.name, icon: azit.icon },
                schedule: latestSchedule ? {
                  id: latestSchedule.schedule_id,
                  title: latestSchedule.title,
                  currentParticipants: latestSchedule.current_participants,
                  maxParticipants: latestSchedule.max_participants
                } : undefined,
                timeLabel
              };
            } catch {
              return {
                azit: { id: azit.id, name: azit.name, icon: azit.icon },
                timeLabel: "정보 없음"
              };
            }
          })
        );

        if (alive) setAzitSlides(slides);

      } catch (e) {
        console.error("Home data fetch error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [accessToken]);

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
      friends,
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
