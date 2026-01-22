// src/features/home/pages/HomePageView.tsx

import * as React from "react";
import { Navbar } from "@/components/common/Navbar";

/* 1. 홈 전용 컴포넌트 (피그마 디자인 적용됨) */
import { 
  UserSummaryCard, 
  MatchingTabs, 
  HomePartyCard,   // 새로 만든 홈 전용 카드
  HomeFriendList   // 새로 만든 홈 전용 친구목록
} from '@/features/home/components';

/* 2. 타 도메인 위젯 (재사용) */
import { PopularMatchList } from '@/features/matching/components/home/PopularMatchList';
import { HighlightFeed } from "@/features/community/components/HighlightFeed";

/* 3. 매칭 페이지 핵심 기능 */
import { 
  MatchingSearchBar, 
  PartyRequestBanner 
} from '@/features/matching/components';

/* 4. 데이터 및 상수 */
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";
import type { FilterState } from "@/features/matching/types";

/* --- Mock Data 정의 (타입 에러 방지용) --- */

// 파티 참가 요청 데이터
const MOCK_REQUESTS = [
  { id: 1, user: { nickname: "뉴비1", mannerTier: "TS 50" }, message: "껴주세요!" },
  { id: 2, user: { nickname: "고수2", mannerTier: "TS 99" }, message: "캐리해드림" },
];

// 인기 매칭 데이터 (MatchingData 타입 호환)
const MOCK_POPULAR_MATCHES = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  game: "오버워치 2",
  title: `경쟁 빡겜 구합니다 ${i + 1}`,
  tier: "Platinum",
  tags: ["#빡겜", "#마이크필수"],
  azit: "강남 아지트",
  position: ["DPS", "SUP"],
  memo: "즐겁게 게임하실 분 구해요.",
  currentMembers: 2,
  maxMembers: 5,
  time: "방금 전",
  views: 120,
  likes: 12,
  comments: 4,
  tsScore: 90,
  mic: true,
  hostUser: {
    id: i + 100,
    nickname: `유저${i}`,
    email: `user${i}@example.com`,
    avatarUrl: undefined,
    mannerTier: "TS 90",
  },
  created: new Date().toISOString()
}));

// 하이라이트 데이터 (HighlightPost 타입 호환)
const MOCK_HIGHLIGHTS = Array.from({ length: 3 }).map((_, i) => ({
  id: i,
  author: "페이커",
  date: "2025.12.16",
  title: "레전드 한타 영상 ㅋㅋㅋ",
  content: "어제 레포 했는데 웃겨 죽는줄ㅋㅋㅋㅋㅋㅋ",
  likes: 350,
  views: 1200,
  comments: 15,
  images: ["https://via.placeholder.com/300"], // images 배열 필수
}));

/* --- Main Component --- */

export const HomePageView = () => {
  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  // 상태 관리
  const [activeGameTab, setActiveGameTab] = React.useState("리그오브레전드");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false); 
  const [searchKeyword, setSearchKeyword] = React.useState(""); 

  // 핸들러: 검색 제출
  const handleSearchSubmit = (text: string) => {
    console.log("홈 검색 실행:", text);
    // TODO: 검색 결과 페이지로 이동하거나 API 호출
  };

  // 핸들러: 필터 적용
  const handleFilterApply = (filters: FilterState) => {
    console.log("홈 필터 적용:", filters);
    setIsFilterOpen(false);
    // TODO: 필터링된 데이터 재조회
  };

  // 데이터 로딩 (User Summary)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchUserSummaryMock();
        if (!alive) return;
        setUser(data);
      } catch (e) {
        console.error("user summary mock error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-8">
          
          {/* 1. 사용자 요약 (프로필 카드) */}
          {loading && <UserSummaryCardSkeleton />}
          {!loading && user && (
            <UserSummaryCard
              name={user.name}
              avatarUrl={user.avatarUrl}
              chips={user.chips}
              stats={user.stats}
              onEdit={() => console.log("edit profile")}
            />
          )}

          {/* 2. 파티 모집 & 친구 목록 (홈 전용 컴포넌트 사용) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 좌측: 게임 일정 (피그마 디자인 적용된 HomePartyCard) */}
            <div className="relative lg:col-span-2">
              <HomePartyCard
                title="데바데 4인큐"
                time="오늘 오후 5시"
                location="아지트 이름"
                currentPlayers={3}
                maxPlayers={4}
                memberAvatars={[]} // 실제 멤버 이미지 URL 배열
                onClick={() => console.log("참여 확정 클릭")}
              />
            </div>

            {/* 우측: 친구 목록 (피그마 디자인 적용된 HomeFriendList) */}
            <div className="h-full">
              <HomeFriendList
                friends={[
                  { id: 1, nickname: "유진", statusMessage: "TS 99", isOnline: true },
                  { id: 2, nickname: "유진", statusMessage: "상태메세지", isOnline: true },
                  { id: 3, nickname: "유진", statusMessage: "TS 90", isOnline: false },
                ]}
              />
            </div>
          </div>

          {/* 3. 일반 매칭 섹션 */}
          <section className="space-y-4">
            {/* 3-1. 파티 참가 요청 배너 (최상단 배치) */}
            <PartyRequestBanner count={MOCK_REQUESTS.length} />

            {/* 3-2. 탭과 검색바 (위아래 배치) */}
            <div className="flex flex-col gap-4">
              {/* 탭 (검색바 제거된 버전) */}
              <MatchingTabs 
                activeTab={activeGameTab} 
                onTabChange={setActiveGameTab} 
              />
              
              {/* 매칭 페이지와 동일한 검색바 (필터 모달 기능 포함) */}
              <MatchingSearchBar 
                  searchText={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  onSearchSubmit={handleSearchSubmit}
                  onWriteClick={() => console.log("글쓰기 모달 열기")}
                  isFilterOpen={isFilterOpen}
                  onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                  onFilterClose={() => setIsFilterOpen(false)}
                  onFilterApply={handleFilterApply}
                  activeGame={activeGameTab}
                  userId="user-1" // 로그인한 유저 ID
              />
            </div>
            
            {/* 3-3. 매칭 리스트 */}
            {/* @ts-ignore : Mock 데이터 타입 호환용 */}
            <PopularMatchList matches={MOCK_POPULAR_MATCHES} />
          </section>

          {/* 4. 하이라이트 커뮤니티 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                {HOME_SECTION_LABELS.highlightCommunityTitle}
              </h2>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                {HOME_ACTION_LABELS.more}
              </button>
            </div>
            <HighlightFeed 
              posts={MOCK_HIGHLIGHTS} 
              onPostClick={(post) => console.log("Go to post", post.id)} 
            />
          </section>

          {/* 5. 핫토픽 (간단 리스트) */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                {HOME_SECTION_LABELS.hotTopicTitle}
              </h2>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                {HOME_ACTION_LABELS.more}
              </button>
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex items-center gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <div className="text-2xl font-bold text-zinc-900 w-8 text-center">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">
                      레전드 리썰 버그 발견했습니다 ㅋㅋ
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                      🔥 1,232 좋아요 · 💬 45 댓글
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

/* --- Skeleton Component --- */
function UserSummaryCardSkeleton() {
  return (
    <section className="w-full rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-100" />
          <div className="space-y-2">
            <div className="h-5 w-28 animate-pulse rounded bg-zinc-100" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}