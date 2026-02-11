// src/features/community/hooks/useCommunityWrite.ts

import React from "react";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import type { BoardPost } from "@/features/community/types";
import { createBoardPost, createHighlight } from "@/features/community/api/communityApi";

type UseCommunityWriteArgs = {
  activeTab: string;
  currentUserName: string;
  boardGame: string;
  addHighlightPost: (payload: { title?: string; content: string; images: File[] }) => void;
  setBoardPosts: React.Dispatch<React.SetStateAction<BoardPost[]>>;
  refreshHighlights?: () => void;
};

const BOARD_GAME_ID_MAP: Record<string, number> = {
  "리그오브레전드": 1,
  "발로란트": 2,
  "오버워치": 3,
};

const BOARD_GAME_NAME_MAP: Record<number, string> = {
  1: "리그오브레전드",
  2: "발로란트",
  3: "오버워치",
};

export const useCommunityWrite = ({
  activeTab,
  currentUserName,
  boardGame,
  addHighlightPost,
  setBoardPosts,
  refreshHighlights,
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

      const resolvedGame = game ?? boardGame;
      const gameId = BOARD_GAME_ID_MAP[resolvedGame];
      
      if (!gameId) {
        console.error('Invalid game selected:', resolvedGame);
        throw new Error('게임을 선택해주세요.');
      }
      
      const res = await createBoardPost({
        game_id: gameId,
        title: title?.trim() || "제목 없음",
        content: content || "내용 없음",
        files: images,
      });

      const newBoardPost: BoardPost = {
        id: res.post_id,
        author: res.nickname ?? currentUserName,
        date: res.created_at ?? "방금 전",
        createdAt: res.created_at ?? new Date().toISOString(),
        game: BOARD_GAME_NAME_MAP[res.game_id] ?? resolvedGame,
        title: res.title ?? "제목 없음",
        content: res.content ?? "내용 없음",
        likes: res.like_count ?? 0,
        views: 0,
        comments: res.comment_count ?? 0,
        mediaType: (res.medias ?? []).length > 0 ? "photo" : undefined,
        thumbnail: res.medias?.[0]?.media_url,
      };

      setBoardPosts((prev) => [newBoardPost, ...prev]);
    },
    [activeTab, currentUserName, boardGame, addHighlightPost, setBoardPosts]
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
