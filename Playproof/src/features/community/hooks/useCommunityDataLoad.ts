// src/features/community/hooks/useCommunityDataLoad.ts

import React from "react";
import { getBoardPosts, getHighlights, getBestPosts } from "@/features/community/api/communityApi";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { BoardPost, HighlightPost } from "@/features/community/types";

type UseCommunityDataLoadArgs = {
  activeTab: string;
  currentPage: number;
  hydrateHighlights: (posts: HighlightPost[]) => void;
};

export const useCommunityDataLoad = ({
  activeTab,
  currentPage,
  hydrateHighlights,
}: UseCommunityDataLoadArgs) => {
  const [boardPosts, setBoardPosts] = React.useState<BoardPost[]>([]);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === COMMUNITY_PAGE_LABELS.highlightTab) {
          const [highlightData, bestData] = await Promise.all([
            getHighlights(currentPage),
            getBestPosts(),
          ]);
          hydrateHighlights(highlightData);
          setBestPosts(bestData);
        } else {
          const [boardData, bestData] = await Promise.all([
            getBoardPosts(currentPage),
            getBestPosts(),
          ]);
          setBoardPosts(boardData);
          setBestPosts(bestData);
        }
      } catch (error) {
        console.error("Failed to load community data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, currentPage, hydrateHighlights]);

  return {
    boardPosts,
    setBoardPosts,
    bestPosts,
    loading,
  };
};
