import { api } from "@/services/api";

export type UserProfile = {
  id: number;
  phone: string;
  nickname: string;
};

export type UserProfileResponse = {
  statusCode: number;
  data: UserProfile;
  error: null | unknown;
};

/**
 * 현재 로그인한 사용자 본인의 정보 조회
 * GET /users/me
 */
export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfileResponse>("/users/me");
  
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
  }
  
  return res.data.data;
}
