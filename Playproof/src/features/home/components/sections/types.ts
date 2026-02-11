// src/features/home/components/sections/types.ts

import type { HighlightPost, BoardPost } from "@/features/community/types";
import type { UserSummary } from "@/features/home/data/userSummaryMock";
import type { FilterState, MatchingData } from "@/features/matching/types";
import type { Azit, Schedule } from "@/features/team/types/types";

export type HomeUserSummarySectionProps = {
  loading: boolean;
  user: UserSummary | null;
  displayName: string;
  onEditProfile: () => void;
};

export type AzitSlide = {
  azit: Azit;
  schedule: Schedule | undefined;
  timeLabel: string;
};

export type HomePartyFriendsSectionProps = {
  azitSlides: AzitSlide[];
  azitIndex: number;
  onPrevAzit: () => void;
  onNextAzit: () => void;
  onOpenAzit: (azitId: number) => void;
  friends: {
    id: number;
    nickname: string;
    statusMessage?: string;
    isOnline: boolean;
    avatarUrl?: string;
  }[];
};

export type HomeMatchingSectionProps = {
  activeGameTab: string;
  searchKeyword: string;
  isFilterOpen: boolean;
  onTabChange: (tab: string) => void;
  onMoreClick: () => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  onWriteClick: () => void;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  onFilterApply: (filters: FilterState) => void;
  matches: MatchingData[];
  onCardClick: (match: MatchingData) => void;
};

export type HomeCommunityHighlightSectionProps = {
  posts: HighlightPost[];
  onPostClick: (post: HighlightPost) => void;
  getLikeState: (post: HighlightPost) => { count: number; isLiked: boolean };
  getCommentCount: (post: HighlightPost) => number;
  onToggleLike: (postId: number, fallbackLikes: number) => void;
  currentUserName: string;
  onDeletePost?: (postId: number) => void;
};

export type HomeHotTopicSectionProps = {
  posts: BoardPost[];
  onMoreClick?: () => void;
  onPostClick?: (post: BoardPost) => void;
};
