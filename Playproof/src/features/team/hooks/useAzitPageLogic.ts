import React from "react";
import { useLocation } from "react-router-dom";
import type { User } from "@/features/team/types/types";
import type { Clip } from "@/types";
import {
  MOCK_MY_AZITS,
  mockMembers,
  mockClipsByAzit,
  mockMembersByAzit,
  mockSchedulesByAzit,
} from "@/features/team/data/mockTeamData";
import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";

const FALLBACK_USER_ID = "1";
const createDefaultVoiceRooms = () => [
  { id: "voice-lobby", name: "로비", users: [] as User[] },
];

type ChatMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  media?: { url: string; type: "image" | "video" }[];
};

const createDefaultTextRooms = () => ["자유 대화"];
const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export function useAzitPageLogic() {
  const location = useLocation();
  const state = location.state as { azitId?: number } | null;
  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const [azits, setAzits] = React.useState(MOCK_MY_AZITS);
  const azitIconUrlsRef = React.useRef<string[]>([]);
  const [selectedChatRoomByAzit, setSelectedChatRoomByAzit] = React.useState<Record<number, string>>({
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
  const messageMediaRef = React.useRef<string[]>([]);
  const [voiceRoomsByAzit, setVoiceRoomsByAzit] = React.useState<
    Record<number, { id: string; name: string; users: User[] }[]>
  >({
    1: createDefaultVoiceRooms(),
    2: createDefaultVoiceRooms(),
    3: createDefaultVoiceRooms(),
  });
  const [clipsByAzit, setClipsByAzit] = React.useState<Record<number, Clip[]>>(
    mockClipsByAzit
  );
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
  } = useAzitSchedules(currentUserId, mockSchedulesByAzit, mockMembersByAzit, currentUser);

  React.useEffect(() => {
    if (state?.azitId) {
      setCurrentAzitId(state.azitId);
    }
  }, [state?.azitId, setCurrentAzitId]);

  const currentAzit = azits.find((azit) => azit.id === currentAzitId) ?? azits[0];
  const currentMembers = mockMembersByAzit[currentAzitId] ?? [];
  const currentClips = clipsByAzit[currentAzitId] ?? [];
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
        const { [roomName]: _removed, ...rest } = currentAzitMessages;
        return {
          ...prev,
          [currentAzitId]: Object.keys(rest).length > 0 ? rest : { "자유 대화": [] },
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
    (roomName: string, content: string, files: File[]) => {
      const text = content.trim();
      if (!text && files.length === 0) return;

      const media = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      }));

      if (media.length > 0) {
        messageMediaRef.current.push(...media.map((item) => item.url));
      }

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

      if (media.length > 0) {
        const nowLabel = "방금 전";
        const newClips: Clip[] = media.map((item, index) => ({
          id: `${Date.now()}-${index}`,
          date: nowLabel,
          thumbnailUrl: item.type === "image" ? item.url : "",
          mediaType: item.type,
          mediaUrl: item.url,
          durationLabel: item.type === "video" ? "0:00" : undefined,
        }));

        setClipsByAzit((prev) => {
          const current = prev[currentAzitId] ?? [];
          return {
            ...prev,
            [currentAzitId]: [...newClips, ...current],
          };
        });

        newClips.forEach((clip) => {
          if (clip.mediaType !== "video" || !clip.mediaUrl) return;
          const video = document.createElement("video");
          video.preload = "metadata";
          video.src = clip.mediaUrl;
          video.onloadedmetadata = () => {
            const label = formatDuration(video.duration);
            setClipsByAzit((prev) => {
              const current = prev[currentAzitId] ?? [];
              return {
                ...prev,
                [currentAzitId]: current.map((item) =>
                  item.id === clip.id ? { ...item, durationLabel: label } : item
                ),
              };
            });
          };
        });
      }
    },
    [currentAzitId, currentUser.nickname]
  );

  React.useEffect(() => {
    return () => {
      messageMediaRef.current.forEach((url) => URL.revokeObjectURL(url));
      messageMediaRef.current = [];
      azitIconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      azitIconUrlsRef.current = [];
    };
  }, []);

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
      setSelectedChatRoomByAzit((prev) => ({ ...prev, [nextId]: "자유 대화" }));
      setTextRoomsByAzit((prev) => ({ ...prev, [nextId]: createDefaultTextRooms() }));
      setMessagesByAzit((prev) => ({
        ...prev,
        [nextId]: { "자유 대화": [] },
      }));
      setVoiceRoomsByAzit((prev) => ({ ...prev, [nextId]: createDefaultVoiceRooms() }));
      setClipsByAzit((prev) => ({ ...prev, [nextId]: [] }));
      setCurrentAzitId(nextId);
    },
    [azits, setCurrentAzitId]
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
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,
      setSelectedChatRoom,
      joinVoiceRoom,
      handleStatusChange,
      addSchedule,
      addChatRoom,
      renameVoiceRoom,
      deleteVoiceRoom,
      renameChatRoom,
      deleteChatRoom,
      addChatMessage,
      addAzit,
    },
  };
}
