import * as React from "react";
import { CommunityPostCard } from "@/features/home/components/CommunityPostCard";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";

export function HighlightCommunitySection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {HOME_SECTION_LABELS.highlightCommunityTitle}
        </h2>
        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          {HOME_ACTION_LABELS.more}
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
  );
}
