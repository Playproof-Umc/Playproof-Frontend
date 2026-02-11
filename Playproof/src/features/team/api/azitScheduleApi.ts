// src/features/team/hooks/useAzitPageLogic.ts

import React from "react";
import { useLocation } from "react-router-dom";

import type { User } from "@/features/team/types/types";
import type { Azit } from "@/features/team/types";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/authApi";
import { getAzits, updateAzit } from "@/features/team/api/azitApi";
import { getAzitMembers } from "@/features/team/api/azitMemberApi";

import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";
import { useAzitFeedback } from "@/features/team/hooks/useAzitFeedback";
import { useAzitMedia } from "@/features/team/hooks/useAzitMedia";
import { useAzitRooms, type ChatMessageUI } from "@/features/team/hooks/useAzitRooms";

import { useAzitSocket, type ApiError, type ChatMessage } from "@/features/team/hooks/useAzitSocket";
import { useAzitVoiceToken } from "@/features/team/hooks/useAzitVoiceToken";
import { useAzitLivekitVoice } from "@/features/team/hooks/useAzitLivekitVoice";

import {
  getChatRoomsByAzit,
  getChatMessages,
  createChatRoomByAzit,
  updateChatRoom,
  deleteChatRoom,
  type ChatMessageResDto,
} from "@/features/team/api/chatApi";

import type { ChatRoomCreateData } from "@/features/team/components/azit/chat/ChatRoomCreateModal";

const FALLBACK_USER_ID = "1";

function toUiMessage(dto: ChatMessageResDto | ChatMessage): ChatMessageUI {
  const nickname = (dto as unknown as { nickname?: string | null }).nickname;
  const userId = (dto as unknown as { userId?: number | string }).userId;

  return {
    id: String((dto as unknown as { id: number | string }).id),
    author: nickname ?? (userId != null ? `User ${String(userId)}` : "Unknown"),
    content: (dto as unknown as { content: string }).content,
    createdAt: (dto as unknown as { createdAt: string }).createdAt,
  };
}

