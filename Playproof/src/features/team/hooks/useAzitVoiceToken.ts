import { useCallback, useMemo, useState } from "react";
import { getVoiceToken, type VoiceTokenResponse } from "@/features/team/api/chatRoomsApi";

export type VoiceTokenState = {
  status: "idle" | "loading" | "success" | "error";
  data: VoiceTokenResponse | null;
  error: string | null;
  roomId: string | number | null;
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
    roomId: null,
  });

  const requestVoiceToken = useCallback(
    async (roomId: string | number) => {
      if (!accessToken) {
        setState({
          status: "error",
          data: null,
          error: "voice-token 요청 실패: accessToken이 없습니다.",
          roomId,
        });
        return null;
      }

      setState({ status: "loading", data: null, error: null, roomId });

      try {
        const data = await getVoiceToken({
          apiBaseUrl,
          roomId,
          accessToken,
        });

        setState({ status: "success", data, error: null, roomId });
        return data;
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
        setState({ status: "error", data: null, error: msg, roomId });
        return null;
      }
    },
    [apiBaseUrl, accessToken]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", data: null, error: null, roomId: null });
  }, []);

  return useMemo(
    () => ({
      voiceToken: state,
      requestVoiceToken,
      resetVoiceToken: reset,
    }),
    [state, requestVoiceToken, reset]
  );
};
