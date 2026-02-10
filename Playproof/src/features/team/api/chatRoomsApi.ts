export type VoiceTokenResDto = {
  token: string;
  url: string;
  roomName: string;
  identity: string;
  name: string;
};

type ApiErrorDetail = {
  field: string;
  value: unknown;
  reason: string;
};

type Failed = {
  statusCode: number;
  data: null;
  error: {
    code: string;
    message: string;
    errors?: ApiErrorDetail[];
  };
};

type Success<T> = {
  statusCode: number;
  data: T;
  error: null;
};

type Result<T> = Success<T> | Failed;

type GetVoiceTokenParams = {
  apiBaseUrl: string; // ex) http://localhost:3000
  roomId: string | number;
  accessToken: string; // JWT (Bearer 없이 값만 들어와도 여기서 Bearer로 감쌈)
};

const isSuccess = <T,>(r: Result<T>): r is Success<T> => r.error === null;

export async function getVoiceToken({
  apiBaseUrl,
  roomId,
  accessToken,
}: GetVoiceTokenParams): Promise<VoiceTokenResDto> {
  const base = apiBaseUrl.trim().replace(/\/+$/, "");
  const endpoint = `${base}/chat-rooms/${encodeURIComponent(String(roomId))}/voice-token`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  let json: Result<VoiceTokenResDto>;
  try {
    json = (await res.json()) as Result<VoiceTokenResDto>;
  } catch {
    throw new Error(`voice-token 응답 파싱 실패 (status=${res.status})`);
  }

  // HTTP status가 ok라도 Result.error로 실패가 올 수 있으니 Result 기준으로 판단
  if (!res.ok || !isSuccess(json)) {
    const msg =
      (json as Failed)?.error?.message ??
      `voice-token 요청 실패 (status=${res.status})`;
    throw new Error(msg);
  }

  const data = json.data;
  // DTO 필드 유효성 최소 체크
  if (!data?.token || !data?.url || !data?.roomName) {
    throw new Error("voice-token 응답(data) 형식이 올바르지 않습니다.");
  }

  return data;
}
