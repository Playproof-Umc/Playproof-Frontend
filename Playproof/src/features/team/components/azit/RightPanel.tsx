// src/features/team/components/azit/RightPanel.tsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import type { Clip } from '@/types'; // User 타입 제거
import { ClipList } from '@/features/team/components/ClipList';

interface RightPanelProps {
  clips: Clip[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ clips }) => {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [activeMedia, setActiveMedia] = React.useState<Clip | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const hasMedia = clips.length > 0;
  const navigate = useNavigate();

  const handleShareToHighlight = React.useCallback(async () => {
    if (!activeMedia) return;
    if (activeMedia.mediaType === "video") {
      alert("영상 공유는 아직 준비 중이에요.");
      return;
    }
    const sourceUrl = activeMedia.mediaUrl ?? activeMedia.thumbnailUrl;
    if (!sourceUrl) return;
    const response = await fetch(sourceUrl);
    const blob = await response.blob();
    const ext = blob.type.includes("png") ? "png" : "jpg";
    const file = new File([blob], `highlight-share-${Date.now()}.${ext}`, {
      type: blob.type || "image/jpeg",
    });
    navigate("/community?tab=하이라이트", { state: { shareFiles: [file] } });
  }, [activeMedia, navigate]);
  return (
    <aside className="w-[320px] bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      <ClipList
        clips={clips}
        onViewAll={() => setIsGalleryOpen(true)}
        onSelectClip={(clip, index) => {
          setActiveMedia(clip);
          setActiveIndex(index);
        }}
      />

      {isGalleryOpen && (
        <>
          <div className="fixed inset-0 z-[120] bg-black/30" onClick={() => setIsGalleryOpen(false)} />
          <div className="fixed inset-0 z-[121] flex items-center justify-center px-6">
            <div className="w-full max-w-[760px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">최근 미디어</h3>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
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
                      onClick={() => {
                        setActiveMedia(clip);
                        setActiveIndex(index);
                      }}
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
            </div>
          </div>
        </>
      )}

      {activeMedia && (
        <>
          <div
            className="fixed inset-0 z-[130] bg-black/60"
            onClick={() => setActiveMedia(null)}
          />
          <div className="fixed inset-0 z-[131] flex items-center justify-center px-6">
            <div className="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-base font-bold text-gray-900">미디어 보기</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareToHighlight}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    공유
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMedia(null)}
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
                  onClick={() => {
                    if (!hasMedia) return;
                    const nextIndex = (activeIndex - 1 + clips.length) % clips.length;
                    setActiveIndex(nextIndex);
                    setActiveMedia(clips[nextIndex]);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-sm flex items-center justify-center hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {activeMedia.mediaType === "video" && activeMedia.mediaUrl ? (
                  <video
                    src={activeMedia.mediaUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : activeMedia.thumbnailUrl ? (
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
                  onClick={() => {
                    if (!hasMedia) return;
                    const nextIndex = (activeIndex + 1) % clips.length;
                    setActiveIndex(nextIndex);
                    setActiveMedia(clips[nextIndex]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-sm flex items-center justify-center hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </aside>
  );
};
