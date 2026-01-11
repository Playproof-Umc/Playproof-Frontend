import * as React from "react";

type Friend = {
  name: string;
  game: string;
  status: string;
  avatarUrl?: string;
};

type FriendListProps = {
  friends: Friend[];
};

export function FriendList({ friends }: FriendListProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">친구 목록</h3>
        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          모두보기 →
        </button>
      </div>

      <div className="space-y-3">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/5"
          >
            {/* 아바타 */}
            <div className="relative h-10 w-10 shrink-0">
              <div className="h-full w-full overflow-hidden rounded-full bg-zinc-200">
                {friend.avatarUrl ? (
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-zinc-400">
                    <UserIcon />
                  </div>
                )}
              </div>
              {/* 온라인 상태 표시 */}
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>

            {/* 정보 */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-zinc-900">
                {friend.name}
              </div>
              <div className="truncate text-xs text-zinc-500">
                {friend.game} · {friend.status}
              </div>
            </div>

            {/* 초대 버튼 */}
            <button className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800">
              초대
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
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
