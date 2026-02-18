// src/features/mypage/api/mypageApi.ts

import type {
  BlockedUserData,
  FeedbackData,
  FriendData,
  MyPostsData,
  MyProfileData,
} from '@/features/mypage/types';
import { api } from '@/services/api';
import { getMyProfile as getMyProfileFromService, type UserProfile } from '@/services/userApi';
import { getFriends as getFriendsFromService, deleteFriend as deleteFriendFromService, type Friend } from '@/services/friendApi';
import { createReport } from '@/services/reportApi';

// ==================== 피드백 API 타입 정의 ====================

type FeedbackWriter = {
  id: number;
  nickname: string;
  avatarUrl: string;
  trustScore: number;
};

type FeedbackItem = {
  feedbackId: number;
  content: string;
  tsScoreChange: number;
  createdAt: string;
  writer: FeedbackWriter;
  tags: string[];
};

type FeedbacksResponse = {
  statusCode: number;
  data: {
    feedbacks: FeedbackItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  error: null | unknown;
};

// ==================== 내가 쓴 글 API 타입 정의 ====================

// 파티 (매칭)
type PartyUser = {
  id: number;
  nickname: string;
  trustScore: number;
  avatarUrl: string;
};

type PartyTag = {
  id: number;
  name: string;
};

type PartyPosition = {
  positionId: number;
  positionName: string;
};

type PartyItem = {
  partyId: number;
  gameId: number;
  host: PartyUser;
  title: string;
  memo: string;
  tierName: string;
  azitName: string;
  azitId: number;
  participants: number;
  currentParticipants: number;
  isMic: boolean;
  status: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isApplied: boolean;
  applicationStatus: string;
  applicationId: number;
  tags: PartyTag[];
  positions: PartyPosition[];
  createdAt: string;
  updatedAt: string;
};

type PartiesResponse = {
  statusCode: number;
  data: {
    parties: PartyItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  error: null | unknown;
};

// 하이라이트
type HighlightMedia = {
  highlight_media_id: number;
  media_url: string;
  order: number;
  upload_at: string;
};

type HighlightItem = {
  highlight_id: number;
  user_id: number;
  nickname: string;
  content: string;
  visibility: string;
  media_count: number;
  medias: HighlightMedia[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  azit_id: number;
  azit_name: string;
};

type HighlightsResponse = {
  statusCode: number;
  data: {
    highlights: HighlightItem[];
    has_next: boolean;
    next_cursor: number | null;
  };
  error: null | unknown;
};

// 커뮤니티 게시글
type CommunityMedia = {
  order: number;
  media_url: string;
};

type CommunityPostItem = {
  post_id: number;
  user_id: number;
  nickname: string;
  game_id: number;
  title: string;
  content: string;
  medias: CommunityMedia[];
  comment_count: number;
  like_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
};

type CommunityPostsResponse = {
  statusCode: number;
  data: {
    posts: CommunityPostItem[];
    meta: {
      total_pages: number;
      current_page: number;
      total_count: number;
    };
    nextCursor: number | null;
    hasNext: boolean;
  };
  error: null | unknown;
};

/**
 * FeedbackItem을 FeedbackData로 변환
 */
function mapFeedbackItemToFeedbackData(item: FeedbackItem): FeedbackData {
  return {
    id: String(item.feedbackId),
    fromUser: {
      userId: String(item.writer.id),
      nickname: item.writer.nickname,
      profileImage: item.writer.avatarUrl,
    },
    game: '', // TODO: 게임 정보가 없으므로 추후 추가 필요
    temperScoreChange: item.tsScoreChange,
    tags: item.tags,
    memo: item.content,
    createdAt: item.createdAt,
  };
}

/**
 * UserProfile을 MyProfileData로 변환
 */
function mapUserProfileToMyProfileData(profile: UserProfile): MyProfileData {
  return {
    userId: String(profile.id),
    nickname: profile.nickname,
    rank: profile.tsRank,
    bio: profile.statusMessage,
    tier: 'PLATINUM', // TODO: 백엔드에서 tier 정보 제공 시 매핑 필요
    tierScore: profile.trustScore,
    ranking: {
      rank: profile.tsRank,
      percentile: 5, // TODO: 백엔드에서 제공 시 매핑
    },
    temperScore: profile.trustScore,
    positivityRating: profile.positivePercentage,
    playStyles: [profile.playStyle], // TODO: 배열 형태로 제공 시 매핑
    preferredTags: [], // TODO: preferredCategoryIds를 태그로 변환
    feedbackTags: [], // TODO: feedbackTags 매핑
    gameAccounts: profile.verifiedAccounts.map(acc => ({
      game: String(acc.gameId), // TODO: gameId를 게임 이름으로 변환
      nickname: acc.accountId,
      tag: '',
    })),
    gameStats: [], // TODO: 게임 통계 정보 매핑
    favoriteGames: profile.favoriteGameIds?.map((gameId, index) => ({
      rank: index + 1,
      game: String(gameId), // TODO: gameId를 게임 이름으로 변환
    })) || [],
  };
}

/**
 * Friend를 FriendData로 변환
 */
function mapFriendToFriendData(friend: Friend): FriendData {
  return {
    userId: String(friend.userId),
    nickname: friend.nickname,
    profileImage: friend.avatarUrl,
    tierScore: friend.trustScore,
    isOnline: false, // TODO: 온라인 상태 정보 추가 필요
  };
}

/**
 * 내 프로필 정보 조회
 */
export async function getMyProfile(): Promise<MyProfileData> {
  const profile = await getMyProfileFromService();
  return mapUserProfileToMyProfileData(profile);
}

/**
 * 받은 피드백 목록 조회
 */
export async function getMyFeedbacks(cursor?: number, limit: number = 10): Promise<FeedbackData[]> {
  const res = await api.get<FeedbacksResponse>('/users/me/feedbacks', {
    params: { cursor, limit }
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('피드백 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data.feedbacks.map(mapFeedbackItemToFeedbackData);
}

/**
 * 내가 작성한 글 목록 조회
 */
export async function getMyPosts(cursor?: number, limit: number = 10): Promise<MyPostsData> {
  try {
    // 3개의 API를 병렬로 호출
    const [partiesRes, highlightsRes, communityRes] = await Promise.all([
      api.get<PartiesResponse>('/parties/me', { params: { cursor, limit } }),
      api.get<HighlightsResponse>('/highlights/me', { params: { cursor, limit } }),
      api.get<CommunityPostsResponse>('/community/me', { params: { cursor, limit } }),
    ]);

    // 파티 데이터 변환
    const matchingPosts = partiesRes.data.statusCode === 200 && partiesRes.data.data
      ? partiesRes.data.data.parties.map(party => ({
          id: party.partyId,
          game: '', // TODO: gameId를 게임명으로 변환
          title: party.title,
          tier: party.tierName,
          tags: party.tags.map(t => t.name),
          azit: party.azitName,
          position: party.positions.map(p => p.positionName),
          memo: party.memo,
          currentMembers: party.currentParticipants,
          maxMembers: party.participants,
          time: party.createdAt,
          views: party.viewCount,
          likes: party.likeCount,
          isLiked: party.isLiked,
          comments: party.commentCount,
          tsScore: party.host.trustScore,
          mic: party.isMic,
          hostUser: {
            id: String(party.host.id),
            nickname: party.host.nickname,
            avatarUrl: party.host.avatarUrl,
          },
        }))
      : [];

    // 하이라이트 데이터 변환
    const highlightPosts = highlightsRes.data.statusCode === 200 && highlightsRes.data.data
      ? highlightsRes.data.data.highlights.map(highlight => ({
          id: highlight.highlight_id,
          userId: highlight.user_id,
          nickname: highlight.nickname,
          content: highlight.content,
          medias: highlight.medias.map(m => m.media_url),
          likeCount: highlight.like_count,
          commentCount: highlight.comment_count,
          isLiked: highlight.is_liked,
          createdAt: highlight.created_at,
          updatedAt: highlight.updated_at,
        }))
      : [];

    // 커뮤니티 게시글 데이터 변환
    const communityPosts = communityRes.data.statusCode === 200 && communityRes.data.data
      ? communityRes.data.data.posts.map(post => ({
          id: post.post_id,
          userId: post.user_id,
          nickname: post.nickname,
          gameId: post.game_id,
          author: post.nickname,
          date: post.created_at,
          createdAt: post.created_at,
          game: '', // TODO: gameId를 게임명으로 변환
          title: post.title,
          content: post.content,
          likes: post.like_count,
          isLiked: post.is_liked,
          views: 0, // TODO: 조회수 정보 추가 필요
          comments: post.comment_count,
          thumbnail: post.medias[0]?.media_url,
        }))
      : [];

    return {
      matchingPosts,
      highlightPosts,
      communityPosts,
    };
  } catch (error) {
    console.error('내 게시글을 불러오는 중 오류가 발생했습니다:', error);
    return {
      matchingPosts: [],
      highlightPosts: [],
      communityPosts: [],
    };
  }
}

/**
 * 친구 목록 조회
 */
export async function getFriends(): Promise<FriendData[]> {
  const friends = await getFriendsFromService();
  return friends.map(mapFriendToFriendData);
}

/**
 * 차단 사용자 목록 조회
 */
export async function getBlockedUsers(): Promise<BlockedUserData[]> {
  // TODO: 백엔드에 차단 사용자 API 엔드포인트 추가 시 실제 API로 교체
  // 임시 목 데이터
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      userId: 'blocked-1',
      nickname: '차단유저1',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blocked1',
      blockedAt: '2026-01-15T10:30:00Z',
      tier: 'GOLD',
      tierScore: 65,
    },
    {
      userId: 'blocked-2',
      nickname: '차단유저2',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blocked2',
      blockedAt: '2026-01-20T14:20:00Z',
      tier: 'SILVER',
      tierScore: 45,
    },
  ];
}

/**
 * 친구 삭제
 */
export async function removeFriend(userId: string): Promise<void> {
  const friendId = Number(userId);
  await deleteFriendFromService(friendId);
}

/**
 * 친구 추가
 */
export async function addFriend(userId: string, message?: string): Promise<void> {
  // TODO: 백엔드 친구 신청 API에 메시지 파라미터 추가 필요
  // const toUserId = Number(userId);
  // await sendFriendRequest(toUserId, message);
  console.warn('친구 추가 API에서 메시지 기능은 아직 지원되지 않습니다.');
  console.log('친구 추가:', { userId, message });
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 차단 해제
 */
export async function unblockUser(userId: string): Promise<void> {
  // TODO: 백엔드에 차단 해제 API 엔드포인트 추가 필요
  // const res = await api.delete(`/users/blocked/${userId}`);
  console.warn('차단 해제 API가 아직 구현되지 않았습니다.');
  console.log('차단 해제:', userId);
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 신고 제출
 */
export async function submitReport(data: {
  targetUserId: string;
  reportType: string;
  name: string;
  email: string;
  title: string;
  content: string;
  images?: File[];
  videos?: File[];
}): Promise<void> {
  const medias = [...(data.images || []), ...(data.videos || [])];
  
  await createReport({
    target_id: Number(data.targetUserId),
    name: data.name,
    report_type: data.reportType,
    title: data.title,
    content: data.content,
    email: data.email,
    medias: medias.length > 0 ? medias : undefined,
  });
}
