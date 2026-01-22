import * as React from "react";
import { Navbar } from "@/components/common/Navbar";
import { UserSummaryCard, MatchingTabs, PopularUserCard, CommunityPostCard } from '@/features/home/components';
import { PartyCard } from '@/features/team/components';
import { FriendList } from "@/features/user/components/list/FriendList";
import { fetchUserSummaryMock, type UserSummary } from "@/features/home/data/userSummaryMock";

export const HomePageView = () => {
  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeGameTab, setActiveGameTab] = React.useState("리그오브레전드");

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
                    id: 1,
                    nickname: "유저 11.9점",
                    game: "발로란트",
                    status: "게임 대기중",
                  },
                  {
                    id: 2,
                    nickname: "유저 15.99점",
                    game: "리그오브레전드",
                    status: "게임중",
                  },
                  {
                    id: 3,
                    nickname: "유저 11.9점",
                    game: "발로란트",
                    status: "대기 대기중",
                  },
                ]}
              />
            </div>
          </div>

          {/* 일반 매칭 섹션 */}
          <MatchingTabs activeTab={activeGameTab} onTabChange={setActiveGameTab} />

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
                  tags={["#실력 중시", "#욕설 X", "#오더 가능"]}
                  recentGames="같이 할 사람 구해요"
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
                  content="어제 레포 했는데 웃겨 죽는줄ㅋㅋㅋㅋㅋㅋ"
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
                🏠 커뮤니티 핫 토픽
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
                        레전드 리썰 버그
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
};

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
