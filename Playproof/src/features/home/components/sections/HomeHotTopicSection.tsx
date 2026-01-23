import * as React from "react";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";

const HOT_TOPICS = [
  { title: "레전드 리썰 버그 발견했습니다 ㅋㅋ", stats: "🔥 1,232 좋아요 · 💬 45 댓글" },
  { title: "브론즈 탈출 꿀팁 공유", stats: "🔥 980 좋아요 · 💬 32 댓글" },
  { title: "오늘 패치 요약 정리", stats: "🔥 842 좋아요 · 💬 18 댓글" },
  { title: "컨트롤러 세팅 추천", stats: "🔥 621 좋아요 · 💬 9 댓글" },
] as const;

export function HomeHotTopicSection() {
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
        {HOT_TOPICS.map((topic, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex items-center gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
          >
            <div className="text-2xl font-bold text-zinc-900 w-8 text-center">
              {i + 1}
            </div>
            <div>
              <div className="font-semibold text-zinc-900">{topic.title}</div>
              <div className="text-sm text-zinc-500 mt-1">{topic.stats}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
