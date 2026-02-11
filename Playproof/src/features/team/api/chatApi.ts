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
  id: number; // chatRoomId
  roomName: string;
  chatType: "TEXT" | "VOICE";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
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

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
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

// ✅ [수정됨] 파라미터 이름(name, type)을 로직과 맞추고 isPrivate 활성화
export async function createChatRoomByAzit(params: {
  apiBaseUrl: string;
  accessToken: string;
  azitId: number;
  name: string;             // UI에서 넘겨주는 이름
  type: "TEXT" | "VOICE";   // UI에서 넘겨주는 타입
  isPrivate: boolean;       // 비공개 여부 (필수)
}): Promise<ChatRoomGetResDto> {
  const base = normalizeBase(params.apiBaseUrl);
  const url = `${base}/azits/${params.azitId}/chat-rooms`;

  // 서버로 보낼 데이터 (백엔드 스키마 추정: roomName, chatType)
  const body = {
    roomName: params.name,
    chatType: params.type,
    isPrivate: params.isPrivate,
  };

  const json = await fetchJson<Result<ChatRoomGetResDto>>(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

export async function updateChatRoom(params: {
  apiBaseUrl: string;
  accessToken: string;
  roomId: number;
  name?: string;
  isPrivate?: boolean;
}): Promise<ChatRoomGetResDto> {
  const base = normalizeBase(params.apiBaseUrl);
  const url = `${base}/chat-rooms/${params.roomId}`;
  const body: Record<string, unknown> = {};
  if (params.name !== undefined) body.roomName = params.name;
  if (params.isPrivate !== undefined) body.isPrivate = params.isPrivate;

  const json = await fetchJson<Result<ChatRoomGetResDto>>(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (json.error) throw new Error(json.error.message);
  return json.data;
}

export async function deleteChatRoom(params: {
  apiBaseUrl: string;
  accessToken: string;
  roomId: number;
}) {
  const base = normalizeBase(params.apiBaseUrl);
  const url = `${base}/chat-rooms/${params.roomId}`;

  const json = await fetchJson<Result<string>>(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
    },
  });

  if (json.error) throw new Error(json.error.message);
  return json.data;
}

/**
 * Alias for chat message list fetch (hook-friendly name).
 * Backend contract: cursor-based pagination (not limit/beforeId).
 */
export async function fetchChatMessages(params: {
  apiBaseUrl: string;
  accessToken: string;
  roomId: number;
  cursor?: number | null;
}): Promise<ChatMessageListResDto> {
  return getChatMessages({
    apiBaseUrl: params.apiBaseUrl,
    accessToken: params.accessToken,
    roomId: params.roomId,
    cursor: params.cursor ?? null,
  });
}
