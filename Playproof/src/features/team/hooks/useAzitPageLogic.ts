import React from "react";
import { useLocation } from "react-router-dom";
import type { User } from "@/features/team/types/types";
import {
  MOCK_MY_AZITS,
  mockMembers,
  mockClipsByAzit,
  mockMembersByAzit,
  mockSchedulesByAzit,
} from "@/features/team/data/mockTeamData";

import { useAuthStore } from "@/store/authStore";

import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";
import { useAzitFeedback } from "@/features/team/hooks/useAzitFeedback";
import { useAzitMedia } from "@/features/team/hooks/useAzitMedia";
import { useAzitRooms, type ChatMessage } from "@/features/team/hooks/useAzitRooms";
import { useAzitSocket } from "@/features/team/hooks/useAzitSocket";

import { getChatRoomsByAzit, getChatMessages, type ChatMessageResDto } from "@/features/team/api/chatApi";

const FALLBACK_USER_ID = "1";

function toUiMessage(dto: ChatMessageResDto): ChatMessage {
  return {
    id: String(dto.id),
    author: dto.nickname ?? `User ${dto.userId}`,
    content: dto.content,
    createdAt: dto.createdAt,
  };
}

export function useAzitPageLogic() {
  const location = useLocation();
  const state = location.state as { azitId?: number } | null;

  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const [azits, setAzits] = React.useState(MOCK_MY_AZITS);
  const azitIconUrlsRef = React.useRef<string[]>([]);
  const currentUserId = FALLBACK_USER_ID;

  const accessToken = useAuthStore((s) => s.accessToken);

  // ✅ myfit.my 전제
  const apiBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined)?.trim() || "https://myfit.my";

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

  const { clipsByAzit, createMediaItems, addClipsFromMedia, initAzitClips } = useAzitMedia(mockClipsByAzit);

  const {
    chatRooms,
    selectedChatRoomId,
    selectedChatRoomName,
    messages,
    setSelectedChatRoom,
    setChatRoomsFromServer,
    replaceMessagesForRoom,
    appendMessageToRoom,

    voiceRooms,
    joinVoiceRoom,
    toggleMyMic,
    initAzitRooms,
  } = useAzitRooms(currentAzitId, currentUser);

  // ✅ 소켓: newMessage 수신 → chatRoomId로 append
  const socket = useAzitSocket({
    apiBaseUrl,
    accessToken,
    enabled: true,
    onNewMessage: (data) => {
      const dto = data as Partial<ChatMessageResDto> | null;
      const roomId = Number(dto?.chatRoomId);
      if (!Number.isFinite(roomId)) return;
      if (!dto?.id || !dto?.content || !dto?.createdAt) return;

      appendMessageToRoom(roomId, toUiMessage(dto as ChatMessageResDto));
    },
  });

  React.useEffect(() => {
    if (state?.azitId) setCurrentAzitId(state.azitId);
  }, [state?.azitId, setCurrentAzitId]);

  const currentAzit = azits.find((azit) => azit.id === currentAzitId) ?? azits[0];
  const currentMembers = mockMembersByAzit[currentAzitId] ?? [];
  const currentClips = clipsByAzit[currentAzitId] ?? [];

  // ✅ (1) azit 변경 시: 채팅방 목록 로드
  React.useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    (async () => {
      try {
        const rooms = await getChatRoomsByAzit({
          apiBaseUrl,
          accessToken,
          azitId: currentAzitId,
        });

        if (cancelled) return;

        // TEXT만 우선(LeftPanel에서 일반 채팅)
        const textRooms = rooms
          .filter((r) => r.chatType === "TEXT")
          .map((r) => ({ id: r.id, roomName: r.roomName }));

        setChatRoomsFromServer(textRooms);
      } catch (e) {
        // 네트워크/서버가 아직 열려있지 않을 수 있으니 조용히 유지
        // 필요하면 toast 처리로 바꾸면 됨
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, accessToken, currentAzitId, setChatRoomsFromServer]);

  // ✅ (2) 선택된 채팅방이 바뀌면: 메시지 초기 로드 + join/leave
  const prevJoinedRoomIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!accessToken) return;
    if (!selectedChatRoomId) return;

    // leave previous
    const prev = prevJoinedRoomIdRef.current;
    if (prev && prev !== selectedChatRoomId) {
      socket.leaveRoom({ roomId: prev });
    }

    // join current (ack)
    void socket.joinRoom({ roomId: selectedChatRoomId }).then(() => {
      prevJoinedRoomIdRef.current = selectedChatRoomId;
    });

    // load messages (REST)
    let cancelled = false;
    (async () => {
      try {
        const list = await getChatMessages({
          apiBaseUrl,
          accessToken,
          roomId: selectedChatRoomId,
        });

        if (cancelled) return;
        replaceMessagesForRoom(
          selectedChatRoomId,
          list.messages.map(toUiMessage)
        );
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, accessToken, selectedChatRoomId, socket, replaceMessagesForRoom]);

  // ✅ (3) UI에서 send → 소켓 sendMessage (roomId=chatRoomId)
  const onSendMessage = React.useCallback(
    async (roomId: number, content: string, files: File[]) => {
      const text = content.trim();
      const hasFiles = files.length > 0;
      if (!text && !hasFiles) return;

      // 파일은 지금 단계에서는 로컬 프리뷰/하이라이트용만 유지
      const media = createMediaItems(files);
      if (media.length > 0) addClipsFromMedia(currentAzitId, media);

      // 소켓 전송(ack)
      await socket.sendMessage({ roomId, content: text });

      // newMessage는 서버가 브로드캐스트하므로,
      // 여기서 낙관적 append를 굳이 안 해도 됨.
      // (ACK 기반 낙관적 업데이트를 원하면 여기서 append해도 됨)
    },
    [addClipsFromMedia, createMediaItems, currentAzitId, socket]
  );

  React.useEffect(() => {
    return () => {
      azitIconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      azitIconUrlsRef.current = [];
      socket.disconnect();
    };
  }, [socket]);

  const addAzit = React.useCallback(
    (name: string, iconUrl?: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      const nextId = azits.reduce((max, azit) => Math.max(max, azit.id), 0) + 1;

      if (iconUrl) azitIconUrlsRef.current.push(iconUrl);

      const nextAzit = { id: nextId, name: trimmed, memberCount: 1, icon: iconUrl ?? "" };

      setAzits((prev) => [...prev, nextAzit]);
      initAzitRooms(nextId);
      initAzitClips(nextId);
      setCurrentAzitId(nextId);
    },
    [azits, initAzitClips, initAzitRooms, setCurrentAzitId]
  );

  return {
    state: {
      azits,
      currentAzitId,
      scheduleAnchorEl,

      // chat
      chatRooms,
      selectedChatRoomId,
      selectedChatRoomName,
      messages,

      // voice
      voiceRooms,

      currentAzit,
      currentMembers,
      currentClips,
      schedules,
      currentUserId,
      currentUser,
      feedbackModal,

      // socket 상태
      socketStatus: socket.status,
      socketId: socket.socketId,
      socketError: socket.lastError,
      socketConnected: socket.isConnected,
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,

      // chat
      setSelectedChatRoom,
      onSendMessage,

      // schedule/feedback
      handleStatusChange,
      addSchedule,
      openFeedbackModal,
      closeFeedbackModal,
      submitFeedback,
      getPendingFeedbacks,

      // voice (UI만)
      joinVoiceRoom,
      toggleMyMic,

      // azit
      addAzit,
    },
  };
}
