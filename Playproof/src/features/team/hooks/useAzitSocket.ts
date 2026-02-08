// src/features/team/hooks/useAzitSocket.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

type SocketStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export type JoinPayload = { roomId: number };
export type SendMessagePayload = { roomId: number; content: string };

export type SocketAck =
  | { ok: true; data?: unknown }
  | { ok: false; error?: unknown }
  | unknown;

type Params = {
  apiBaseUrl: string; // https://myfit.my
  accessToken: string | null; // Bearer 없이 raw JWT
  enabled?: boolean;

  onNewMessage?: (data: unknown) => void;
  onErrorEvent?: (err: unknown) => void;
};

export const useAzitSocket = ({
  apiBaseUrl,
  accessToken,
  enabled = true,
  onNewMessage,
  onErrorEvent,
}: Params) => {
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<SocketStatus>("idle");
  const [socketId, setSocketId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const isConnected = status === "connected";

  useEffect(() => {
    if (!enabled) return;

    if (!accessToken) {
      setStatus("idle");
      setSocketId(null);
      setLastError(null);
      return;
    }

    const url = apiBaseUrl?.trim();
    if (!url) {
      setStatus("error");
      setLastError("Socket 연결 실패: apiBaseUrl이 비어 있습니다.");
      return;
    }

    setStatus("connecting");
    setLastError(null);

    const socket = io(url, {
      auth: { token: accessToken }, // ✅ auth.ts extractToken이 지원
      transports: ["websocket"], // ✅ 테스트 HTML과 동일
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setStatus("connected");
      setSocketId(socket.id ?? null);
      setLastError(null);
    };

    const handleDisconnect = (_reason: string) => {
      setStatus("disconnected");
      setSocketId(null);
    };

    const handleConnectError = (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown socket error";
      setStatus("error");
      setLastError(msg);
    };

    const handleErrorEvent = (err: unknown) => onErrorEvent?.(err);
    const handleNewMessage = (data: unknown) => onNewMessage?.(data);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("error", handleErrorEvent);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("error", handleErrorEvent);
      socket.off("newMessage", handleNewMessage);

      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiBaseUrl, accessToken, enabled, onNewMessage, onErrorEvent]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  const emitWithAck = useCallback(
    <TPayload,>(eventName: string, payload: TPayload, timeoutMs = 5000) => {
      const s = socketRef.current;
      if (!s || !s.connected) return Promise.resolve<SocketAck | null>(null);

      return new Promise<SocketAck | null>((resolve) => {
        let done = false;

        const timer = window.setTimeout(() => {
          if (done) return;
          done = true;
          resolve(null);
        }, timeoutMs);

        s.emit(eventName, payload, (res: SocketAck) => {
          if (done) return;
          done = true;
          window.clearTimeout(timer);
          resolve(res);
        });
      });
    },
    []
  );

  const emitNoAck = useCallback(<TPayload,>(eventName: string, payload: TPayload) => {
    const s = socketRef.current;
    if (!s || !s.connected) return;
    s.emit(eventName, payload);
  }, []);

  const joinRoom = useCallback(
    (payload: JoinPayload) => emitWithAck("joinRoom", payload),
    [emitWithAck]
  );
  const leaveRoom = useCallback(
    (payload: JoinPayload) => emitNoAck("leaveRoom", payload),
    [emitNoAck]
  );

  const sendMessage = useCallback(
    (payload: SendMessagePayload) => emitWithAck("sendMessage", payload),
    [emitWithAck]
  );

  const voiceJoin = useCallback(
    (payload: JoinPayload) => emitWithAck("voiceJoin", payload),
    [emitWithAck]
  );
  const voiceLeave = useCallback(
    (payload: JoinPayload) => emitWithAck("voiceLeave", payload),
    [emitWithAck]
  );

  return useMemo(
    () => ({
      status,
      socketId,
      lastError,
      isConnected,
      joinRoom,
      leaveRoom,
      sendMessage,
      voiceJoin,
      voiceLeave,
      disconnect,
      socket: socketRef.current,
    }),
    [
      status,
      socketId,
      lastError,
      isConnected,
      joinRoom,
      leaveRoom,
      sendMessage,
      voiceJoin,
      voiceLeave,
      disconnect,
    ]
  );
};
