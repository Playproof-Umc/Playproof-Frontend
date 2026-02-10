import { api } from "@/services/api";

// ==================== Types ====================

export type Friend = {
  userId: number;
  nickname: string;
  avatarUrl: string;
  statusMessage: string;
  trustScore: number;
  friendAt: string;
};

export type FriendListResponse = {
  statusCode: number;
  data: Friend[];
  error: null | unknown;
};

export type FriendRequestBody = {
  toUserId: number;
};

export type FriendRequestData = {
  toUserId: number;
  friendStatus: string;
  friendAt: string;
  createdAt: string;
};

export type FriendRequestResponse = {
  statusCode: number;
  data: FriendRequestData;
  error: null | unknown;
};

export type FriendRequestListResponse = {
  statusCode: number;
  data: {
    friends: Friend[];
  };
  error: null | unknown;
};

export type AcceptFriendResponse = {
  statusCode: number;
  data: {
    requestId: number;
  };
  error: null | unknown;
};

export type DeleteFriendResponse = {
  statusCode: number;
  data: number;
  error: null | unknown;
};

export type FriendSearchResponse = {
  statusCode: number;
  data: Friend[];
  error: null | unknown;
};

// ==================== API Functions ====================

/**
 * 친구 목록 조회
 * GET /friends
 */
export async function getFriends(): Promise<Friend[]> {
  const res = await api.get<FriendListResponse>("/friends");

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('친구 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 친구 신청
 * POST /friends/requests
 */
export async function sendFriendRequest(toUserId: number): Promise<FriendRequestData> {
  const res = await api.post<FriendRequestResponse>("/friends/requests", { toUserId });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('친구 신청 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 보낸 친구 신청 목록 조회
 * GET /friends/requests/sent
 */
export async function getSentFriendRequests(): Promise<Friend[]> {
  const res = await api.get<FriendRequestListResponse>("/friends/requests/sent");

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('보낸 친구 신청 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data.friends;
}

/**
 * 받은 친구 신청 목록 조회
 * GET /friends/requests/received
 */
export async function getReceivedFriendRequests(): Promise<Friend[]> {
  const res = await api.get<FriendRequestListResponse>("/friends/requests/received");

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('받은 친구 신청 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data.friends;
}

/**
 * 친구 신청 수락
 * PATCH /friends/requests/{requestId}
 */
export async function acceptFriendRequest(requestId: number): Promise<number> {
  const res = await api.patch<AcceptFriendResponse>(`/friends/requests/${requestId}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('친구 신청 수락 중 오류가 발생했습니다.');
  }

  return res.data.data.requestId;
}

/**
 * 친구 삭제
 * DELETE /friends/{friendId}
 */
export async function deleteFriend(friendId: number): Promise<number> {
  const res = await api.delete<DeleteFriendResponse>(`/friends/${friendId}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('친구 삭제 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 친구 검색
 * GET /friends/search?nickname={nickname}
 */
export async function searchFriends(nickname: string): Promise<Friend[]> {
  const res = await api.get<FriendSearchResponse>("/friends/search", {
    params: { nickname }
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('친구 검색 중 오류가 발생했습니다.');
  }

  return res.data.data;
}
