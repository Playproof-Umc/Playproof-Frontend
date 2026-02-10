import React from "react";
import type { User } from "@/features/team/types/types";

export type ChatRoomSummary = {
  id: number;        // chatRoomId
  roomName: string;
};

export type ChatMessageUI = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type VoiceRoomMember = {
  user: User;
  micOn: boolean;
};

export type VoiceRoom = {
  id: string;
  name: string;
  users: VoiceRoomMember[];
};

const createDefaultVoiceRooms = (): VoiceRoom[] => [{ id: "voice-lobby", name: "로비", users: [] }];

export const useAzitRooms = (currentAzitId: number, currentUser: User) => {
  const [chatRoomsByAzit, setChatRoomsByAzit] = React.useState<Record<number, ChatRoomSummary[]>>({
    1: [],
    2: [],
    3: [],
  });

  const [selectedChatRoomIdByAzit, setSelectedChatRoomIdByAzit] = React.useState<Record<number, number | null>>({
    1: null,
    2: null,
    3: null,
  });

  const [messagesByAzit, setMessagesByAzit] = React.useState<Record<number, Record<number, ChatMessageUI[]>>>({
    1: {},
    2: {},
    3: {},
  });

  // voice (UI 상태)
  const [voiceRoomsByAzit, setVoiceRoomsByAzit] = React.useState<Record<number, VoiceRoom[]>>({
    1: createDefaultVoiceRooms(),
    2: createDefaultVoiceRooms(),
    3: createDefaultVoiceRooms(),
  });

  const [myVoiceRoomIdByAzit, setMyVoiceRoomIdByAzit] = React.useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
  });

  const chatRooms = chatRoomsByAzit[currentAzitId] ?? [];
  const selectedChatRoomId = selectedChatRoomIdByAzit[currentAzitId] ?? null;

  const selectedChatRoomName = React.useMemo(() => {
    if (!selectedChatRoomId) return "";
    return chatRooms.find((r) => r.id === selectedChatRoomId)?.roomName ?? "";
  }, [chatRooms, selectedChatRoomId]);

  const messages =
    selectedChatRoomId && messagesByAzit[currentAzitId]?.[selectedChatRoomId]
      ? messagesByAzit[currentAzitId][selectedChatRoomId]
      : [];

  // ✅ 텍스트 채팅방 목록 업데이트
  const setChatRoomsFromServer = React.useCallback(
    (rooms: ChatRoomSummary[]) => {
      setChatRoomsByAzit((prev) => ({ ...prev, [currentAzitId]: rooms }));

      setMessagesByAzit((prev) => {
        const byAzit = { ...(prev[currentAzitId] ?? {}) };
        for (const r of rooms) {
          if (!byAzit[r.id]) byAzit[r.id] = [];
        }
        return { ...prev, [currentAzitId]: byAzit };
      });

      setSelectedChatRoomIdByAzit((prev) => {
        const cur = prev[currentAzitId] ?? null;
        if (cur && rooms.some((r) => r.id === cur)) return prev;
        // 방이 있으면 첫 번째 방 선택, 없으면 null
        return { ...prev, [currentAzitId]: rooms[0]?.id ?? null };
      });
    },
    [currentAzitId]
  );

  // ✅ [추가됨] 음성 채팅방 목록 업데이트 함수
  const setVoiceRoomsFromServer = React.useCallback(
    (rooms: VoiceRoom[]) => {
      setVoiceRoomsByAzit((prev) => ({ ...prev, [currentAzitId]: rooms }));
    },
    [currentAzitId]
  );

  const setSelectedChatRoom = React.useCallback(
    (roomId: number) => {
      setSelectedChatRoomIdByAzit((prev) => ({ ...prev, [currentAzitId]: roomId }));
      setMessagesByAzit((prev) => {
        const byAzit = prev[currentAzitId] ?? {};
        if (byAzit[roomId]) return prev;
        return { ...prev, [currentAzitId]: { ...byAzit, [roomId]: [] } };
      });
    },
    [currentAzitId]
  );

  const replaceMessagesForRoom = React.useCallback(
    (roomId: number, next: ChatMessageUI[]) => {
      setMessagesByAzit((prev) => {
        const byAzit = prev[currentAzitId] ?? {};
        return { ...prev, [currentAzitId]: { ...byAzit, [roomId]: next } };
      });
    },
    [currentAzitId]
  );

  const appendMessageToRoom = React.useCallback(
    (roomId: number, msg: ChatMessageUI) => {
      setMessagesByAzit((prev) => {
        const byAzit = prev[currentAzitId] ?? {};
        const list = byAzit[roomId] ?? [];
        return { ...prev, [currentAzitId]: { ...byAzit, [roomId]: [msg, ...list] } };
      });
    },
    [currentAzitId]
  );

  // voice (목업 + 상태 관리)
  const voiceRooms = voiceRoomsByAzit[currentAzitId] ?? createDefaultVoiceRooms();
  const myVoiceRoomId = myVoiceRoomIdByAzit[currentAzitId] ?? null;

  const joinVoiceRoom = React.useCallback(
    (roomId: string) => {
      const me = currentUser;

      setVoiceRoomsByAzit((prev) => {
        const nextState: Record<number, VoiceRoom[]> = {};
        Object.entries(prev).forEach(([azitKey, rooms]) => {
          // 다른 방에서 나를 제거
          nextState[Number(azitKey)] = rooms.map((room) => ({
            ...room,
            users: room.users.filter((m) => String(m.user.id) !== String(me.id)),
          }));
        });

        // 현재 방에 나를 추가
        const targetRooms = nextState[currentAzitId] ?? createDefaultVoiceRooms();
        nextState[currentAzitId] = targetRooms.map((room) =>
          room.id === roomId ? { ...room, users: [...room.users, { user: me, micOn: true }] } : room
        );

        return nextState;
      });

      setMyVoiceRoomIdByAzit((prev) => ({ ...prev, [currentAzitId]: roomId }));
    },
    [currentAzitId, currentUser]
  );

  const toggleMyMic = React.useCallback(
    (roomId?: string) => {
      const me = currentUser;
      const target = roomId ?? myVoiceRoomIdByAzit[currentAzitId] ?? null;
      if (!target) return;

      setVoiceRoomsByAzit((prev) => {
        const rooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
        const nextRooms = rooms.map((room) => {
          if (room.id !== target) return room;
          return {
            ...room,
            users: room.users.map((m) =>
              String(m.user.id) === String(me.id) ? { ...m, micOn: !m.micOn } : m
            ),
          };
        });
        return { ...prev, [currentAzitId]: nextRooms };
      });
    },
    [currentAzitId, currentUser, myVoiceRoomIdByAzit]
  );

  const initAzitRooms = React.useCallback((azitId: number) => {
    setChatRoomsByAzit((prev) => ({ ...prev, [azitId]: [] }));
    setSelectedChatRoomIdByAzit((prev) => ({ ...prev, [azitId]: null }));
    setMessagesByAzit((prev) => ({ ...prev, [azitId]: {} }));
    setVoiceRoomsByAzit((prev) => ({ ...prev, [azitId]: createDefaultVoiceRooms() }));
    setMyVoiceRoomIdByAzit((prev) => ({ ...prev, [azitId]: null }));
  }, []);

  return {
    // chat
    chatRooms,
    selectedChatRoomId,
    selectedChatRoomName,
    messages,
    setChatRoomsFromServer,
    setVoiceRoomsFromServer, // ✅ 외부로 내보내기
    setSelectedChatRoom,
    replaceMessagesForRoom,
    appendMessageToRoom,

    // voice
    voiceRooms,
    myVoiceRoomId,
    joinVoiceRoom,
    toggleMyMic,

    initAzitRooms,
  };
};