export function useAzitPageLogic() {
  const location = useLocation();
  const routeState = location.state as { azitId?: number } | null;

  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const [azits, setAzits] = React.useState<Azit[]>([]);
  const azitIconUrlsRef = React.useRef<string[]>([]);

  const { accessToken, userId: authUserId, nickname: authNickname, setAuth } = useAuthStore();
  const isAutoLoggingIn = React.useRef(false);

  const apiBaseUrl =
    ((import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_API_BASE_URL as string | undefined)?.trim() ||
    "https://myfit.my";

  const currentUserId = authUserId ? String(authUserId) : FALLBACK_USER_ID;

  const currentUser = React.useMemo(() => {
    if (accessToken) {
      return {
        id: String(authUserId),
        nickname: authNickname || "알 수 없음",
        avatarUrl: "",
        isOnline: true,
      } as User;
    }
    return {
      id: FALLBACK_USER_ID,
      nickname: "게스트",
      avatarUrl: "",
      isOnline: true,
    };
  }, [accessToken, authUserId, authNickname]);

  React.useEffect(() => {
    if (accessToken || isAutoLoggingIn.current) return;

    const devPhone = import.meta.env.VITE_DEV_PHONE;
    const devPassword = import.meta.env.VITE_DEV_PASSWORD;

    if (!devPhone || !devPassword) return;

    const tryAutoLogin = async () => {
      try {
        isAutoLoggingIn.current = true;
        console.log(`🔐 [AutoLogin] 시도 중...`);
        const digits = devPhone.replace(/\D/g, "");
        const formattedPhone = digits.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        const res = await login({
          phone: formattedPhone,
          password: devPassword,
        });
        console.log("✅ [AutoLogin] 성공! 닉네임:", res.data.nickname);
        setAuth({
          accessToken: res.data.accessToken,
          userId: res.data.userId,
          nickname: res.data.nickname,
        });
      } catch (err) {
        console.error("❌ [AutoLogin] 실패:", err);
      } finally {
        isAutoLoggingIn.current = false;
      }
    };
    tryAutoLogin();
  }, [accessToken, setAuth]);

  const {
    currentAzitId,
    setCurrentAzitId,
    schedules,
    handleStatusChange,
    addSchedule,
    markFeedbackDone,
  } = useAzitSchedules(currentUserId, currentUser, accessToken);

  React.useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    (async () => {
      try {
        const data = await getAzits();
        if (!alive) return;
        if (data.length > 0) {
          setAzits(data);
          if (!data.some((a) => a.id === currentAzitId)) {
            setCurrentAzitId(data[0].id);
          }
        }
      } catch (err) {
        console.error("아지트 목록 로드 실패:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId, setCurrentAzitId]);

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

  const { clipsByAzit, createMediaItems, addClipsFromMedia, initAzitClips } = useAzitMedia({});

  const {
    chatRooms,
    selectedChatRoomId,
    selectedChatRoomName,
    messages,
    setChatRoomsFromServer,
    setVoiceRoomsFromServer,
    setSelectedChatRoom,
    replaceMessagesForRoom,
    appendMessageToRoom,
    voiceRooms,
    joinVoiceRoom: joinVoiceRoomUI,
    leaveVoiceRoom,
    toggleMyMic,
    initAzitRooms,
  } = useAzitRooms(currentAzitId, currentUser);

  const myVoiceRoomId = React.useMemo(() => {
    const meId = String(currentUser.id);
    return voiceRooms.find((room) => room.users.some((m) => String(m.user.id) === meId))?.id ?? null;
  }, [currentUser.id, voiceRooms]);

  const [socketUiError, setSocketUiError] = React.useState<ApiError | null>(null);

  const {
    socket,
    isConnected,
    currentRoomId,
    lastError,
    sendMessage: sendSocketMessage,
    voiceJoin: socketVoiceJoin,
    voiceLeave: socketVoiceLeave,
  } = useAzitSocket({
    roomId: selectedChatRoomId ?? undefined,
    onMessage: (msg) => {
      appendMessageToRoom(msg.chatRoomId, toUiMessage(msg));
    },
    onError: (err) => {
      setSocketUiError(err);
    },
  });

  const { requestVoiceToken } = useAzitVoiceToken({ apiBaseUrl, accessToken });
  const { connect: connectLiveKit, disconnect: disconnectLiveKit } = useAzitLivekitVoice();

  const joinVoiceRoom = React.useCallback(
    async (roomIdStr: string) => {
      if (myVoiceRoomId && myVoiceRoomId === roomIdStr) {
        const roomId = Number(roomIdStr);
        if (roomId) {
          socketVoiceLeave(roomId);
        }
        disconnectLiveKit();
        leaveVoiceRoom();
        return;
      }
      const roomId = Number(roomIdStr);
      if (!roomId) return;

      try {
        if (!accessToken) {
          alert("로그인 중입니다... 잠시 후 다시 시도해주세요.");
          return;
        }

        console.log(`🎤 [Voice] 방(${roomId}) 입장 프로세스 시작`);
        await socketVoiceJoin(roomId);
        console.log("   Step 1: 소켓 입장 알림 완료");

        const tokenData = await requestVoiceToken(roomId);
        if (!tokenData) {
          console.error("❌ Voice Token 발급 실패");
          return;
        }
        console.log("   Step 2: 토큰 발급 완료. 내 정보:", tokenData.name);

        if (tokenData.name && tokenData.identity) {
          setAuth({
            accessToken: accessToken,
            userId: Number(tokenData.identity),
            nickname: tokenData.name,
          });
        }

        const success = await connectLiveKit(tokenData);

        if (success) {
          console.log("✅ Step 3: LiveKit 연결 성공!");
          const updatedMe: User = {
            id: tokenData.identity,
            nickname: tokenData.name,
            avatarUrl: "",
            isOnline: true,
          };
          joinVoiceRoomUI(roomIdStr, updatedMe);
        } else {
          console.error("❌ LiveKit 연결 실패");
        }
      } catch (err) {
        console.error("🔥 음성 채팅 연결 중 에러:", err);
      }
    },
    [
      socketVoiceLeave,
      disconnectLiveKit,
      leaveVoiceRoom,
      myVoiceRoomId,
      socketVoiceJoin,
      requestVoiceToken,
      connectLiveKit,
      accessToken,
      joinVoiceRoomUI,
      setAuth,
    ]
  );

  React.useEffect(() => {
    if (routeState?.azitId) setCurrentAzitId(routeState.azitId);
  }, [routeState?.azitId, setCurrentAzitId]);

  const currentAzit =
    azits.find((a) => a.id === currentAzitId) ??
    azits[0] ?? { id: 0, name: "", icon: "", memberCount: 0 };

  const [membersByAzit, setMembersByAzit] = React.useState<Record<number, User[]>>({});
  const currentMembers = membersByAzit[currentAzitId] ?? [];
  const currentClips = clipsByAzit[currentAzitId] ?? [];

  const reloadChatRooms = React.useCallback(async () => {
    if (!accessToken) return;
    try {
      const rooms = await getChatRoomsByAzit({
        apiBaseUrl,
        accessToken,
        azitId: currentAzitId,
      });

      const textRooms = rooms
        .filter((r: any) => r.chatType === "TEXT")
        .map((r: any) => ({ id: r.id, roomName: r.roomName }));
      setChatRoomsFromServer(textRooms);

      if (setVoiceRoomsFromServer) {
        const voiceRoomsData = rooms
          .filter((r: any) => r.chatType === "VOICE")
          .map((r: any) => ({
            id: String(r.id),
            name: r.roomName,
            users: [],
          }));
        setVoiceRoomsFromServer(voiceRoomsData);
      }
    } catch (e) {
      console.error("채팅방 목록 로드 실패", e);
    }
  }, [apiBaseUrl, accessToken, currentAzitId, setChatRoomsFromServer, setVoiceRoomsFromServer]);

  React.useEffect(() => {
    reloadChatRooms();
  }, [reloadChatRooms]);

  React.useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    (async () => {
      try {
        const res = await getAzitMembers({ azitId: currentAzitId, page: 1, size: 50 });
        if (!alive) return;
        const members: User[] = res.members.map((m) => ({
          id: String(m.member_id),
          nickname: m.nickname ?? "Unknown",
          avatarUrl: m.avatar_url ?? "",
          isOnline: true,
        }));
        setMembersByAzit((prev) => ({ ...prev, [currentAzitId]: members }));
      } catch (err) {
        console.error("아지트 멤버 조회 실패:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId]);

  React.useEffect(() => {
    if (!selectedChatRoomId || !accessToken) return;
    (async () => {
      try {
        const list = await getChatMessages({
          apiBaseUrl,
          accessToken,
          roomId: selectedChatRoomId,
        });
        replaceMessagesForRoom(selectedChatRoomId, list.messages.map(toUiMessage));
      } catch {
        // ignore
      }
    })();
  }, [apiBaseUrl, accessToken, selectedChatRoomId, replaceMessagesForRoom]);

  const onSendMessage = React.useCallback(
    async (roomId: number, content: string, files: File[]) => {
      const text = content.trim();
      const media = createMediaItems(files);
      if (!text && media.length === 0) return;
      if (media.length > 0) {
        addClipsFromMedia(currentAzitId, selectedChatRoomName ?? "자유 대화", media);
      }
      await sendSocketMessage(roomId, text);
    },
    [addClipsFromMedia, createMediaItems, currentAzitId, selectedChatRoomName, sendSocketMessage]
  );

  const onCreateChatRoom = React.useCallback(
    async (data: ChatRoomCreateData) => {
      if (!accessToken) return;
      const { name, type, isPrivate } = data;
      const trimmed = name.trim();
      if (!trimmed) return;

      try {
        const created = (await createChatRoomByAzit({
          apiBaseUrl,
          accessToken,
          azitId: currentAzitId,
          name: trimmed,
          type,
          isPrivate,
        })) as any;

        console.log("✅ 채팅방 생성 성공:", created);
        await reloadChatRooms();

        const newRoomId = created.id || created.roomId;
        if (newRoomId && type === "TEXT") {
          setSelectedChatRoom(newRoomId);
        }
      } catch (err) {
        console.error("❌ 채팅방 생성 실패:", err);
        alert("채팅방 생성에 실패했습니다.");
      }
    },
    [accessToken, apiBaseUrl, currentAzitId, reloadChatRooms, setSelectedChatRoom]
  );

  const onRenameChatRoom = React.useCallback(
    async (roomId: number, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return;
      const prevRooms = chatRooms;
      setChatRoomsFromServer(
        prevRooms.map((room) => (room.id === roomId ? { ...room, roomName: trimmed } : room))
      );
      if (!accessToken) return;
      try {
        await updateChatRoom({ apiBaseUrl, accessToken, roomId, name: trimmed });
      } catch (err) {
        console.error("❌ 채팅방 이름 수정 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, chatRooms, reloadChatRooms, setChatRoomsFromServer]
  );

  const onDeleteChatRoom = React.useCallback(
    async (roomId: number) => {
      const prevRooms = chatRooms;
      setChatRoomsFromServer(prevRooms.filter((room) => room.id !== roomId));
      if (!accessToken) return;
      try {
        await deleteChatRoom({ apiBaseUrl, accessToken, roomId });
      } catch (err) {
        console.error("❌ 채팅방 삭제 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, chatRooms, reloadChatRooms, setChatRoomsFromServer]
  );

  const onRenameVoiceRoom = React.useCallback(
    async (roomId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return;
      const prevRooms = voiceRooms;
      setVoiceRoomsFromServer(
        prevRooms.map((room) => (room.id === roomId ? { ...room, name: trimmed } : room))
      );
      if (!accessToken) return;
      if (Number.isNaN(Number(roomId))) return;
      try {
        await updateChatRoom({ apiBaseUrl, accessToken, roomId, name: trimmed });
      } catch (err) {
        console.error("❌ 음성 채팅방 이름 수정 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, voiceRooms, reloadChatRooms, setVoiceRoomsFromServer]
  );

  const onDeleteVoiceRoom = React.useCallback(
    async (roomId: string) => {
      const prevRooms = voiceRooms;
      setVoiceRoomsFromServer(prevRooms.filter((room) => room.id !== roomId));
      if (!accessToken) return;
      if (Number.isNaN(Number(roomId))) return;
      try {
        await deleteChatRoom({ apiBaseUrl, accessToken, roomId });
      } catch (err) {
        console.error("❌ 음성 채팅방 삭제 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, voiceRooms, reloadChatRooms, setVoiceRoomsFromServer]
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
      const nextId = azits.reduce((max, a) => Math.max(max, a.id), 0) + 1;
      if (iconUrl) azitIconUrlsRef.current.push(iconUrl);
      const nextAzit = { id: nextId, name: trimmed, memberCount: 1, icon: iconUrl ?? "" };
      setAzits((prev) => [...prev, nextAzit]);
      initAzitRooms(nextId);
      initAzitClips(nextId);
      setCurrentAzitId(nextId);
    },
    [azits, initAzitClips, initAzitRooms, setCurrentAzitId]
  );

  const updateAzitName = React.useCallback(async (azitId: number, nextName: string) => {
    const trimmed = nextName.trim();
    if (!trimmed) return;
    try {
      const updated = await updateAzit(azitId, { azit_name: trimmed });
      setAzits((prev) =>
        prev.map((azit) => (azit.id === azitId ? { ...azit, name: updated.azit_name ?? trimmed } : azit))
      );
    } catch (err) {
      console.error("아지트 이름 수정 실패", err);
    }
  }, []);

  const updateAzitIcon = React.useCallback(async (azitId: number, file: File) => {
    if (!file) return;
    try {
      const updated = await updateAzit(azitId, { azit_icon: file });
      setAzits((prev) =>
        prev.map((azit) =>
          azit.id === azitId ? { ...azit, icon: updated.azit_icon_url ?? azit.icon } : azit
        )
      );
    } catch (err) {
      console.error("아지트 아이콘 수정 실패", err);
    }
  }, []);

  return {
    state: {
      azits,
      currentAzitId,
      scheduleAnchorEl,
      currentAzit,
      currentMembers,
      currentClips,
      schedules,
      currentUserId,
      currentUser,
      feedbackModal,
      chatRooms,
      selectedChatRoomId,
      selectedChatRoomName,
      messages,
      voiceRooms,
      socketStatus: isConnected ? "connected" : "disconnected",
      socketId: socket.current?.id ?? null,
      socketConnected: isConnected,
      socketErrorText: lastError?.message ?? null,
      socketUiError,
      currentRoomId,
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,
      setSelectedChatRoom,
      onSendMessage,
      onCreateChatRoom,
      onRenameChatRoom,
      onDeleteChatRoom,
      onRenameVoiceRoom,
      onDeleteVoiceRoom,
      handleStatusChange,
      addSchedule,
      openFeedbackModal,
      closeFeedbackModal,
      submitFeedback,
      getPendingFeedbacks,
      joinVoiceRoom,
      toggleMyMic,
      addAzit,
      updateAzitName,
      updateAzitIcon,
    },
  };
}
