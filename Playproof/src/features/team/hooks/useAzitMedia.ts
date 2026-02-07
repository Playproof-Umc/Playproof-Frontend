import React from "react";
import type { Clip } from "@/types";

type MediaItem = { url: string; type: "image" | "video" };

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const useAzitMedia = (initialClips: Record<number, Clip[]>) => {
  const [clipsByAzit, setClipsByAzit] = React.useState<Record<number, Clip[]>>(
    initialClips
  );
  const mediaUrlsRef = React.useRef<string[]>([]);

  const createMediaItems = React.useCallback((files: File[]) => {
    const media = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
    }));
    if (media.length > 0) {
      mediaUrlsRef.current.push(...media.map((item) => item.url));
    }
    return media;
  }, []);

  const addClipsFromMedia = React.useCallback((azitId: number, media: MediaItem[]) => {
    if (media.length === 0) return;
    const nowLabel = "방금 전";
    const newClips: Clip[] = media.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      date: nowLabel,
      thumbnailUrl: item.type === "image" ? item.url : "",
      mediaType: item.type,
      mediaUrl: item.url,
      durationLabel: item.type === "video" ? "0:00" : undefined,
    }));

    setClipsByAzit((prev) => {
      const current = prev[azitId] ?? [];
      return { ...prev, [azitId]: [...newClips, ...current] };
    });

    newClips.forEach((clip) => {
      if (clip.mediaType !== "video" || !clip.mediaUrl) return;
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = clip.mediaUrl;
      video.onloadedmetadata = () => {
        const label = formatDuration(video.duration);
        setClipsByAzit((prev) => {
          const current = prev[azitId] ?? [];
          return {
            ...prev,
            [azitId]: current.map((item) =>
              item.id === clip.id ? { ...item, durationLabel: label } : item
            ),
          };
        });
      };
    });
  }, []);

  const initAzitClips = React.useCallback((azitId: number) => {
    setClipsByAzit((prev) => ({ ...prev, [azitId]: [] }));
  }, []);

  React.useEffect(() => {
    return () => {
      mediaUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      mediaUrlsRef.current = [];
    };
  }, []);

  return {
    clipsByAzit,
    createMediaItems,
    addClipsFromMedia,
    initAzitClips,
  };
};
