// src/features/mypage/data/mockMyPageData.ts

import type {
  BlockedUserData,
  FeedbackData,
  FriendData,
  MyPostsData,
  MyProfileData,
} from '@/features/mypage/types';
import type { MatchingData } from '@/features/matching/types';
import { MOCK_BOARD_POSTS, MOCK_HIGHLIGHT_POSTS } from '@/features/community/data/mockCommunityData';

export const MOCK_MY_PROFILE: MyProfileData = {
  userId: 'user-1',
  nickname: '레나',
  rank: 1,
  bio: '왓! 진짜 어렵다!!!@@#@#@$%$%^',
  tier: 'PLATINUM',
  tierScore: 90,
  ranking: {
    rank: 40,
    percentile: 5,
  },
  temperScore: 88,
  positivityRating: 90,
  playStyles: ['실력 중심', '마이크 필수', '시간 협의'],
  preferredTags: ['소통 원활', '즐겜 유저', '욕설 X'],
  feedbackTags: ['소통 원활', '즐겜 유저', '욕설 X'],
  gameAccounts: [
    {
      game: '리그 오브 레전드',
      nickname: '레나',
      tag: '#rena9',
    },
    {
      game: '오버워치',
      nickname: '레나',
      tag: '#overwatchRena',
    },
  ],
  gameStats: [
    {
      game: '리그 오브 레전드',
      tier: '골드',
      position: '원딜',
      winRate: 66,
      kda: 3.5,
    },
    {
      game: '오버워치',
      tier: '플래티넘',
      playTime: '350시간',
      position: '탱커',
      totalGames: 500,
      winRate: 45,
    },
  ],
  favoriteGames: [
    { rank: 1, game: '리그 오브 레전드' },
    { rank: 2, game: '오버쿡드' },
  ],
};

export const fetchMyProfile = (): Promise<MyProfileData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MY_PROFILE);
    }, 500);
  });
};

export const MOCK_FEEDBACKS: FeedbackData[] = [
  {
    id: 'fb-1',
    fromUser: {
      userId: 'user-2',
      nickname: '플레이어1',
      profileImage: undefined,
    },
    game: '리그 오브 레전드',
    temperScoreChange: 5,
    tags: ['매너가 좋아요', '실력이 좋아요'],
    memo: '정말 좋은 팀원이었습니다!',
    createdAt: '2024-01-20',
  },
  {
    id: 'fb-2',
    fromUser: {
      userId: 'user-3',
      nickname: '플레이어2',
      profileImage: undefined,
    },
    game: '발로란트',
    temperScoreChange: 3,
    tags: ['의사소통이 원활해요', '팀워크가 좋아요'],
    memo: '다음에 또 같이 하고 싶어요',
    createdAt: '2024-01-19',
  },
  {
    id: 'fb-3',
    fromUser: {
      userId: 'user-4',
      nickname: '플레이어3',
      profileImage: undefined,
    },
    game: '리그 오브 레전드',
    temperScoreChange: -2,
    tags: ['욕설을 해요'],
    memo: '게임 중 불쾌한 발언이 있었습니다.',
    createdAt: '2024-01-18',
  },
];

export async function fetchMyFeedbacks(delayMs = 300): Promise<FeedbackData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FEEDBACKS);
    }, delayMs);
  });
}

export const MOCK_MATCHING_POSTS: MatchingData[] = [
  {
    id: 1,
    game: '리그오브레전드',
    title: '칼바람 나락 즐겜팟 구함',
    tier: '골드',
    tags: ['즐겜 유저', '소통 원활'],
    azit: '즐겜러들의 쉼터',
    position: ['top', 'mid'],
    memo: '매너 게임 하실 분만 오세요~',
    currentMembers: 2,
    maxMembers: 5,
    time: '10분 전',
    views: 120,
    likes: 5,
    comments: 2,
    tsScore: 88,
    mic: true,
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined },
  },
  {
    id: 2,
    game: '발로란트',
    title: '경쟁전 빡겜 하실 힐러님',
    tier: '플래티넘',
    tags: ['실력 중심', '마이크 필수'],
    azit: '신규 생성',
    position: ['support'],
    memo: '마이크 필수입니다.',
    currentMembers: 3,
    maxMembers: 5,
    time: '30분 전',
    views: 80,
    likes: 3,
    comments: 1,
    tsScore: 88,
    mic: true,
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined },
  },
  {
    id: 3,
    game: '오버워치',
    title: '경쟁전 탱커 구합니다',
    tier: '다이아',
    tags: ['승리 지향', '마이크 필수'],
    azit: '신규 생성',
    position: ['tank'],
    memo: '다이아 탱커 구합니다. 디스코드 필수!',
    currentMembers: 4,
    maxMembers: 6,
    time: '1시간 전',
    views: 150,
    likes: 7,
    comments: 4,
    tsScore: 88,
    mic: true,
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined },
  },
];

export const MOCK_MY_POSTS: MyPostsData = {
  matchingPosts: MOCK_MATCHING_POSTS,
  highlightPosts: MOCK_HIGHLIGHT_POSTS.slice(0, 4),
  communityPosts: MOCK_BOARD_POSTS.slice(0, 5),
};

export async function fetchMyPosts(delayMs = 300): Promise<MyPostsData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MY_POSTS);
    }, delayMs);
  });
}

export const MOCK_FRIENDS: FriendData[] = [
  {
    userId: 'friend-1',
    nickname: '레나',
    profileImage: undefined,
    isOnline: true,
    tier: 'PLATINUM',
    tierScore: 95,
  },
  {
    userId: 'friend-2',
    nickname: '레나',
    profileImage: undefined,
    isOnline: false,
    lastSeen: '1시간 전',
    tier: 'GOLD',
    tierScore: 87,
  },
  {
    userId: 'friend-3',
    nickname: '레나',
    profileImage: undefined,
    isOnline: false,
    lastSeen: '2일 전',
    tier: 'SILVER',
    tierScore: 78,
  },
];

export async function fetchFriends(delayMs = 300): Promise<FriendData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FRIENDS);
    }, delayMs);
  });
}

export const MOCK_BLOCKED_USERS: BlockedUserData[] = [
  {
    userId: 'blocked-1',
    nickname: '레나',
    profileImage: undefined,
    blockedAt: '2024-01-10',
    tier: 'BRONZE',
    tierScore: 65,
  },
  {
    userId: 'blocked-2',
    nickname: '레나',
    profileImage: undefined,
    blockedAt: '2024-01-05',
    tier: 'SILVER',
    tierScore: 72,
  },
  {
    userId: 'blocked-3',
    nickname: '레나',
    profileImage: undefined,
    blockedAt: '2023-12-20',
    tier: 'GOLD',
    tierScore: 85,
  },
];

export async function fetchBlockedUsers(delayMs = 300): Promise<BlockedUserData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BLOCKED_USERS);
    }, delayMs);
  });
}
