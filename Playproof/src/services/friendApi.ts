import { api } from "@/services/api";

export type ApiError = {
  code: string;
  message: string;
  errors?: { field: string; value: unknown; reason: string }[];
};

export type Result<T> =
  | { statusCode: number; data: T; error: null }
  | { statusCode: number; data: null; error: ApiError };

export type FriendItemResDto = {
  userId: number;
  nickname: string | null;
  avatarUrl: string | null;
  statusMessage: string | null;
  trustScore: number;
  friendAt: string;
};

/**
 * 내 친구 목록 조회
 * GET /friends
 */
export async function getFriends(): Promise<FriendItemResDto[]> {
  const res = await api.get<Result<FriendItemResDto[]>>("/friends");
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("친구 목록을 불러오는 중 오류가 발생했습니다.");
  }
  return res.data.data;
}

/**
 * 친구 요청 보내기
 * POST /friends/requests
 */
export async function sendFriendRequest(toUserId: number): Promise<void> {
  const res = await api.post<Result<null>>("/friends/requests", { toUserId });
  if (res.data.error || (res.data.statusCode !== 200 && res.data.statusCode !== 201)) {
    throw new Error(res.data.error?.message ?? "친구 요청에 실패했습니다.");
  }
}
