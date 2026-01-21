// src/data/mockData.ts
import type { User, Schedule, Channel, Clip } from '@/types'; // 타입 추가 Import
import type { MatchingData } from '@/features/matching/types/types'; // 매칭 글을 MatchingData 타입으로 import

// [Develop] HomePage용 타입 및 Mock 데이터
export type UserStat = {
  label: string;
  value: string | number;
};

export type UserSummary = {
  name: string;
  avatarUrl?: string;
  chips: string[];
  stats: UserStat[];
};

/**
 * 나중에 실제 API로 대체할 자리.
 * 지금은 네트워크 호출처럼 보이도록 Promise + 지연을 둠.
 */
export function fetchUserSummaryMock(delayMs = 350): Promise<UserSummary> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "레나",
        avatarUrl: undefined,
        chips: ["파티 찾기", "소울 밸런", "실력중심", "즐겜 유저"],
        stats: [
          { label: "긍정 피드백", value: "99%" },
          { label: "응답률", value: "98%" },
          { label: "매칭횟수", value: 142 },
        ],
      });
    }, delayMs);
  });
}

// [Combined] 전역 멤버 리스트 (유저 DB)
// HEAD와 develop의 데이터가 동일하므로 하나로 통합합니다.
export const mockMembers: User[] = [
  { id: 'u1', nickname: '레나', avatarUrl: '', isOnline: true },
  { id: 'u2', nickname: '엘릭', avatarUrl: '', isOnline: false },
  { id: 'u3', nickname: '발베니', avatarUrl: '', isOnline: true },
  { id: 'u4', nickname: '구름', avatarUrl: '', isOnline: false }
];

// [Develop] 아지트 일정 데이터
export const mockSchedules: Schedule[] = [
  {
    id: '1', title: '데바데 5인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-22'),
    participants: [
      { user: mockMembers[0], status: 'JOIN' },
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[2], status: 'JOIN' },
      { user: mockMembers[3], status: 'JOIN' },
    ]
  },
  {
    id: '2', title: '데바데 5인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-08'),
    isCompleted: true,
    participants: [
      { user: mockMembers[0], status: 'JOIN' },
      { user: mockMembers[1], status: 'JOIN' },
      { user: mockMembers[2], status: 'JOIN' },
      { user: mockMembers[3], status: 'JOIN' },
      { user: { id: 'u5', nickname: '유저5', avatarUrl: '' } as User, status: 'JOIN' },
    ]
  },
  {
    id: '3', title: '데바데 3인큐', dateStr: 'Mon 22', timeStr: '20:00', fullDate: new Date('2025-12-08'),
    needMembers: true,
    participants: [
       { user: mockMembers[0], status: 'JOIN' },
       { user: mockMembers[1], status: 'JOIN' },
       { user: mockMembers[2], status: 'JOIN' },
    ]
  }
];

// [Develop] 보이스 채널
export const mockVoiceChannels: Channel[] = [
  { 
    id: 'v1', name: '로비', type: 'VOICE', 
    connectedUsers: [ mockMembers[0], mockMembers[2] ] 
  },
  { id: 'v2', name: '스크림 룸', type: 'VOICE', connectedUsers: [] }
];

// [Develop] 채팅 채널
export const mockChatChannels: Channel[] = [
  { id: 'c1', name: '팀채팅', type: 'TEXT' },
  { id: 'c2', name: '수다방', type: 'TEXT' },
  { id: 'c3', name: '공지사항', type: 'TEXT' }
];

// [Develop] 클립
export const mockClips: Clip[] = [
  { id: 'cl1', date: '2025.12.18', thumbnailUrl: '' },
  { id: 'cl2', date: '2025.12.16', thumbnailUrl: '' },
  { id: 'cl3', date: '2025.12.13', thumbnailUrl: '' }
];

// Community 페이지용 타입 및 Mock 데이터

export type HighlightPost = {
  id: number;
  author: string;
  date: string;
  title?: string;
  content: string;
  likes: number;
  views?: number;
  comments: number;
  images: string[];
};

export type BoardPost = {
  id: number;
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  thumbnail?: string;
};

export type Comment = {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
  replies: number;
};

// 하이라이트 게시글 Mock 데이터
export const MOCK_HIGHLIGHT_POSTS: HighlightPost[] = [
  {
    id: 1,
    author: "레나",
    date: "2시간 전",
    title: "개웃긴 꿀잼 하이라이트 볼 사람",
    content: "안녕하세요! 오늘 랭크 게임에서 미친 플레이 나와서 공유합니다~",
    likes: 200,
    views: 1500,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    ],
  },
  {
    id: 2,
    author: "레나",
    date: "4시간 전",
    title: "이번 시즌 최고의 순간",
    content: "1대5 에이스 성공! 진짜 손 떨렸어요 ㅋㅋㅋ",
    likes: 200,
    views: 980,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800",
    ],
  },
  {
    id: 3,
    author: "레나",
    date: "5시간 전",
    title: "클러치 성공!",
    content: "팀원들 다 죽고 혼자서 역전했어요 ㅠㅠ",
    likes: 200,
    views: 850,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800",
    ],
  },
  {
    id: 4,
    author: "레나",
    date: "6시간 전",
    title: "프로 못지않은 플레이",
    content: "이거 보고 다들 놀라셨을 거예요 ㅋㅋ",
    likes: 200,
    views: 1200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800",
    ],
  },
  {
    id: 5,
    author: "레나",
    date: "7시간 전",
    title: "역대급 하이라이트",
    content: "이런 플레이는 처음이에요! 같이 감상해요~",
    likes: 200,
    views: 2100,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    ],
  },
  {
    id: 6,
    author: "레나",
    date: "8시간 전",
    title: "완벽한 타이밍",
    content: "이런 순간을 위해 게임하는 거 아니겠습니까 ㅋㅋ",
    likes: 200,
    views: 1680,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
    ],
  },
];

