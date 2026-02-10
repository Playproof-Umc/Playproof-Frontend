// src/features/team/components/azit/ClipList.tsx

//src/features/team/components/azit/ClipList.tsx
import React from 'react';
import { Video } from 'lucide-react';
import type { Clip } from '@/features/team/types';
import { Card } from '@/components/ui/Card';

interface Props {
  clips: Clip[];
  onViewAll?: () => void;
  onSelectClip?: (clip: Clip, index: number) => void;
  viewAllLabel?: string;
}

export const ClipList: React.FC<Props> = ({
  clips,
  onViewAll,
  onSelectClip,
  viewAllLabel = "전체보기",
}) => {
  return (
    <section className="flex-1">
      {/* 헤더 (박스 바깥) */}
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">최근 클립</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center hover:underline"
        >
          {viewAllLabel}
        </button>
      </div>
      
      {/* 콘텐츠 (흰색 박스) */}
      <Card className="p-5">
        {/* 타임라인 줄 (왼쪽 세로선) */}
        <div className="relative border-l-2 border-gray-100 ml-2 space-y-6 pb-2">
          {clips.map((clip, index) => (
            <button
              key={clip.id}
              type="button"
              onClick={() => onSelectClip?.(clip, index)}
              className="pl-5 relative group cursor-pointer text-left w-full"
            >
              
              {/* 타임라인 점 (Dot) */}
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white group-hover:bg-indigo-500 transition-colors"></div>
              
              {/* 날짜 */}
              <div className="text-xs font-bold text-gray-500 mb-2 group-hover:text-indigo-600 transition-colors">
                {clip.date}
              </div>

              {/* 썸네일 박스 */}
              <div className="w-full aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
                {clip.mediaType === "video" && clip.mediaUrl ? (
                  <video
                    src={clip.mediaUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    muted
                    playsInline
                  />
                ) : clip.thumbnailUrl ? (
                  <img
                    src={clip.thumbnailUrl}
                    className="w-full h-full object-contain bg-black/5 group-hover:scale-105 transition-transform duration-300"
                    alt="클립 썸네일"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Video className="w-8 h-8 opacity-50" />
                  </div>
                )}
                
                {/* 영상일 때만 재생 버튼 오버레이 */}
                {clip.mediaType === "video" && (
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-sm">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-black border-b-[4px] border-b-transparent"></div>
                    </div>
                  </div>
                )}

                {clip.mediaType === "video" && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-1 rounded-md">
                    {clip.durationLabel ?? "0:00"}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
};
