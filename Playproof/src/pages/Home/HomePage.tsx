import * as React from "react";
import { Navbar } from "../../components/Navbar";
import { UserSummaryCard } from "./components/UserSummaryCard.tsx";
import { PartyCard } from "./components/PartyCard";
import { FriendList } from "./components/FriendList";
import { MatchingTabs } from "./components/MatchingTabs";
import { PopularUserCard } from "./components/PopularUserCard";
import { CommunityPostCard } from "./components/CommunityPostCard";
import { fetchUserSummaryMock, type UserSummary } from "./userSummaryMock";

export default function HomePage() {
  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchUserSummaryMock();
        if (!alive) return;
        setUser(data);
      } catch (e) {
        console.log("user summary mock error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* 사용자 요약 카드 */}
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

          {/* 파티 모집 & 친구 목록 */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="relative lg:col-span-2">
              <PartyCard
                title="데바데 4인큐"
                game="Dead by Daylight"
                currentPlayers={3}
                maxPlayers={4}
                time="오늘 오후 5시"
                isRecruiting={true}
              />
            </div>

            <div>
              <FriendList
                friends={[
                  {
                    name: "유저 11.9점",
                    game: "발로란트",
                    status: "게임 대기중",
                  },
                  {
                    name: "유저 15.99점",
                    game: "리그오브레전드",
                    status: "게임중",
                  },
                  {
                    name: "유저 11.9점",
                    game: "발로란트",
                    status: "대기 대기중",
                  },
                ]}
              />
            </div>
          </div>

          {/* 일반 매칭 섹션 */}
          <MatchingTabs />

          {/* 인기 유저 섹션 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">인기 유저 🔥</h2>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                필터 ↓
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PopularUserCard
                  key={i}
                  name="레나"
                  tier="실버"
                  rank="3/4"
                  tags={["#재미중시", "#무제한", "#오전중반"]}
                  recentGames="은어 및 사람 구해요"
                  status={i === 0 ? "available" : "offline"}
                />
              ))}
            </div>
          </section>

          {/* 하이라이트 커뮤니티 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                🔥 하이라이트 커뮤니티
              </h2>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                더보기 →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CommunityPostCard
                  key={i}
                  author="레나"
                  date="2025.12.16"
                  title="보석 실버 3/4"
                  content="인게 내용으로 직성한 선은 혜택이 있씁니댜 슨녀 예쁘셔를 지은 헉헉 또또또..."
                  likes={200}
                  comments={50}
                />
              ))}
            </div>
          </section>

          {/* 아지트 페이지마케팅 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                🏠 아지트 페이지마케팅
              </h2>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                더보기 →
              </button>
            </div>

            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900">
                        채린이 대표 팀
                      </div>
                      <div className="text-sm text-zinc-500">
                        1232 좋아요 · 1 댓글
                      </div>
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
}

/** 로딩 중 스켈레톤 (대충 카드 크기 맞춰둔 버전) */
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

        <div className="hidden grid-cols-3 gap-10 md:grid">
          <div className="h-10 w-20 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 w-20 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 w-20 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    </section>
  );
}
