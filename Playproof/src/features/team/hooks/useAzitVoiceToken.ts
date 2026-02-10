// src/features/team/hooks/useAzitVoiceToken.ts

import { useCallback, useState } from "react";
import { getVoiceToken, type VoiceTokenResDto } from "@/features/team/api/chatRoomsApi";

type VoiceTokenState = {
  status: "idle" | "loading" | "success" | "error";
  data: VoiceTokenResDto | null;
  error: string | null;
};

type Params = {
  apiBaseUrl: string;
  accessToken: string | null;
};

export const useAzitVoiceToken = ({ apiBaseUrl, accessToken }: Params) => {
  const [state, setState] = useState<VoiceTokenState>({
    status: "idle",
    data: null,
    error: null,
  });

  const requestVoiceToken = useCallback(
    async (roomId: string | number) => {
      if (!accessToken) {
        console.error("❌ 토큰 없음: 음성 채널 접속 불가");
        return null;
      }

      setState({ status: "loading", data: null, error: null });

      try {
        // ✅ chatRoomsApi.ts의 함수 사용
        const data = await getVoiceToken({
          apiBaseUrl,
          roomId,
          accessToken,
        });

        setState({ status: "success", data, error: null });
        return data;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Voice token error";
        console.error("❌ Voice Token Error:", msg);
        setState({ status: "error", data: null, error: msg });
        return null;
      }
    },
    [apiBaseUrl, accessToken]
  );

  return {
    voiceTokenState: state,
    requestVoiceToken,
  };
};