// src/features/team/api/chatApi.ts
export type ApiError = {
  code: string;
  message: string;
  errors?: { field: string; value: unknown; reason: string }[];
};

export type Result<T> =
  | { statusCode: number; data: T; error: null }
  | { statusCode: number; data: null; error: ApiError };

export type ChatRoomGetResDto = {
  id: number;
  roomName: string;
  chatType: "TEXT" | "VOICE";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatRoomCreateResDto = {
  roomId: number;
};

export type ChatMessageResDto = {
  id: number;
  chatRoomId: number;
  memberId: number;
  userId: number;
  nickname?: string | null;
  content: string;
  createdAt: string;
};

export type ChatMessageListResDto = {
  messages: ChatMessageResDto[];
  nextCursor: number | null;
};

const normalizeBase = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, "");

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const json = (await res.json().catch(() => null)) as T | null;
  if (!json) throw new Error(`API 응답 파싱 실패 (status=${res.status})`);
  return json;
}

export async function getChatRoomsByAzit(params: {
  apiBaseUrl: string;
  accessToken: string;
  azitId: number;
}): Promise<ChatRoomGetResDto[]> {
  const base = normalizeBase(params.apiBaseUrl);
  const url = `${base}/azits/${params.azitId}/chat-rooms`;

  const json = await fetchJson<Result<ChatRoomGetResDto[]>>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
    },
  });

  if (json.error) throw new Error(json.error.message);
  return json.data;
}

export async function getChatMessages(params: {
  apiBaseUrl: string;
  accessToken: string;
  roomId: number; // chatRoomId
  cursor?: number | null;
}): Promise<ChatMessageListResDto> {
  const base = normalizeBase(params.apiBaseUrl);
  const qs = params.cursor ? `?cursor=${params.cursor}` : "";
  const url = `${base}/chat-rooms/${params.roomId}/messages${qs}`;

  const json = await fetchJson<Result<ChatMessageListResDto>>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
    },
  });

  if (json.error) throw new Error(json.error.message);
  return json.data;
}