// 자유게시판 게시글 Mock 데이터
export const MOCK_BOARD_POSTS: BoardPost[] = [
  {
    id: 1,
    author: "레나",
    date: "10분 전",
    title: "모두 화이팅입니다~~!!",
    content: "게시글 내용 미리보기...",
    likes: 123,
    views: 1230,
    comments: 8,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200",
  },
  {
    id: 2,
    author: "레나",
    date: "1시간 전",
    title: "모두 화이팅입니다~~!!",
    content: "게시글 내용 미리보기...",
    likes: 123,
    views: 1230,
    comments: 8,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200",
  },
  {
    id: 3,
    author: "레나",
    date: "2시간 전",
    title: "모두 화이팅입니다~~!!",
    content: "게시글 내용 미리보기...",
    likes: 123,
    views: 1230,
    comments: 8,
  },
  {
    id: 4,
    author: "레나",
    date: "3시간 전",
    title: "모두 화이팅입니다~~!!",
    content: "게시글 내용 미리보기...",
    likes: 95,
    views: 890,
    comments: 5,
    thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=200",
  },
  {
    id: 5,
    author: "레나",
    date: "4시간 전",
    title: "모두 화이팅입니다~~!!",
    content: "게시글 내용 미리보기...",
    likes: 87,
    views: 750,
    comments: 3,
  },
];

// 댓글 Mock 데이터
export const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "게이머1",
    avatarUrl: "",
    content: "저랑 듀오 하실래요~? 저랑하실분~?",
    date: "5분전",
    replies: 1,
  },
  {
    id: "2",
    author: "게이머2",
    avatarUrl: "",
    content: "저랑 듀오 하실래요~? 친추할게요",
    date: "6분전",
    replies: 0,
  },
  {
    id: "3",
    author: "게이머3",
    avatarUrl: "",
    content: "저랑 듀오 하실래요~? 친추할게요",
    date: "5분전",
    replies: 0,
  },
];

// 마이페이지 사용자 프로필 데이터
export interface MyProfileData {
  userId: string;
  nickname: string;
  rank: number;
  profileImage?: string;
  bio: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  tierScore: number;
  ranking: {
    rank: number;
    percentile: number; // uxScore -> percentile로 변경
  };
  temperScore: number;
  positivityRating: number;
  playStyles: string[];
  preferredTags: string[];
  feedbackTags: string[];
  gameAccounts: {
    game: string;
    nickname: string;
    tag: string;
  }[];
  gameStats: {
    game: string;
    tier?: string;
    playTime?: string;
    position?: string;
    totalGames?: number;
    winRate?: number;
    kda?: number;
  }[];
  favoriteGames: {
    rank?: number;
    game: string;
  }[];
}

export const MOCK_MY_PROFILE: MyProfileData = {
  userId: 'user-1',
  nickname: '레나',
  rank: 1,
  bio: '왓! 진짜 어렵다!!!@@#@#@$%$%^',
  tier: 'PLATINUM',
  tierScore: 90,
  ranking: {
    rank: 40,
    percentile: 5, // 상위 5%를 의미
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

// API 시뮬레이션 함수
export const fetchMyProfile = (): Promise<MyProfileData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MY_PROFILE);
    }, 500);
  });
};

// 피드백 데이터 타입
export interface FeedbackData {
  id: string;
  fromUser: {
    userId: string;
    nickname: string;
    profileImage?: string;
  };
  game: string;
  temperScoreChange: number;
  tags: string[];
  memo?: string;
  createdAt: string;
}

// Mock 피드백 데이터
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

// 피드백 목록 조회 함수
export async function fetchMyFeedbacks(delayMs = 300): Promise<FeedbackData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FEEDBACKS);
    }, delayMs);
  });
}

// 내 게시글 데이터 타입 수정
export interface MyPostsData {
  matchingPosts: MatchingData[]; // any[] -> MatchingData[]로 변경
  highlightPosts: HighlightPost[];
  communityPosts: BoardPost[];
}

// 매칭 글 Mock 데이터 (MatchingData 타입에 맞게)
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
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined }
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
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined }
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
    hostUser: { id: 'user-1', nickname: '레나', avatarUrl: undefined }
  },
];

// Mock 내 게시글 데이터
export const MOCK_MY_POSTS: MyPostsData = {
  matchingPosts: MOCK_MATCHING_POSTS,
  highlightPosts: MOCK_HIGHLIGHT_POSTS.slice(0, 3),
  communityPosts: MOCK_BOARD_POSTS.slice(0, 5),
};

// 내 게시글 조회 함수
export async function fetchMyPosts(delayMs = 300): Promise<MyPostsData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MY_POSTS);
    }, delayMs);
  });
}

// 친구 데이터 타입
export interface FriendData {
  userId: string;
  nickname: string;
  profileImage?: string;
  isOnline: boolean;
  lastSeen?: string;
  tier?: string;
  tierScore?: number;
}

// Mock 친구 데이터
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

// 친구 목록 조회 함수
export async function fetchFriends(delayMs = 300): Promise<FriendData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FRIENDS);
    }, delayMs);
  });
}

// 차단 사용자 데이터 타입
export interface BlockedUserData {
  userId: string;
  nickname: string;
  profileImage?: string;
  blockedAt: string;
  tier?: string;
  tierScore?: number;
}

// Mock 차단 사용자 데이터
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

// 차단 사용자 목록 조회 함수
export async function fetchBlockedUsers(delayMs = 300): Promise<BlockedUserData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BLOCKED_USERS);
    }, delayMs);
  });
}
