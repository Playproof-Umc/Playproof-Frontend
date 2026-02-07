// src/features/home/components/PopularUserCard.tsx


type PopularUserCardProps = {
  name: string;
  tier: string;
  rank: string;
  tags: string[];
  recentGames: string;
  avatarUrl?: string;
  status?: "available" | "busy" | "offline";
};

export function PopularUserCard({
  name,
  tier,
  rank,
  tags,
  recentGames,
  avatarUrl,
  status = "offline",
}: PopularUserCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      {/* 헤더 - Overwatch 레이블 */}
      <div className="mb-3 text-xs font-medium text-zinc-500">Overwatch</div>

      {/* 프로필 */}
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <div className="relative h-12 w-12 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full bg-zinc-200">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-zinc-400">
                <UserIcon />
              </div>
            )}
          </div>
          {status === "available" && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-zinc-900">
              {name}
            </h3>
            <button
              className="shrink-0 text-zinc-400 hover:text-zinc-600"
              aria-label="수정"
            >
              <PencilIcon />
            </button>
          </div>

          {/* 티어 배지 */}
          <div className="mt-1 flex items-center gap-1.5">
            <TierBadge tier={tier} rank={rank} />
            <ThreeDotIcon />
          </div>
        </div>
      </div>

      {/* 태그 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 최근 전적 */}
      <div className="mt-4 rounded-lg bg-zinc-50 px-3 py-2">
        <div className="text-xs font-medium text-zinc-500">최근 전적 3/4</div>
        <div className="mt-0.5 text-sm font-semibold text-zinc-900">
          {recentGames}
        </div>
      </div>

      {/* 액션 버튼 */}
      <button className="mt-4 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800">
        매칭 요청
      </button>
    </article>
  );
}

function TierBadge({ tier, rank }: { tier: string; rank: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5">
      <TierIcon />
      <span className="text-xs font-semibold text-zinc-700">
        {tier} {rank}
      </span>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TierIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ThreeDotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
