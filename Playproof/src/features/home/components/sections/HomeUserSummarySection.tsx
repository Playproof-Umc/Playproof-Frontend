// src/features/home/components/sections/HomeUserSummarySection.tsx

import { UserSummaryCard } from "@/features/home/components";
import type { HomeUserSummarySectionProps } from "@/features/home/components/sections/types";

export const HomeUserSummarySection = ({
  loading,
  user,
  displayName,
  onEditProfile,
}: HomeUserSummarySectionProps) => {
  return (
    <>
      {loading && <UserSummaryCardSkeleton />}
      {!loading && user && (
        <UserSummaryCard
          name={displayName}
          avatarUrl={user.avatarUrl}
          chips={user.chips}
          stats={user.stats}
          onEdit={onEditProfile}
        />
      )}
    </>
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
      </div>
    </section>
  );
}
