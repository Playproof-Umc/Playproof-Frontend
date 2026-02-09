// src/features/team/hooks/useAzitMediaViewer.ts

import React from "react";
import { useNavigate } from "react-router-dom";
import type { Clip } from "@/features/team/types";

export const useAzitMediaViewer = (clips: Clip[]) => {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [activeMedia, setActiveMedia] = React.useState<Clip | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const navigate = useNavigate();
  const hasMedia = clips.length > 0;

  const openGallery = React.useCallback(() => {
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = React.useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const openMedia = React.useCallback((clip: Clip, index: number) => {
    setActiveMedia(clip);
    setActiveIndex(index);
  }, []);

  const closeMedia = React.useCallback(() => {
    setActiveMedia(null);
  }, []);

  const goPrev = React.useCallback(() => {
    if (!hasMedia) return;
    const nextIndex = (activeIndex - 1 + clips.length) % clips.length;
    setActiveIndex(nextIndex);
    setActiveMedia(clips[nextIndex]);
  }, [activeIndex, clips, hasMedia]);

  const goNext = React.useCallback(() => {
    if (!hasMedia) return;
    const nextIndex = (activeIndex + 1) % clips.length;
    setActiveIndex(nextIndex);
    setActiveMedia(clips[nextIndex]);
  }, [activeIndex, clips, hasMedia]);

  const goHighlight = React.useCallback(() => {
    navigate("/community?tab=하이라이트");
  }, [navigate]);

  const shareToHighlight = React.useCallback(async () => {
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

  return {
    isGalleryOpen,
    activeMedia,
    activeIndex,
    hasMedia,
    openGallery,
    closeGallery,
    openMedia,
    closeMedia,
    goPrev,
    goNext,
    goHighlight,
    shareToHighlight,
  };
};
