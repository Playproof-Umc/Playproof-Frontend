import { api } from "@/services/api";

export type FeedbackTag = {
  id: number;
  type: 'POSITIVE' | 'NEGATIVE';
};

export type VerifiedAccount = {
  gameId: number;
  accountId: string;
};

export type UserProfile = {
  id: number;
  nickname: string;
  email?: string;
  statusMessage: string;
  profileImageUrl: string;
  tsRank: number;
  trustScore: number;
  positivePercentage: number;
  playStyle: string;
  preferredCategoryIds: number[];
  feedbackTags: FeedbackTag[];
  verifiedAccounts: VerifiedAccount[];
  favoriteGameIds: number[];
};

export type UserProfileResponse = {
  statusCode: number;
  data: UserProfile;
  error: null | unknown;
};

/**
 * 현재 로그인한 사용자 본인의 정보 조회
 * GET /users/my-profile
 */
export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfileResponse>("/users/my-profile");
  
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
  }
  
  return res.data.data;
}
