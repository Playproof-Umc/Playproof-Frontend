// src/features/team/components/azit/RightPanel.tsx
import React from 'react';
import { useAzitMediaViewer } from "@/features/team/hooks/useAzitMediaViewer";
import type { Clip } from '@/features/team/types';
import { ClipList } from '@/features/team/components/azit/ClipList';
import { ModalShell } from "@/components/ui/ModalShell";

interface RightPanelProps {
  clips: Clip[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ clips }) => {
  const {
    isGalleryOpen,
    activeMedia,
    hasMedia,
    openGallery,
    closeGallery,
    openMedia,
    closeMedia,
    goPrev,
    goNext,
    shareToHighlight,
  } = useAzitMediaViewer(clips);
  return (
    <aside className="w-full lg:w-[320px] bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      <ClipList
        clips={clips}
        onViewAll={openGallery}
        onSelectClip={openMedia}
        viewAllLabel="클립 전체보기"
      />

      <ModalShell
        open={isGalleryOpen}
        onOverlayClick={closeGallery}
        overlayClassName="fixed inset-0 z-[120] bg-black/30"
        wrapperClassName="fixed inset-0 z-[121] flex items-center justify-center px-6"
        panelClassName="w-full max-w-[760px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">최근 미디어</h3>
          <button
            type="button"
            onClick={closeGallery}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            닫기
          </button>
        </div>

        {clips.length === 0 ? (
          <div className="text-sm text-gray-400 py-20 text-center">
            보낸 미디어가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {clips.map((clip, index) => (
              <button
                key={clip.id}
                type="button"
                onClick={() => openMedia(clip, index)}
                className="relative rounded-xl overflow-hidden border border-gray-200 text-left"
              >
                {clip.mediaType === "video" && clip.mediaUrl ? (
                  <video
                    src={clip.mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : clip.thumbnailUrl ? (
                  <img
                    src={clip.thumbnailUrl}
                    alt="media"
                    className="w-full h-full object-contain bg-black/5"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-100" />
                )}
                {clip.mediaType === "video" && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-1 rounded-md">
                    {clip.durationLabel ?? "0:00"}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </ModalShell>

      <ModalShell
        open={Boolean(activeMedia)}
        onOverlayClick={closeMedia}
        overlayClassName="fixed inset-0 z-[130] bg-black/60"
        wrapperClassName="fixed inset-0 z-[131] flex items-center justify-center px-6"
        panelClassName="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-base font-bold text-gray-900">미디어 보기</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shareToHighlight}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              공유
            </button>
            <button
              type="button"
              onClick={closeMedia}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              닫기
            </button>
          </div>
        </div>
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
          <button
            type="button"
            disabled={!hasMedia}
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-sm flex items-center justify-center hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {activeMedia?.mediaType === "video" && activeMedia.mediaUrl ? (
            <video
              src={activeMedia.mediaUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          ) : activeMedia?.thumbnailUrl ? (
            <img
              src={activeMedia.thumbnailUrl}
              alt="media"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-sm">미디어가 없습니다.</div>
          )}
          <button
            type="button"
            disabled={!hasMedia}
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-sm flex items-center justify-center hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      </ModalShell>

    </aside>
  );
};
