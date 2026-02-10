// src/features/team/hooks/useAzitLivekitVoice.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteParticipant,
  Track,
  type Participant,
} from "livekit-client";
// ✅ 타입 import 경로 확인 (ChatRoomsApi에서 가져옴)
import type { VoiceTokenResDto } from "@/features/team/api/chatRoomsApi";

export type LivekitStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export const useAzitLivekitVoice = () => {
  const roomRef = useRef<Room | null>(null);

  const [status, setStatus] = useState<LivekitStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  
  // 현재 말하고 있는 사람 ID 목록 (UI 표시용)
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);

  // ✅ [핵심] 상대방 오디오 트랙 구독 시 자동 재생
  // 이 부분이 없으면 연결은 되는데 소리가 안 들립니다.
  const handleTrackSubscribed = (
    track: RemoteTrack,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _publication: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _participant: RemoteParticipant
  ) => {
    if (track.kind === Track.Kind.Audio) {
      // HTMLAudioElement 생성 및 body에 부착 (화면엔 안보임, 소리만 재생)
      const element = track.attach();
      document.body.appendChild(element);
    }
  };

  // ✅ 오디오 트랙 구독 해제 시 청소
  const handleTrackUnsubscribed = (
    track: RemoteTrack,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _publication: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _participant: RemoteParticipant
  ) => {
    track.detach().forEach((element) => element.remove());
  };

  const connect = useCallback(async (tokenInfo: VoiceTokenResDto) => {
    try {
      // 기존 연결 정리
      if (roomRef.current) {
        roomRef.current.disconnect();
      }

      setStatus("connecting");
      setError(null);

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      // --- 이벤트 리스너 등록 ---
      // 1. 듣기 기능 (TrackSubscribed)
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      
      // 2. 말하는 사람 감지 (ActiveSpeakersChanged)
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
        setActiveSpeakers(speakers.map((p) => p.identity));
      });

      // 3. 연결 끊김 감지
      room.on(RoomEvent.Disconnected, () => {
        setStatus("disconnected");
        setActiveSpeakers([]);
      });

      // --- LiveKit 서버 접속 ---
      await room.connect(tokenInfo.url, tokenInfo.token);

      setStatus("connected");
      
      // 입장 시 마이크 켜기 (브라우저 권한 요청 뜸)
      await room.localParticipant.setMicrophoneEnabled(true);

      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "LiveKit connect failed";
      setStatus("error");
      setError(msg);
      console.error(e);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    setStatus("disconnected");
    setActiveSpeakers([]);
  }, []);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room || !room.localParticipant) return false;
    
    // 현재 마이크 상태 확인 후 토글
    const isEnabled = room.localParticipant.isMicrophoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(!isEnabled);
    return !isEnabled;
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  return useMemo(
    () => ({
      status,
      error,
      isConnected: status === "connected",
      activeSpeakers,
      connect,
      disconnect,
      toggleMic,
      room: roomRef.current,
    }),
    [status, error, activeSpeakers, connect, disconnect, toggleMic]
  );
};