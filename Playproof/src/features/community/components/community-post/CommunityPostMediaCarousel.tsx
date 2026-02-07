// src/features/community/components/community-post/CommunityPostMediaCarousel.tsx

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImagePlaceholderIcon,
} from "@/features/community/components/community-post/CommunityPostIcons";

type CommunityPostMediaCarouselProps = {
  title: string;
  images: string[];
};

export function CommunityPostMediaCarousel({ title, images }: CommunityPostMediaCarouselProps) {
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

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEnd(event.targetTouches[0].clientX);
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
    <div
      className="relative aspect-square w-full overflow-hidden bg-zinc-100"
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

          {hasMultipleImages && (
            <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label="이전 이미지"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label="다음 이미지"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}

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
  );
}
