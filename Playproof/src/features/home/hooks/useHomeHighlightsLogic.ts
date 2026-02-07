// src/features/home/hooks/useHomeHighlightsLogic.ts

import React from "react";
import { getHighlights } from "@/features/community/api/communityApi";
import type { HighlightPost } from "@/features/community/types";
import { useHighlightFeed } from "@/features/community/hooks/useHighlightFeed";

export const useHomeHighlightsLogic = (displayName: string) => {
  const { state: highlightState, actions: highlightActions } = useHighlightFeed({
    userName: displayName,
  });
  const { hydrateFromPosts } = highlightActions;

  const [selectedHighlight, setSelectedHighlight] = React.useState<HighlightPost | null>(null);
  const [isHighlightOpen, setIsHighlightOpen] = React.useState(false);

  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedHighlight(post);
    setIsHighlightOpen(true);
  };

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const highlightData = await getHighlights(1);
        if (!alive) return;
        hydrateFromPosts(highlightData);
      } catch (error) {
        console.error("home highlight load error:", error);
      }
    })();
    return () => {
      alive = false;
    };
  }, [hydrateFromPosts]);

  return {
    state: {
      highlights: highlightState.highlights,
      selectedHighlight,
      isHighlightOpen,
      highlightUserName: highlightState.currentUserName,
    },
    handlers: {
      setIsHighlightOpen,
      handleHighlightClick,
      getHighlightLikeState: highlightActions.getLikeState,
      getHighlightComments: highlightActions.getComments,
      getHighlightCommentCount: highlightActions.getCommentCount,
      toggleHighlightLike: highlightActions.toggleLike,
      deleteHighlightPost: highlightActions.deletePost,
      addHighlightComment: highlightActions.addComment,
      addHighlightReply: highlightActions.addReply,
      editHighlightComment: highlightActions.editComment,
      editHighlightReply: highlightActions.editReply,
      deleteHighlightComment: highlightActions.deleteComment,
      deleteHighlightReply: highlightActions.deleteReply,
    },
  };
};
