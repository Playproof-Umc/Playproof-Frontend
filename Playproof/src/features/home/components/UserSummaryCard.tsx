// src/features/home/components/UserSummaryCard.tsx


type Stat = {
  label: string;
  value: string | number;
};

type UserSummaryCardProps = {
  name: string;
  avatarUrl?: string;
  chips?: string[];
  stats: Stat[];
  onEdit?: () => void;
  className?: string;
};

export function UserSummaryCard({
  name,
  avatarUrl,
  chips = [],
  stats,
  onEdit,
  className = "",
}: UserSummaryCardProps) {
  return (
    <section
      className={[
        "w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5",
        "px-6 py-5",
        className,
      ].join(" ")}
      aria-label="사용자 요약 카드"
    >
      <div className="flex items-center justify-between gap-6">
        {/* LEFT: profile */}
        <div className="flex min-w-0 items-center gap-4">
          {/* avatar */}
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-black/5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${name} 프로필 이미지`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-zinc-400">
                <UserIcon />
              </div>
            )}
          </div>

          {/* name + chips */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-zinc-900">
                {name}
              </h2>

              <button
                type="button"
                onClick={onEdit}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-50 active:bg-zinc-100"
                aria-label="프로필 수정"
              >
                <PencilIcon />
              </button>
            </div>

            {chips.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: stats */}
        <div className="hidden shrink-0 grid-cols-3 gap-10 md:grid">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="text-right">
              <div className="text-xs font-medium text-zinc-500">{s.label}</div>
              <div className="mt-1 text-base font-semibold text-zinc-900">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 md:hidden">
        {stats.slice(0, 3).map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-zinc-50 px-3 py-2 ring-1 ring-black/5"
          >
            <div className="text-[11px] font-medium text-zinc-500">
              {s.label}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-zinc-900">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- Icons (no deps) --- */

function UserIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-zinc-700"
    >
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
