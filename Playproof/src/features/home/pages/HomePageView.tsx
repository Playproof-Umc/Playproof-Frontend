// src/features/home/pages/HomePageView.tsx

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";

/* 홈 전용 컴포넌트  */
import { 
  UserSummaryCard, 
  MatchingTabs, 
  HomePartyCard,   // 새로 만든 홈 전용 카드
  HomeFriendList   // 새로 만든 홈 전용 친구목록
} from '@/features/home/components';

/* 타 도메인 위젯 (재사용) */
import { PopularMatchList } from '@/features/matching/components/home/PopularMatchList';
import { HomeCommunityHighlightSection } from "@/features/home/components/sections/HomeCommunityHighlightSection";
import { HomeHotTopicSection } from "@/features/home/components/sections/HomeHotTopicSection";
import { SignupCompleteModal } from "@/components/auth/SignupCompleteModal";
import { useSignupCompleteModal } from "@/features/auth/signup/hooks/useSignupCompleteModal";
import { useAuthStore } from "@/store/authStore";
import { useMatchingDetail } from "@/features/matching/context/MatchingDetailContext";
import { HighlightDetailModal } from "@/features/community/components";

/* 매칭 페이지 핵심 기능 */
import { 
  MatchingSearchBar, 
  PartyRequestBanner 
} from '@/features/matching/components';

/* 데이터 및 상수 */
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";
import { MOCK_MATCHING_DATA } from "@/features/matching/data/mockMatchingData";
import { MOCK_MY_AZITS, mockSchedules } from "@/features/team/data/mockTeamData";
import type { MatchingData } from "@/features/matching/types";
import type { HighlightPost, BoardPost } from "@/features/community/types";
import { getBestPosts, getHighlights } from "@/features/community/api/communityApi";
import { MOCK_COMMENTS } from "@/features/community/data/mockCommunityData";
import type { FilterState } from "@/features/matching/types";

/* --- Mock Data 정의 (타입 에러 방지용) --- */

// 파티 참가 요청 데이터
const MOCK_REQUESTS = [
  { id: 1, user: { nickname: "뉴비1", mannerTier: "TS 50" }, message: "껴주세요!" },
  { id: 2, user: { nickname: "고수2", mannerTier: "TS 99" }, message: "캐리해드림" },
];

/* --- Main Component --- */

