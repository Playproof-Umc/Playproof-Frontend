// src/features/home/components/sections/HotTopicsSection.tsx

import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";

export function HotTopicsSection() {
  return (
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
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-zinc-900">{i + 1}</div>
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
  );
}
