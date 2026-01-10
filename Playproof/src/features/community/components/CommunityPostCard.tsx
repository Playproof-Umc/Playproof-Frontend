import * as React from "react";
import { Card } from "@/components/ui/Card";

type CommunityPostProps = {
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  avatarUrl?: string;
  images?: string[];
};

export function CommunityPostCard({
  author,
  date,
  title,
  content,
  likes,
  comments,
  avatarUrl,
  images = [],
}: CommunityPostProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <Card className="!rounded-2xl !shadow-sm !ring-1 !ring-black/5 !border-0 transition-shadow hover:!shadow-md">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 pb-3">
        {/* 아바타 */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-400">
              <UserIcon />
            </div>
          )}
        </div>

        {/* 작성자 정보 */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-zinc-900">{author}</div>
          <div className="text-xs text-zinc-500">{date}</div>
        </div>

        {/* 더보기 버튼 */}
        <button className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600">
          <ThreeDotsIcon />
        </button>
      </div>

      {/* 이미지 캐러셀 */}
      <div 
        className="relative aspect-square w-full bg-zinc-100 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasImages ? (
          <>
            <div 
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${title} - ${index + 1}`}
                  className="h-full w-full flex-shrink-0 object-cover"
                />
              ))}
            </div>
            
            {/* 이미지 카운터 */}
            {hasMultipleImages && (
              <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* 좌우 화살표 버튼 */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                  aria-label="이전 이미지"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                  aria-label="다음 이미지"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}

            {/* 인디케이터 점들 */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={[
                      "h-1.5 w-1.5 rounded-full transition-all",
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/60 hover:bg-white/80",
                    ].join(" ")}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-4 p-4 pt-3">
        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-red-500 transition-colors">
          <HeartIcon />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-colors">
          <CommentIcon />
          <span className="text-sm font-medium">{comments}</span>
        </button>

        <button className="ml-auto text-zinc-500 hover:text-zinc-900 transition-colors">
          <ShareIcon />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="px-4 pb-4">
        <p className="text-sm leading-relaxed text-zinc-900">
          {title || content}
        </p>
      </div>
    </Card>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-zinc-300">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path
        d="M21 15l-5-5L5 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
