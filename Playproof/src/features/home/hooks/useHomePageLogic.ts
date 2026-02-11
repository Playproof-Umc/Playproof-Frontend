// src/features/home/hooks/useHomePageLogic.ts

import React from "react";
import { useSignupCompleteModal } from "@/features/auth/signup/hooks/useSignupCompleteModal";
import { useAuthStore } from "@/store/authStore";
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";
import type { Azit, Schedule } from "@/features/team/types/types";
import { getAzits } from "@/features/team/api/azitApi";
import { getAzitSchedules, type AzitScheduleDetailResDto } from "@/features/team/api/azitScheduleApi";
import { getBestPosts } from "@/features/community/api/communityApi";
import type { FilterState, MatchingData } from "@/features/matching/types";
import type { HighlightPost, BoardPost, CommunityComment } from "@/features/community/types";
import { useHomeHighlightsLogic } from "@/features/home/hooks/useHomeHighlightsLogic";
import { useHomeMatchingLogic } from "@/features/home/hooks/useHomeMatchingLogic";
import { getFriends as fetchFriends } from "@/services/friendApi";

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
    friends: {
      id: number;
      nickname: string;
      statusMessage?: string;
      isOnline: boolean;
      avatarUrl?: string;
    }[];
    azitSlides: {
      azit: Azit;
      schedule: Schedule | undefined;
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

  const mapScheduleDtoToUi = React.useCallback((dto: AzitScheduleDetailResDto): Schedule => {
    const gameStart = new Date(dto.game_start_at);
    const gameEnd = new Date(dto.game_end_at);
    const dateStr = `${String(gameStart.getMonth() + 1).padStart(2, "0")}.${String(
      gameStart.getDate()
    ).padStart(2, "0")}`;
    const timeStr = gameStart.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const participants = Array.from({ length: dto.current_participants ?? 0 }).map(() => ({
      user: null,
      status: "JOIN" as const,
    }));

    return {
      id: String(dto.schedule_id),
      title: dto.title,
      dateStr,
      timeStr,
      fullDate: gameEnd,
      hostId: "0",
      maxMembers: dto.max_participants,
      participants,
      isFeedbackDone: false,
    };
  }, []);

  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [azitIndex, setAzitIndex] = React.useState(0);
  const [azits, setAzits] = React.useState<Azit[]>([]);
  const [scheduleByAzit, setScheduleByAzit] = React.useState<Record<number, Schedule | undefined>>({});
  const [friends, setFriends] = React.useState<
    { id: number; nickname: string; statusMessage?: string; isOnline: boolean; avatarUrl?: string }[]
  >([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAzits();
        if (!alive) return;
        if (data.length > 0) setAzits(data);
      } catch (err) {
        console.error("home azit load error:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    (async () => {
      try {
        const list = await fetchFriends();
        if (!alive) return;
        setFriends(
          list.map((f) => ({
            id: f.userId,
            nickname: f.nickname ?? "Unknown",
            statusMessage: f.statusMessage ?? undefined,
            isOnline: false,
            avatarUrl: f.avatarUrl ?? undefined,
          }))
        );
      } catch (err) {
        console.error("friend list load error:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken]);

  const { state: matchingState, handlers: matchingHandlers } = useHomeMatchingLogic();
  const { state: highlightState, handlers: highlightHandlers } = useHomeHighlightsLogic(displayName);

  const azitSlides = React.useMemo(() => {
    return azits.map((azit) => {
      const schedule = scheduleByAzit[azit.id];
      const timeLabel = schedule?.fullDate
        ? schedule.fullDate.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })
        : "시간 미정";
      return { azit, schedule, timeLabel };
    });
  }, [azits, scheduleByAzit]);

  React.useEffect(() => {
    if (!accessToken || azits.length === 0) return;
    let alive = true;
    (async () => {
      try {
        const entries = await Promise.all(
          azits.map(async (azit) => {
            try {
              const res = await getAzitSchedules({ azitId: azit.id, size: 1 });
              const first = res.schedules[0];
              return [azit.id, first ? mapScheduleDtoToUi(first) : undefined] as const;
            } catch {
              return [azit.id, undefined] as const;
            }
          })
        );
        if (!alive) return;
        const next: Record<number, Schedule | undefined> = {};
        entries.forEach(([id, sch]) => {
          next[id] = sch;
        });
        setScheduleByAzit(next);
      } catch (err) {
        console.error("home schedule load error:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken, azits, mapScheduleDtoToUi]);

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
      friends,
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
