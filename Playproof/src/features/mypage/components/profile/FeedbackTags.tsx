import React from 'react';

interface FeedbackTagsProps {
  feedbackTags: string[];
}

export function FeedbackTags({ feedbackTags }: FeedbackTagsProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-gray-900">주요 피드백 태그</h3>
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