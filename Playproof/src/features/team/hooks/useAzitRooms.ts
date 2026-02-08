// src/features/team/hooks/useAzitRooms.ts
import React from "react";
import type { User } from "@/features/team/types/types";

export type ChatRoomSummary = {
  id: number;        // chatRoomId
  roomName: string;
};

export type ChatMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  media?: { url: string; type: "image" | "video" }[];
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
  const [selectedChatRoomIdByAzit, setSelectedChatRoomIdByAzit] = React.useState<
    Record<number, number | null>
  >({ 1: null, 2: null, 3: null });

  const [chatRoomsByAzit, setChatRoomsByAzit] = React.useState<Record<number, ChatRoomSummary[]>>({
    1: [],
    2: [],
    3: [],
  });

  const [messagesByAzit, setMessagesByAzit] = React.useState<
    Record<number, Record<number, ChatMessage[]>>
  >({ 1: {}, 2: {}, 3: {} });

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

  const voiceRooms = voiceRoomsByAzit[currentAzitId] ?? createDefaultVoiceRooms();
  const myVoiceRoomId = myVoiceRoomIdByAzit[currentAzitId] ?? null;

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

  // ✅ 서버에서 받은 방 목록으로 동기화
  const setChatRoomsFromServer = React.useCallback(
    (rooms: ChatRoomSummary[]) => {
      setChatRoomsByAzit((prev) => ({ ...prev, [currentAzitId]: rooms }));

      // messages map 누락 방 생성
      setMessagesByAzit((prev) => {
        const byAzit = { ...(prev[currentAzitId] ?? {}) };
        for (const r of rooms) {
          if (!byAzit[r.id]) byAzit[r.id] = [];
        }
        return { ...prev, [currentAzitId]: byAzit };
      });

      // 선택 방 없으면 첫 방 선택
      setSelectedChatRoomIdByAzit((prev) => {
        const currentSelected = prev[currentAzitId] ?? null;
        if (currentSelected && rooms.some((r) => r.id === currentSelected)) return prev;
        return { ...prev, [currentAzitId]: rooms[0]?.id ?? null };
      });
    },
    [currentAzitId]
  );

  const replaceMessagesForRoom = React.useCallback(
    (roomId: number, next: ChatMessage[]) => {
      setMessagesByAzit((prev) => {
        const byAzit = prev[currentAzitId] ?? {};
        return { ...prev, [currentAzitId]: { ...byAzit, [roomId]: next } };
      });
    },
    [currentAzitId]
  );

  const appendMessageToRoom = React.useCallback(
    (roomId: number, msg: ChatMessage) => {
      setMessagesByAzit((prev) => {
        const byAzit = prev[currentAzitId] ?? {};
        const list = byAzit[roomId] ?? [];
        return { ...prev, [currentAzitId]: { ...byAzit, [roomId]: [msg, ...list] } };
      });
    },
    [currentAzitId]
  );

  // ---- voice (기존 유지) ----
  const joinVoiceRoom = React.useCallback(
    (roomId: string) => {
      const me = currentUser;

      setVoiceRoomsByAzit((prev) => {
        const nextState: Record<number, VoiceRoom[]> = {};
        Object.entries(prev).forEach(([azitKey, rooms]) => {
          nextState[Number(azitKey)] = rooms.map((room) => ({
            ...room,
            users: room.users.filter((m) => String(m.user.id) !== String(me.id)),
          }));
        });

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
      const targetRoomId = roomId ?? myVoiceRoomIdByAzit[currentAzitId] ?? null;
      if (!targetRoomId) return;

      setVoiceRoomsByAzit((prev) => {
        const rooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
        const nextRooms = rooms.map((room) => {
          if (room.id !== targetRoomId) return room;
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
    setSelectedChatRoomIdByAzit((prev) => ({ ...prev, [azitId]: null }));
    setChatRoomsByAzit((prev) => ({ ...prev, [azitId]: [] }));
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

    setSelectedChatRoom,
    setChatRoomsFromServer,
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
