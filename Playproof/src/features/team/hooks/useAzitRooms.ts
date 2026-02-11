// src/features/team/hooks/useAzitRooms.ts

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
        return { ...prev, [currentAzitId]: rooms[0]?.id ?? null };
      });
    },
    [currentAzitId]
  );

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

  // voice
  const voiceRooms = voiceRoomsByAzit[currentAzitId] ?? createDefaultVoiceRooms();
  const myVoiceRoomId = myVoiceRoomIdByAzit[currentAzitId] ?? null;

  // ✅ [수정됨] userOverride 파라미터 추가
  const joinVoiceRoom = React.useCallback(
    (roomId: string, userOverride?: User) => {
      // 전달받은 user 정보가 있으면 그것을 쓰고, 없으면 currentUser(store/mock) 사용
      const me = userOverride ?? currentUser;

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

  const leaveVoiceRoom = React.useCallback(() => {
    const me = currentUser;
    const target = myVoiceRoomIdByAzit[currentAzitId] ?? null;
    if (!target) return;

    setVoiceRoomsByAzit((prev) => {
      const rooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
      const nextRooms = rooms.map((room) => {
        if (room.id !== target) return room;
        return {
          ...room,
          users: room.users.filter((m) => String(m.user.id) !== String(me.id)),
        };
      });
      return { ...prev, [currentAzitId]: nextRooms };
    });

    setMyVoiceRoomIdByAzit((prev) => ({ ...prev, [currentAzitId]: null }));
  }, [currentAzitId, currentUser, myVoiceRoomIdByAzit]);

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
    joinVoiceRoom,
    leaveVoiceRoom,
    toggleMyMic,

    initAzitRooms,
  };
};
