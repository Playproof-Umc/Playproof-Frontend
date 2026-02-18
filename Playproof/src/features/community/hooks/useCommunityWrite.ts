// src/features/community/hooks/useCommunityWrite.ts

import React from "react";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { createBoardPost, createHighlight } from "@/features/community/api/communityApi";

type UseCommunityWriteArgs = {
  activeTab: string;
  boardGame: string;
  refreshHighlights?: () => void;
  refreshBoardPosts?: () => void;
};

const BOARD_GAME_ID_MAP: Record<string, number> = {
  "리그오브레전드": 1,
  "발로란트": 2,
  "오버워치": 3,
};

export const useCommunityWrite = ({
  activeTab,
  boardGame,
  refreshHighlights,
  refreshBoardPosts,
}: UseCommunityWriteArgs) => {
  const [isWriteOpen, setIsWriteOpen] = React.useState(false);

  const handleWritePost = () => {
    setIsWriteOpen(true);
  };

  const handleWriteSubmit = React.useCallback(
    async ({
      title,
      content,
      images,
      game,
    }: {
      title?: string;
      content: string;
      images: File[];
      game?: string;
    }) => {
      if (activeTab === COMMUNITY_PAGE_LABELS.highlightTab) {
        try {
          await createHighlight({
            content: content || "내용 없음",
            is_public: true,
            files: images,
          });
          
          // API 성공 후 목록 새로고침
          if (refreshHighlights) {
            refreshHighlights();
          }
        } catch (error) {
          console.error('Failed to create highlight:', error);
          throw error;
        }
        return;
      }

      try {
        const resolvedGame = game ?? boardGame;
        const gameId = BOARD_GAME_ID_MAP[resolvedGame];
        
        if (!gameId) {
          console.error('Invalid game selected:', resolvedGame);
          throw new Error('게임을 선택해주세요.');
        }
        
        await createBoardPost({
          game_id: gameId,
          title: title?.trim() || "제목 없음",
          content: content || "내용 없음",
          files: images,
        });

        // API 성공 후 목록 새로고침
        if (refreshBoardPosts) {
          refreshBoardPosts();
        }
      } catch (error) {
        console.error('Failed to create board post:', error);
        throw error;
      }
    },
    [activeTab, boardGame, refreshHighlights, refreshBoardPosts]
  );

  const revokeBoardMedia = React.useCallback(() => {}, []);

  return {
    isWriteOpen,
    setIsWriteOpen,
    handleWritePost,
    handleWriteSubmit,
    revokeBoardMedia,
  };
};
