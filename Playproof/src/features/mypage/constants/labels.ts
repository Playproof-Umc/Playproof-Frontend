// src/features/mypage/constants/labels.ts

export const MYPAGE_SECTION_LABELS = {
  profile: "내 프로필",
  activity: "내 활동",
  friends: "친구 목록",
  feedback: "피드백",
  writtenPosts: "작성 게시판 글",
  blockedUsers: "차단 유저",
  recentMatchingPosts: "최근 작성한 매칭 글",
  recentHighlights: "최근 작성한 하이라이트",
  recentCommunityPosts: "최근 작성한 커뮤니티 글",
  favoriteGames: "즐겨찾는 게임",
  gameStats: "게임별 통계",
  gameAccounts: "게임 아이디",
  playStyle: "플레이 스타일",
  preferredTags: "선호 태그",
  feedbackTags: "주요 피드백 태그",
  feedbackTitle: "받은 피드백",
} as const;

export const MYPAGE_SECTION_IDS = {
  profile: "내프로필",
  feedback: "피드백",
  writtenPosts: "작성게시판글",
  friends: "친구목록",
} as const;

export type MyPageSectionId = (typeof MYPAGE_SECTION_IDS)[keyof typeof MYPAGE_SECTION_IDS];

export const MYPAGE_ACTION_LABELS = {
  viewProfile: "프로필 보기",
  addFriend: "친구추가",
  removeFriend: "친구 삭제",
  report: "신고하기",
  searchFriendPlaceholder: "친구 검색...",
  statusPlaceholder: "상태메시지를 입력하세요",
  statusEmpty: "상태메시지를 입력해주세요",
  emptyFriends: "친구가 없습니다.",
  emptySearch: "검색 결과가 없습니다.",
  emptyBlocked: "차단한 사용자가 없습니다.",
  emptyMatchingPosts: "작성한 매칭 글이 없습니다.",
  emptyHighlights: "작성한 하이라이트가 없습니다.",
  emptyCommunityPosts: "작성한 커뮤니티 글이 없습니다.",
  loading: "로딩 중...",
  dataLoadFail: "데이터를 불러올 수 없습니다.",
  retry: "다시 시도",
  profileLoadError: "프로필 데이터를 불러올 수 없습니다",
  profileFetchFail: "프로필을 불러오는데 실패했습니다",
  addFriendTitle: "친구 추가",
  addFriendPrompt: "친구로 추가할 유저의 닉네임을 입력해주세요.",
  addFriendInputPlaceholder: "닉네임을 입력해주세요",
  addFriendConfirmTitle: "해당 유저를 추가하시겠습니까?",
  cancel: "취소",
  confirm: "확인",
  save: "저장",
  confirmRemoveFriend: "정말 친구를 삭제하시겠습니까?",
  confirmUnblock: "차단을 해제하시겠습니까?",
  removeFriendFail: "친구 삭제에 실패했습니다.",
  unblockFail: "차단 해제에 실패했습니다.",
} as const;

export const MYPAGE_FEEDBACK_LABELS = {
  totalPrefix: "총",
  totalSuffix: "개의 피드백",
  empty: "피드백이 없습니다.",
} as const;

export const MYPAGE_REPORT_LABELS = {
  title: "신고&문의",
  name: "이름",
  namePlaceholder: "실명(ex.홍길동)",
  email: "이메일",
  emailPlaceholder: "이메일을 입력해주세요",
  category: "신고분류",
  categoryPlaceholder: "선택하세요",
  contentTitle: "글 작성",
  contentTitlePlaceholder: "제목을 입력해주세요. (최대 20자)",
  contentPlaceholder: "내용을 입력해주세요.",
  imageUpload: "사진 등록",
  videoUpload: "영상 등록",
  videoLimit: "(최대 60초)",
  upload: "업로드",
} as const;

export const MYPAGE_REPORT_TYPES = [
  "피드백 이의제기",
  "비매너 유저 신고",
  "서비스 문의",
] as const;
