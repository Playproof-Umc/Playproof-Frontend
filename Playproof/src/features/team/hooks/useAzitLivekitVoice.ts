import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Room } from "livekit-client";
import type { VoiceTokenResponse } from "@/features/team/api/chatRoomsApi";

export type LivekitStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

type Params = {
  enabled?: boolean;
};

export const useAzitLivekitVoice = ({ enabled = true }: Params = {}) => {
  const roomRef = useRef<Room | null>(null);

  const [status, setStatus] = useState<LivekitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isConnected = status === "connected";

  const connect = useCallback(
    async (tokenInfo: VoiceTokenResponse) => {
      if (!enabled) return false;

      try {
        setStatus("connecting");
        setError(null);

        // 기존 연결이 있으면 정리
        if (roomRef.current) {
          try {
            roomRef.current.disconnect();
          } catch {
            // ignore
          }
          roomRef.current = null;
        }

        const room = new Room();
        roomRef.current = room;

        // tokenInfo.roomName을 서버가 내려줬으므로 우선 신뢰.
        // (백엔드가 prefix를 이미 포함해 내려주거나, 프론트가 조합하길 원하면 STEP 4에서 통일)
        await room.connect(tokenInfo.url, tokenInfo.token, {
          room: tokenInfo.roomName,
        });

        setStatus("connected");
        setError(null);

        // 기본: 접속 직후 마이크 ON (원하면 false로 바꿔도 됨)
        await room.localParticipant.setMicrophoneEnabled(true);

        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "LiveKit connect error";
        setStatus("error");
        setError(msg);
        return false;
      }
    },
    [enabled]
  );

  const disconnect = useCallback(() => {
    const room = roomRef.current;
    if (!room) {
      setStatus("disconnected");
      return;
    }

    try {
      room.disconnect();
    } catch {
      // ignore
    } finally {
      roomRef.current = null;
      setStatus("disconnected");
    }
  }, []);

  const setMicEnabled = useCallback(async (enabledMic: boolean) => {
    const room = roomRef.current;
    if (!room) return false;

    try {
      await room.localParticipant.setMicrophoneEnabled(enabledMic);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Mic toggle error";
      setError(msg);
      return false;
    }
  }, []);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return false;

    // localParticipant.isMicrophoneEnabled()는 버전에 따라 제공/미제공이 섞여서
    // 확실하게 하려면 track publication 상태를 확인해야 함.
    // 여기선 안전하게: 현재 track publish 여부로 판단
    const pubs = Array.from(room.localParticipant.audioTrackPublications.values());
    const hasAudioTrack = pubs.some((p) => !!p.track);

    // hasAudioTrack=true면 끄기, 아니면 켜기
    return setMicEnabled(!hasAudioTrack);
  }, [setMicEnabled]);

  // 언마운트 cleanup
  useEffect(() => {
    return () => {
      try {
        roomRef.current?.disconnect();
      } catch {
        // ignore
      } finally {
        roomRef.current = null;
      }
    };
  }, []);

  return useMemo(
    () => ({
      status,
      error,
      isConnected,
      connect,
      disconnect,
      toggleMic,
      setMicEnabled,
      room: roomRef.current,
    }),
    [status, error, isConnected, connect, disconnect, toggleMic, setMicEnabled]
  );
};
