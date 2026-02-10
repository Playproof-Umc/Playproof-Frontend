// src/features/home/components/sections/PopularUsersSection.tsx

import { PopularUserCard } from "@/features/home/components/PopularUserCard";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";
import { useAuthStore } from "@/store/authStore";

export function PopularUsersSection() {
  const authNickname = useAuthStore((s) => s.nickname);
  const displayName = authNickname ?? "레나";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {HOME_SECTION_LABELS.popularUsersTitle}
        </h2>
        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          {HOME_ACTION_LABELS.filter}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <PopularUserCard
            key={i}
            name={displayName}
            tier="실버"
            rank="3/4"
            tags={["#실력 중시", "#욕설 X", "#오더 가능"]}
            recentGames="같이 할 사람 구해요"
            status={i === 0 ? "available" : "offline"}
          />
        ))}
      </div>
    </section>
  );
}
