import React from 'react';

interface PlayStyleTagsProps {
  playStyles: string[];
  preferredTags: string[];
}

export function PlayStyleTags({ playStyles, preferredTags }: PlayStyleTagsProps) {
  return (
    <div className="mt-6 flex flex-row gap-10">
      {/* 플레이 스타일 */}
      <div className="mb-3">
        <h3 className="mb-2 text-sm font-bold text-gray-900">플레이 스타일</h3>
        <div className="flex flex-wrap gap-2">
          {playStyles.map((style, index) => (
            <span key={index} className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700">
              {style}
            </span>
          ))}
        </div>
      </div>

      {/* 선호 태그 */}
      <div>
        <h3 className="mb-2 text-sm font-bold text-gray-900">선호 태그</h3>
        <div className="flex flex-wrap gap-2">
          {preferredTags.map((tag, index) => (
            <span key={index} className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}