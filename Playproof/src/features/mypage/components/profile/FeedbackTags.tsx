// src/features/mypage/components/profile/FeedbackTags.tsx

import { MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';

interface FeedbackTagsProps {
  feedbackTags: string[];
}

export function FeedbackTags({ feedbackTags }: FeedbackTagsProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-gray-900">
        {MYPAGE_SECTION_LABELS.feedbackTags}
      </h3>
      <div className="flex flex-wrap gap-2">
        {feedbackTags.map((tag, index) => (
          <span key={index} className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
