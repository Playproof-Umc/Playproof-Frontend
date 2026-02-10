// src/features/team/hooks/useAzitPageLogic.ts

import React from "react";
import { useLocation } from "react-router-dom";
import type { User } from "@/types";
import {
  MOCK_MY_AZITS,
  mockMembers,
  mockClipsByAzit,
  mockMembersByAzit,
  mockSchedulesByAzit,
} from "@/features/team/data/mockTeamData";
import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";
import { useAzitFeedback } from "@/features/team/hooks/useAzitFeedback";
import { useAzitMedia } from "@/features/team/hooks/useAzitMedia";
import { useAzitRooms } from "@/features/team/hooks/useAzitRooms";

const FALLBACK_USER_ID = "1";
export function useAzitPageLogic() {
  const location = useLocation();
  const state = location.state as { azitId?: number } | null;
  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const [azits, setAzits] = React.useState(MOCK_MY_AZITS);
  const azitIconUrlsRef = React.useRef<string[]>([]);
  const currentUserId = FALLBACK_USER_ID;

  const currentUser =
    mockMembers.find((member) => String(member.id) === String(currentUserId)) ??
    ({
      id: String(currentUserId),
      nickname: "사용자",
      avatarUrl: "",
      isOnline: true,
    } as User);

  const {
    currentAzitId,
    setCurrentAzitId,
    schedules,
    handleStatusChange,
    addSchedule,
    markFeedbackDone,
  } = useAzitSchedules(currentUserId, mockSchedulesByAzit, mockMembersByAzit, currentUser);

  const {
    feedbackModal,
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
    getPendingFeedbacks,
  } = useAzitFeedback({
    schedules,
    currentUserId,
    currentUser,
    currentAzitId,
    markFeedbackDone,
  });

  const {
    clipsByAzit,
    createMediaItems,
    addClipsFromMedia,
    initAzitClips,
    ensureRoomClips,
    renameRoomClips,
    deleteRoomClips,
  } = useAzitMedia(mockClipsByAzit);

  const {
    selectedChatRoom,
    voiceRooms,
    textRooms,
    messages,
    setSelectedChatRoom,
    addChatRoom,
    renameVoiceRoom,
    deleteVoiceRoom,
    renameChatRoom,
    deleteChatRoom,
    addChatMessage: addRoomMessage,
    joinVoiceRoom,
    initAzitRooms,
  } = useAzitRooms(currentAzitId, currentUser);

  React.useEffect(() => {
    if (state?.azitId) {
      setCurrentAzitId(state.azitId);
    }
  }, [state?.azitId, setCurrentAzitId]);

  const currentAzit = azits.find((azit) => azit.id === currentAzitId) ?? azits[0];
  const currentMembers = mockMembersByAzit[currentAzitId] ?? [];
  const currentClips = clipsByAzit[currentAzitId]?.[selectedChatRoom] ?? [];
  const addChatMessage = React.useCallback(
    (roomName: string, content: string, files: File[]) => {
      const text = content.trim();
      if (!text && files.length === 0) return;

      const media = createMediaItems(files);

      addRoomMessage(roomName, text, media);
      addClipsFromMedia(currentAzitId, roomName, media);
    },
    [addClipsFromMedia, addRoomMessage, createMediaItems, currentAzitId]
  );


  React.useEffect(() => {
    return () => {
      azitIconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      azitIconUrlsRef.current = [];
    };
  }, []);

  const addAzit = React.useCallback(
    (name: string, iconUrl?: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const nextId =
        azits.reduce((max, azit) => Math.max(max, azit.id), 0) + 1;
      if (iconUrl) {
        azitIconUrlsRef.current.push(iconUrl);
      }
      const nextAzit = {
        id: nextId,
        name: trimmed,
        memberCount: 1,
        icon: iconUrl ?? "",
      };
      setAzits((prev) => [...prev, nextAzit]);
      initAzitRooms(nextId);
      initAzitClips(nextId);
      setCurrentAzitId(nextId);
    },
    [azits, initAzitClips, initAzitRooms, setCurrentAzitId]
  );

  const updateAzitIcon = React.useCallback(
    (azitId: number, iconUrl: string) => {
      if (!iconUrl) return;
      azitIconUrlsRef.current.push(iconUrl);
      setAzits((prev) =>
        prev.map((azit) =>
          azit.id === azitId ? { ...azit, icon: iconUrl } : azit
        )
      );
    },
    []
  );

  const updateAzitName = React.useCallback((azitId: number, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setAzits((prev) =>
      prev.map((azit) => (azit.id === azitId ? { ...azit, name: trimmed } : azit))
    );
  }, []);

  const handleAddChatRoom = React.useCallback(
    (name: string, type: "TEXT" | "VOICE") => {
      addChatRoom(name, type);
      if (type === "TEXT" && name.trim()) {
        ensureRoomClips(currentAzitId, name.trim());
      }
    },
    [addChatRoom, currentAzitId, ensureRoomClips]
  );

  const handleRenameChatRoom = React.useCallback(
    (roomName: string, nextName: string) => {
      renameChatRoom(roomName, nextName);
      const trimmed = nextName.trim();
      if (!trimmed || trimmed === roomName) return;
      renameRoomClips(currentAzitId, roomName, trimmed);
    },
    [currentAzitId, renameChatRoom, renameRoomClips]
  );

  const handleDeleteChatRoom = React.useCallback(
    (roomName: string) => {
      deleteChatRoom(roomName);
      deleteRoomClips(currentAzitId, roomName);
    },
    [currentAzitId, deleteChatRoom, deleteRoomClips]
  );

  return {
    state: {
      azits,
      currentAzitId,
      scheduleAnchorEl,
      selectedChatRoom,
      voiceRooms,
      messages,
      textRooms,
      currentAzit,
      currentMembers,
      currentClips,
      schedules,
      currentUserId,
      currentUser,
      feedbackModal,
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,
      setSelectedChatRoom,
      joinVoiceRoom,
      handleStatusChange,
      addSchedule,
      addChatRoom: handleAddChatRoom,
      renameVoiceRoom,
      deleteVoiceRoom,
      renameChatRoom: handleRenameChatRoom,
      deleteChatRoom: handleDeleteChatRoom,
      addChatMessage,
      addAzit,
      updateAzitIcon,
      updateAzitName,
      openFeedbackModal,
      closeFeedbackModal,
      submitFeedback,
      getPendingFeedbacks,
    },
  };
}
