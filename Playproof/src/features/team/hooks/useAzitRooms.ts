import React from "react";
import type { User } from "@/features/team/types/types";

type ChatMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  media?: { url: string; type: "image" | "video" }[];
};

const createDefaultVoiceRooms = () => [
  { id: "voice-lobby", name: "로비", users: [] as User[] },
];

const createDefaultTextRooms = () => ["자유 대화"];

export const useAzitRooms = (currentAzitId: number, currentUser: User) => {
  const [selectedChatRoomByAzit, setSelectedChatRoomByAzit] = React.useState<
    Record<number, string>
  >({
    1: "자유 대화",
    2: "자유 대화",
    3: "자유 대화",
  });
  const [textRoomsByAzit, setTextRoomsByAzit] = React.useState<Record<number, string[]>>({
    1: createDefaultTextRooms(),
    2: createDefaultTextRooms(),
    3: createDefaultTextRooms(),
  });
  const [messagesByAzit, setMessagesByAzit] = React.useState<
    Record<number, Record<string, ChatMessage[]>>
  >({
    1: { "자유 대화": [] },
    2: { "자유 대화": [] },
    3: { "자유 대화": [] },
  });
  const [voiceRoomsByAzit, setVoiceRoomsByAzit] = React.useState<
    Record<number, { id: string; name: string; users: User[] }[]>
  >({
    1: createDefaultVoiceRooms(),
    2: createDefaultVoiceRooms(),
    3: createDefaultVoiceRooms(),
  });

  const selectedChatRoom = selectedChatRoomByAzit[currentAzitId] ?? "자유 대화";
  const voiceRooms = voiceRoomsByAzit[currentAzitId] ?? createDefaultVoiceRooms();
  const textRooms = textRoomsByAzit[currentAzitId] ?? createDefaultTextRooms();
  const messages = messagesByAzit[currentAzitId]?.[selectedChatRoom] ?? [];

  const setSelectedChatRoom = React.useCallback(
    (roomName: string) => {
      setSelectedChatRoomByAzit((prev) => ({ ...prev, [currentAzitId]: roomName }));
    },
    [currentAzitId]
  );

  const addChatRoom = React.useCallback(
    (name: string, type: "TEXT" | "VOICE") => {
      if (!name.trim()) return;
      if (type === "TEXT") {
        setTextRoomsByAzit((prev) => {
          const currentRooms = prev[currentAzitId] ?? [];
          if (currentRooms.includes(name)) return prev;
          return { ...prev, [currentAzitId]: [name, ...currentRooms] };
        });
        setMessagesByAzit((prev) => {
          const currentAzitMessages = prev[currentAzitId] ?? {};
          if (currentAzitMessages[name]) return prev;
          return {
            ...prev,
            [currentAzitId]: { ...currentAzitMessages, [name]: [] },
          };
        });
        setSelectedChatRoomByAzit((prev) => ({ ...prev, [currentAzitId]: name }));
        return;
      }

      setVoiceRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
        if (currentRooms.some((room) => room.name === name)) return prev;
        const nextRooms = [
          { id: `voice-${Date.now()}`, name, users: [] as User[] },
          ...currentRooms,
        ];
        return { ...prev, [currentAzitId]: nextRooms };
      });
    },
    [currentAzitId]
  );

  const renameVoiceRoom = React.useCallback(
    (roomId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return;
      setVoiceRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
        if (currentRooms.some((room) => room.name === trimmed)) {
          return prev;
        }
        const nextRooms = currentRooms.map((room) =>
          room.id === roomId ? { ...room, name: trimmed } : room
        );
        return { ...prev, [currentAzitId]: nextRooms };
      });
    },
    [currentAzitId]
  );

  const deleteVoiceRoom = React.useCallback(
    (roomId: string) => {
      setVoiceRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? createDefaultVoiceRooms();
        if (currentRooms.length <= 1) return prev;
        const nextRooms = currentRooms.filter((room) => room.id !== roomId);
        return { ...prev, [currentAzitId]: nextRooms };
      });
    },
    [currentAzitId]
  );

  const renameChatRoom = React.useCallback(
    (roomName: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed || trimmed === roomName) return;

      let duplicate = false;
      setTextRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? [];
        if (currentRooms.includes(trimmed)) {
          duplicate = true;
          return prev;
        }
        const updatedRooms = currentRooms.map((room) =>
          room === roomName ? trimmed : room
        );
        return { ...prev, [currentAzitId]: updatedRooms };
      });
      if (duplicate) return;

      setMessagesByAzit((prev) => {
        const currentAzitMessages = prev[currentAzitId] ?? {};
        if (currentAzitMessages[trimmed]) return prev;
        const { [roomName]: roomMessages, ...rest } = currentAzitMessages;
        return {
          ...prev,
          [currentAzitId]: {
            ...rest,
            [trimmed]: roomMessages ?? [],
          },
        };
      });

      setSelectedChatRoomByAzit((prev) =>
        prev[currentAzitId] === roomName
          ? { ...prev, [currentAzitId]: trimmed }
          : prev
      );
    },
    [currentAzitId]
  );

  const deleteChatRoom = React.useCallback(
    (roomName: string) => {
      setTextRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? [];
        if (currentRooms.length <= 1) return prev;
        const nextRooms = currentRooms.filter((room) => room !== roomName);
        return { ...prev, [currentAzitId]: nextRooms };
      });

      setMessagesByAzit((prev) => {
        const currentAzitMessages = prev[currentAzitId] ?? {};
        const nextMessages = { ...currentAzitMessages };
        delete nextMessages[roomName];
        return {
          ...prev,
          [currentAzitId]:
            Object.keys(nextMessages).length > 0 ? nextMessages : { "자유 대화": [] },
        };
      });

      setSelectedChatRoomByAzit((prev) => {
        if (prev[currentAzitId] !== roomName) return prev;
        const rooms = textRoomsByAzit[currentAzitId] ?? [];
        const nextRooms = rooms.filter((room) => room !== roomName);
        const fallback = nextRooms[0] ?? "자유 대화";
        return { ...prev, [currentAzitId]: fallback };
      });
    },
    [currentAzitId, textRoomsByAzit]
  );

  const addChatMessage = React.useCallback(
    (
      roomName: string,
      content: string,
      media: { url: string; type: "image" | "video" }[]
    ) => {
      const text = content.trim();
      if (!text && media.length === 0) return;

      const newMessage: ChatMessage = {
        id: `${Date.now()}`,
        author: currentUser.nickname,
        content: text,
        createdAt: "방금 전",
        media: media.length > 0 ? media : undefined,
      };

      setMessagesByAzit((prev) => {
        const currentAzitMessages = prev[currentAzitId] ?? {};
        const roomMessages = currentAzitMessages[roomName] ?? [];
        return {
          ...prev,
          [currentAzitId]: {
            ...currentAzitMessages,
            [roomName]: [newMessage, ...roomMessages],
          },
        };
      });
    },
    [currentAzitId, currentUser.nickname]
  );

  const joinVoiceRoom = React.useCallback(
    (roomId: string) => {
      const me = currentUser;
      setVoiceRoomsByAzit((prev) => {
        const currentRooms = prev[currentAzitId] ?? [];
        const hadMeInTarget = currentRooms.some(
          (room) =>
            room.id === roomId &&
            room.users.some((user) => String(user.id) === String(me.id))
        );

        const nextState: Record<number, { id: string; name: string; users: User[] }[]> = {};

        Object.entries(prev).forEach(([azitKey, rooms]) => {
          nextState[Number(azitKey)] = rooms.map((room) => ({
            ...room,
            users: room.users.filter((user) => String(user.id) !== String(me.id)),
          }));
        });

        if (!hadMeInTarget) {
          const targetRooms = nextState[currentAzitId] ?? createDefaultVoiceRooms();
          nextState[currentAzitId] = targetRooms.map((room) =>
            room.id === roomId ? { ...room, users: [...room.users, me] } : room
          );
        }

        return nextState;
      });
    },
    [currentAzitId, currentUser]
  );

  const initAzitRooms = React.useCallback((azitId: number) => {
    setSelectedChatRoomByAzit((prev) => ({ ...prev, [azitId]: "자유 대화" }));
    setTextRoomsByAzit((prev) => ({ ...prev, [azitId]: createDefaultTextRooms() }));
    setMessagesByAzit((prev) => ({ ...prev, [azitId]: { "자유 대화": [] } }));
    setVoiceRoomsByAzit((prev) => ({ ...prev, [azitId]: createDefaultVoiceRooms() }));
  }, []);

  return {
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
    addChatMessage,
    joinVoiceRoom,
    initAzitRooms,
  };
};