export const HomePageView = () => {
  const navigate = useNavigate();
  const { open: isSignupCompleteOpen, username, close } = useSignupCompleteModal();
  const authNickname = useAuthStore((s) => s.nickname);
  const { openMatchingDetail } = useMatchingDetail();
  const displayName = authNickname ?? "사용자";
  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [highlights, setHighlights] = React.useState<HighlightPost[]>([]);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [selectedHighlight, setSelectedHighlight] = React.useState<HighlightPost | null>(null);
  const [isHighlightOpen, setIsHighlightOpen] = React.useState(false);
  
  // 상태 관리
  const [activeGameTab, setActiveGameTab] = React.useState("리그오브레전드");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false); 
  const [searchKeyword, setSearchKeyword] = React.useState(""); 
  const [azitIndex, setAzitIndex] = React.useState(0);

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

  const handleHomeMatchClick = (match: MatchingData) => {
    openMatchingDetail(match);
  };

  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedHighlight(post);
    setIsHighlightOpen(true);
  };

  const azitSlides = React.useMemo(() => {
    const schedules = mockSchedules.length > 0 ? mockSchedules : [undefined];
    return MOCK_MY_AZITS.map((azit, idx) => {
      const schedule = schedules[idx % schedules.length];
      const timeLabel = schedule
        ? schedule.date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })
        : "시간 미정";
      return { azit, schedule, timeLabel };
    });
  }, []);


  const filteredPopularMatches = React.useMemo(() => {
    const matchesByGame = MOCK_MATCHING_DATA.filter(
      (m) => m.game === activeGameTab
    );

    return [...matchesByGame]
      .sort((a, b) => b.views + b.likes - (a.views + a.likes))
      .slice(0, 10);
  }, [activeGameTab]);

  // 데이터 로딩 (User Summary)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [data, highlightData, bestData] = await Promise.all([
          fetchUserSummaryMock(),
          getHighlights(1),
          getBestPosts(),
        ]);
        if (!alive) return;
        setUser(data);
        setHighlights(highlightData);
        setBestPosts(bestData);
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
          
          {/* 사용자 요약 (프로필 카드) */}
          {loading && <UserSummaryCardSkeleton />}
          {!loading && user && (
            <UserSummaryCard
              name={displayName}
              avatarUrl={user.avatarUrl}
              chips={user.chips}
              stats={user.stats}
              onEdit={() => navigate("/mypage")}
            />
          )}

          {/* 파티 모집 & 친구 목록 (홈 전용 컴포넌트 사용) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 좌측: 게임 일정 (피그마 디자인 적용된 HomePartyCard) */}
            <div className="relative lg:col-span-2 group">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{ transform: `translateX(-${azitIndex * 100}%)` }}
                >
                  {azitSlides.map((slide) => (
                    <div key={slide.azit.id} className="w-full shrink-0">
                      <HomePartyCard
                        title={slide.schedule?.title ?? "일정 없음"}
                        time={slide.timeLabel}
                        location={slide.azit?.name ?? "아지트"}
                        currentPlayers={slide.schedule?.participants.length ?? 0}
                        maxPlayers={slide.schedule?.maxParticipants ?? 0}
                        memberAvatars={[]} // 실제 멤버 이미지 URL 배열
                        onClick={() =>
                          navigate("/azit", { state: { azitId: slide.azit.id } })
                        }
                      />
                    </div>
                  ))}
                </div>

                {azitSlides.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setAzitIndex((prev) =>
                          prev <= 0 ? azitSlides.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                      aria-label="이전 아지트"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAzitIndex((prev) =>
                          prev >= azitSlides.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                      aria-label="다음 아지트"
                    >
                      →
                    </button>
                  </>
                ) : null}
              </div>
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

          {/* 일반 매칭 섹션 */}
          <section className="space-y-4">
            {/* 파티 참가 요청 배너 (최상단 배치) */}
            <PartyRequestBanner count={MOCK_REQUESTS.length} />

            {/* 탭과 검색바 (위아래 배치) */}
            <div className="flex flex-col gap-4">
              {/* 탭 (검색바 제거된 버전) */}
              <MatchingTabs 
                activeTab={activeGameTab} 
                onTabChange={setActiveGameTab}
                onMoreClick={() => navigate("/matching", { state: { activeGame: activeGameTab } })}
              />
              
              {/* 매칭 페이지와 동일한 검색바 (필터 모달 기능 포함) */}
              <MatchingSearchBar 
                  searchText={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  onSearchSubmit={handleSearchSubmit}
                  onWriteClick={() =>
                    navigate("/matching", {
                      state: { openWriteModal: true, activeGame: activeGameTab },
                    })
                  }
                  isFilterOpen={isFilterOpen}
                  onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                  onFilterClose={() => setIsFilterOpen(false)}
                  onFilterApply={handleFilterApply}
                  activeGame={activeGameTab}
                  userId="user-1" // 로그인한 유저 ID
              />
            </div>
            
            {/* 매칭 리스트 */}
            {/* @ts-expect-error : Mock 데이터 타입 호환용 */}
            <PopularMatchList matches={filteredPopularMatches} onCardClick={handleHomeMatchClick} />
          </section>

          {/* 하이라이트 커뮤니티 */}
          <HomeCommunityHighlightSection
            posts={highlights.slice(0, 3)}
            onPostClick={handleHighlightClick}
          />

          {/* 핫토픽 (간단 리스트) */}
          <HomeHotTopicSection
            posts={bestPosts}
            onMoreClick={() =>
              navigate({ pathname: "/community", search: "?tab=자유게시판" })
            }
            onPostClick={(post) => navigate(`/community/${post.id}?from=자유게시판`)}
          />

        </div>
      </main>

      <SignupCompleteModal
        open={isSignupCompleteOpen}
        username={username}
        onClose={close}
      />
      {selectedHighlight ? (
        <HighlightDetailModal
          post={selectedHighlight}
          comments={MOCK_COMMENTS}
          isOpen={isHighlightOpen}
          onClose={() => setIsHighlightOpen(false)}
        />
      ) : null}
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
