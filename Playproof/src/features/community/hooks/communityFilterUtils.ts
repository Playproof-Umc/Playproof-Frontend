// src/features/community/hooks/communityFilterUtils.ts

import type { BoardPost, HighlightPost } from "@/features/community/types";
import type { CommunityFilterState } from "@/features/community/components/community-filter/CommunityFilterModal";

const normalizeQuery = (value: string) => value.trim().toLowerCase();

const createDateRangeChecker = (filters: CommunityFilterState) => {
  const hasDateFilter = Boolean(filters.startDate || filters.endDate);
  const startDate = filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters.endDate ? new Date(filters.endDate) : null;

  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  return (createdAt?: string) => {
    if (!hasDateFilter) return true;
    if (!createdAt) return true;
    const value = new Date(createdAt);
    if (Number.isNaN(value.getTime())) return true;
    if (startDate && value < startDate) return false;
    if (endDate && value > endDate) return false;
    return true;
  };
};

const createMediaTypeChecker = (filters: CommunityFilterState) => (mediaType?: "photo" | "video") => {
  if (!filters.mediaType) return true;
  if (!mediaType) return true;
  return mediaType === filters.mediaType;
};

const matchHighlightQuery = (post: HighlightPost, normalizedQuery: string) => {
  if (!normalizedQuery) return true;
  const title = post.title ?? "";
  return (
    title.toLowerCase().includes(normalizedQuery) ||
    post.content.toLowerCase().includes(normalizedQuery) ||
    post.author.toLowerCase().includes(normalizedQuery)
  );
};

const matchBoardQuery = (post: BoardPost, normalizedQuery: string) => {
  if (!normalizedQuery) return true;
  return (
    post.title.toLowerCase().includes(normalizedQuery) ||
    post.content.toLowerCase().includes(normalizedQuery) ||
    post.author.toLowerCase().includes(normalizedQuery)
  );
};

export const filterHighlights = (
  highlights: HighlightPost[],
  filters: CommunityFilterState,
  searchQuery: string
) => {
  const normalizedQuery = normalizeQuery(searchQuery);
  const matchesMediaType = createMediaTypeChecker(filters);
  const isWithinRange = createDateRangeChecker(filters);

  return highlights.filter(
    (post) =>
      matchHighlightQuery(post, normalizedQuery) &&
      matchesMediaType(post.mediaType) &&
      isWithinRange(post.createdAt)
  );
};

export const filterBoardPosts = (
  boardPosts: BoardPost[],
  filters: CommunityFilterState,
  searchQuery: string,
  boardGame: string
) => {
  const normalizedQuery = normalizeQuery(searchQuery);
  const matchesMediaType = createMediaTypeChecker(filters);
  const isWithinRange = createDateRangeChecker(filters);
  const shouldMatchGame = boardGame !== "전체글";

  return boardPosts.filter(
    (post) =>
      matchBoardQuery(post, normalizedQuery) &&
      matchesMediaType(post.mediaType) &&
      isWithinRange(post.createdAt) &&
      (!shouldMatchGame || post.game === boardGame)
  );
};
