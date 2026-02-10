// playproof/src/features/azit/hooks/useAzitChat.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useAzitSocket, type ChatMessage, type ApiError } from "./useAzitSocket";
import { getChatMessages } from "@/features/team/api/chatApi";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://myfit.my";

export const useAzitChat = (
  params: {
    roomId?: number;
  } = {} // ✅ 방법 A: 기본값 추가
) => {
  const { roomId } = params;

  const accessToken = useAuthStore((s) => s.accessToken);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const messageIdSetRef = useRef<Set<number>>(new Set());

  const {
    isConnected,
    currentRoomId,
    sendMessage,
  } = useAzitSocket({
    roomId,
    onMessage: (msg) => {
      if (msg.chatRoomId !== roomId) return;
      if (messageIdSetRef.current.has(msg.id)) return;

      messageIdSetRef.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
    },
    onError: (err) => setError(err),
  });

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    setError(null);
    messageIdSetRef.current.clear();
  }, [roomId]);

  const loadMessages = useCallback(
    async (opts?: { initial?: boolean }) => {
      if (!roomId || !accessToken) return;
      if (isLoading) return;
      if (!opts?.initial && nextCursor === null) return;

      setIsLoading(true);
      try {
        const res = await getChatMessages({
          apiBaseUrl: API_BASE_URL,
          accessToken,
          roomId,
          cursor: opts?.initial ? undefined : nextCursor,
        });

        const fetched = res.messages ?? [];
        const newOnes: ChatMessage[] = [];

        for (const m of fetched) {
          if (!messageIdSetRef.current.has(m.id)) {
            messageIdSetRef.current.add(m.id);
            newOnes.push(m);
          }
        }

        if (newOnes.length > 0) {
          setMessages((prev) => [...newOnes, ...prev]);
        }

        setNextCursor(res.nextCursor);
      } catch (e) {
        setError({
          code: "FETCH_MESSAGES_FAILED",
          message: e instanceof Error ? e.message : "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, accessToken, nextCursor, isLoading]
  );

  useEffect(() => {
    if (!roomId) return;
    loadMessages({ initial: true });
  }, [roomId, loadMessages]);

  const onSendMessage = useCallback(
    async (content: string) => {
      if (!roomId) return;
      if (!isConnected || currentRoomId !== roomId) {
        throw new Error("Socket not ready");
      }

      const msg = await sendMessage(roomId, content);

      if (!messageIdSetRef.current.has(msg.id)) {
        messageIdSetRef.current.add(msg.id);
        setMessages((prev) => [...prev, msg]);
      }
    },
    [roomId, isConnected, currentRoomId, sendMessage]
  );

  return {
    messages,
    isLoading,
    error,
    hasMore: nextCursor !== null,
    loadMore: () => loadMessages(),
    sendMessage: onSendMessage,
  };
};
