// src/features/team/hooks/useAzitPageLogic.ts

import React from "react";
import { useLocation } from "react-router-dom";

import type { User } from "@/features/team/types/types";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/authApi";

import { mockMembers } from "@/features/team/data/mockTeamData";

import { getAzits, updateAzit } from "@/features/team/api/azitApi";
import { getAzitMembers, mapAzitMembersToUsers } from "@/features/team/api/azitMemberApi";

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
  uploadChatImage,
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
    userId: userId != null ? String(userId) : undefined,
    author: nickname ?? (userId != null ? `User ${String(userId)}` : "Unknown"),
    content: (dto as unknown as { content: string }).content,
    mediaUrls: (dto as unknown as { mediaUrls?: string[] }).mediaUrls,
    createdAt: (dto as unknown as { createdAt: string }).createdAt,
  };
}

export function useAzitPageLogic() {
  const location = useLocation();
  const routeState = location.state as { azitId?: number } | null;

  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const [azits, setAzits] = React.useState([]);
  const [membersByAzit, setMembersByAzit] = React.useState<Record<number, User[]>>({});
  const azitIconUrlsRef = React.useRef<string[]>([]);
  
  // Auth Store 정보 가져오기
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
    const foundMock = mockMembers.find((m) => String(m.id) === FALLBACK_USER_ID);
    return (
      foundMock ?? {
        id: FALLBACK_USER_ID,
        nickname: "게스트",
        avatarUrl: "",
        isOnline: true,
      }
    );
  }, [accessToken, authUserId, authNickname]);

  // 자동 로그인 로직
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
        console.log("✅ [AutoLogin] 성공! 닉네임:", res.nickname);
        setAuth({
          accessToken: res.accessToken,
          userId: res.userId,
          nickname: res.nickname,
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
        const list = await getAzits();
        if (!alive) return;
        setAzits(list);
        if (list.length > 0) {
          const exists = list.some((a) => a.id === currentAzitId);
          if (!exists) setCurrentAzitId(list[0].id);
        }
      } catch (err) {
        console.error("아지트 목록 조회 실패:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId, setCurrentAzitId]);

  React.useEffect(() => {
    if (!accessToken || !currentAzitId) return;
    let alive = true;
    (async () => {
      try {
        const res = await getAzitMembers({ azitId: currentAzitId, page: 1, size: 50 });
        if (!alive) return;
        const users = mapAzitMembersToUsers(res.members ?? []);
        setMembersByAzit((prev) => ({ ...prev, [currentAzitId]: users }));
        setAzits((prev) =>
          prev.map((azit) =>
            azit.id === currentAzitId
              ? { ...azit, memberCount: users.length }
              : azit
          )
        );
      } catch (err) {
        console.error("아지트 멤버 조회 실패:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken, currentAzitId]);

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
    addClipsFromMedia,
    replaceClipsFromMedia,
    initAzitClips,
  } = useAzitMedia({});

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
    myVoiceRoomId,
    joinVoiceRoom: joinVoiceRoomUI, 
    leaveVoiceRoom,
    toggleMyMic,
    initAzitRooms,
  } = useAzitRooms(currentAzitId, currentUser);

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

      if (msg.mediaUrls && msg.mediaUrls.length > 0) {
        const isMine = String(msg.userId) === String(currentUserId);
        if (!isMine) {
          const roomName =
            chatRooms.find((room) => room.id === msg.chatRoomId)?.roomName ??
            selectedChatRoomName ??
            "자유 대화";
          const mediaItems = msg.mediaUrls.map((url) => ({
            url,
            type: url.match(/\.(mp4|mov|webm)(\?|$)/i) ? ("video" as const) : ("image" as const),
          }));
          addClipsFromMedia(currentAzitId, roomName, mediaItems);
        }
      }
    },
    onError: (err) => {
      setSocketUiError(err);
    },
  });

  const { requestVoiceToken } = useAzitVoiceToken({ apiBaseUrl, accessToken });
  const { connect: connectLiveKit, disconnect: disconnectLiveKit } = useAzitLivekitVoice();

  // 음성 방 입장 로직
  const joinVoiceRoom = React.useCallback(async (roomIdStr: string) => {
    const roomId = Number(roomIdStr);
    if (!roomId) return;

    try {
      if (!accessToken) {
        alert("로그인 중입니다... 잠시 후 다시 시도해주세요.");
        return;
      }

      if (myVoiceRoomId && myVoiceRoomId === roomIdStr) {
        await socketVoiceLeave(roomId);
        disconnectLiveKit();
        leaveVoiceRoom();
        return;
      }

      console.log(`🎤 [Voice] 방(${roomId}) 입장 프로세스 시작`);
      await socketVoiceJoin(roomId);
      console.log("   Step 1: 소켓 입장 알림 완료");

      // 토큰 발급 (여기서 내 진짜 닉네임과 ID를 알 수 있음!)
      const tokenData = await requestVoiceToken(roomId);
      if (!tokenData) {
        console.error("❌ Voice Token 발급 실패");
        return;
      }
      console.log("   Step 2: 토큰 발급 완료. 내 정보:", tokenData.name);

      // ✅ [핵심 수정] 토큰에서 받은 정보로 내 정보(Auth Store)를 즉시 복구/갱신
      if (tokenData.name && tokenData.identity) {
        setAuth({
          accessToken: accessToken, // 기존 토큰 유지
          userId: Number(tokenData.identity),
          nickname: tokenData.name
        });
      }

      const success = await connectLiveKit(tokenData);
      
      if (success) {
        console.log("✅ Step 3: LiveKit 연결 성공!");
        
        // ✅ [핵심 수정] UI 업데이트 시, 갱신된 유저 정보를 직접 만들어서 전달
        // (Store 업데이트가 비동기라 UI에 바로 반영 안 될 수 있으므로)
        const updatedMe: User = {
          id: tokenData.identity,
          nickname: tokenData.name, // "홍길동"
          avatarUrl: "",
          isOnline: true
        };
        
        joinVoiceRoomUI(roomIdStr, updatedMe); 
      } else {
        console.error("❌ LiveKit 연결 실패");
      }

    } catch (err) {
      console.error("🔥 음성 채팅 연결 중 에러:", err);
    }
  }, [socketVoiceJoin, socketVoiceLeave, requestVoiceToken, connectLiveKit, disconnectLiveKit, accessToken, joinVoiceRoomUI, leaveVoiceRoom, myVoiceRoomId, setAuth]); 

  React.useEffect(() => {
    if (routeState?.azitId) setCurrentAzitId(routeState.azitId);
  }, [routeState?.azitId, setCurrentAzitId]);

  const currentAzit = azits.find((a) => a.id === currentAzitId) ?? azits[0];
  const currentMembers = membersByAzit[currentAzitId] ?? [];
  const currentClips =
    clipsByAzit[currentAzitId]?.[selectedChatRoomName || "자유 대화"] ?? [];

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
             users: [] 
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
    if (!selectedChatRoomId || !accessToken) return;
    (async () => {
      try {
        const list = await getChatMessages({
          apiBaseUrl,
          accessToken,
          roomId: selectedChatRoomId,
        });
        replaceMessagesForRoom(selectedChatRoomId, list.messages.map(toUiMessage));

        const roomName = selectedChatRoomName || "자유 대화";
        const mediaItems = list.messages
          .filter((msg) => Array.isArray(msg.mediaUrls) && msg.mediaUrls.length > 0)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .flatMap((msg) => {
            const dateLabel = new Date(msg.createdAt).toLocaleDateString("ko-KR");
            return (msg.mediaUrls ?? []).map((url, idx) => ({
              id: `${msg.id}-${idx}`,
              url,
              type: url.match(/\.(mp4|mov|webm)(\?|$)/i)
                ? ("video" as const)
                : ("image" as const),
              dateLabel,
            }));
          });

        replaceClipsFromMedia(currentAzitId, roomName, mediaItems);
      } catch {
        // ignore
      }
    })();
  }, [
    apiBaseUrl,
    accessToken,
    currentAzitId,
    replaceClipsFromMedia,
    replaceMessagesForRoom,
    selectedChatRoomId,
    selectedChatRoomName,
  ]);

  const onSendMessage = React.useCallback(
    async (roomId: number, content: string, files: File[]) => {
      const text = content.trim();
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const rejected = files.filter((file) => !file.type.startsWith("image/"));
      if (rejected.length > 0) {
        alert("이미지 파일만 전송할 수 있어요.");
      }

      if (!text && imageFiles.length === 0) return;
      if (!accessToken) return;

      let mediaUrls: string[] = [];
      if (imageFiles.length > 0) {
        mediaUrls = await Promise.all(
          imageFiles.map((file) =>
            uploadChatImage({ apiBaseUrl, accessToken, roomId, file }).then((res) => res.mediaUrl)
          )
        );
        if (mediaUrls.length > 0) {
          const mediaItems = mediaUrls.map((url) => ({ url, type: "image" as const }));
          addClipsFromMedia(currentAzitId, selectedChatRoomName ?? "자유 대화", mediaItems);
        }
      }

      await sendSocketMessage(roomId, text, mediaUrls.length > 0 ? mediaUrls : undefined);
    },
    [accessToken, addClipsFromMedia, apiBaseUrl, currentAzitId, selectedChatRoomName, sendSocketMessage]
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
        console.error("채팅방 이름 수정 실패:", err);
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
        console.error("채팅방 삭제 실패:", err);
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
      const numericRoomId = Number(roomId);
      if (Number.isNaN(numericRoomId)) return;
      try {
        await updateChatRoom({ apiBaseUrl, accessToken, roomId: numericRoomId, name: trimmed });
      } catch (err) {
        console.error("음성 채팅방 이름 수정 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, reloadChatRooms, setVoiceRoomsFromServer, voiceRooms]
  );

  const onDeleteVoiceRoom = React.useCallback(
    async (roomId: string) => {
      const prevRooms = voiceRooms;
      setVoiceRoomsFromServer(prevRooms.filter((room) => room.id !== roomId));
      if (!accessToken) return;
      const numericRoomId = Number(roomId);
      if (Number.isNaN(numericRoomId)) return;
      try {
        await deleteChatRoom({ apiBaseUrl, accessToken, roomId: numericRoomId });
      } catch (err) {
        console.error("음성 채팅방 삭제 실패:", err);
        await reloadChatRooms();
      }
    },
    [accessToken, apiBaseUrl, reloadChatRooms, setVoiceRoomsFromServer, voiceRooms]
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

  const updateAzitName = React.useCallback(
    async (azitId: number, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return;
      try {
        const updated = await updateAzit(azitId, { azit_name: trimmed });
        setAzits((prev) =>
          prev.map((azit) =>
            azit.id === azitId
              ? { ...azit, name: updated.azit_name }
              : azit
          )
        );
      } catch (err) {
        console.error("아지트 이름 수정 실패:", err);
      }
    },
    []
  );

  const updateAzitIcon = React.useCallback(
    async (azitId: number, file: File) => {
      if (!file) return;
      try {
        const updated = await updateAzit(azitId, { azit_icon: file });
        setAzits((prev) =>
          prev.map((azit) =>
            azit.id === azitId
              ? {
                  ...azit,
                  icon: updated.azit_icon_url ?? azit.icon,
                }
              : azit
          )
        );
      } catch (err) {
        console.error("아지트 아이콘 수정 실패:", err);
      }
    },
    []
  );

  const updateAzitSettings = React.useCallback(
    async (azitId: number, payload: { name?: string; file?: File | null }) => {
      const trimmedName = payload.name?.trim();
      if (!trimmedName && !payload.file) return;
      try {
        const updated = await updateAzit(azitId, {
          azit_name: trimmedName ?? undefined,
          azit_icon: payload.file ?? undefined,
        });
        setAzits((prev) =>
          prev.map((azit) =>
            azit.id === azitId
              ? {
                  ...azit,
                  name: updated.azit_name ?? azit.name,
                  icon: updated.azit_icon_url ?? azit.icon,
                }
              : azit
          )
        );
      } catch (err) {
        console.error("아지트 설정 변경 실패:", err);
      }
    },
    []
  );

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
      updateAzitSettings,
    },
  };
}
