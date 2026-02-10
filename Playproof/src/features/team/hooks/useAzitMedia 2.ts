// src/features/team/hooks/useAzitMedia.ts

import React from "react";
import type { Clip } from "@/features/team/types";

type MediaItem = { url: string; type: "image" | "video" };

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

type ClipsByAzitRoom = Record<number, Record<string, Clip[]>>;

const toRoomClips = (initialClips: Record<number, Clip[]>): ClipsByAzitRoom => {
  const result: ClipsByAzitRoom = {};
  Object.entries(initialClips).forEach(([azitId, clips]) => {
    result[Number(azitId)] = { "자유 대화": clips };
  });
  return result;
};

export const useAzitMedia = (initialClips: Record<number, Clip[]>) => {
  const [clipsByAzit, setClipsByAzit] = React.useState<ClipsByAzitRoom>(
    toRoomClips(initialClips)
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

  const addClipsFromMedia = React.useCallback(
    (azitId: number, roomName: string, media: MediaItem[]) => {
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
      const currentRooms = prev[azitId] ?? {};
      const current = currentRooms[roomName] ?? [];
      return {
        ...prev,
        [azitId]: {
          ...currentRooms,
          [roomName]: [...newClips, ...current],
        },
      };
    });

    newClips.forEach((clip) => {
      if (clip.mediaType !== "video" || !clip.mediaUrl) return;
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = clip.mediaUrl;
      video.onloadedmetadata = () => {
        const label = formatDuration(video.duration);
        setClipsByAzit((prev) => {
          const currentRooms = prev[azitId] ?? {};
          const current = currentRooms[roomName] ?? [];
          return {
            ...prev,
            [azitId]: {
              ...currentRooms,
              [roomName]: current.map((item) =>
                item.id === clip.id ? { ...item, durationLabel: label } : item
              ),
            },
          };
        });
      };
    });
  }, []);

  const initAzitClips = React.useCallback((azitId: number) => {
    setClipsByAzit((prev) => ({ ...prev, [azitId]: { "자유 대화": [] } }));
  }, []);

  const ensureRoomClips = React.useCallback((azitId: number, roomName: string) => {
    setClipsByAzit((prev) => {
      const currentRooms = prev[azitId] ?? {};
      if (currentRooms[roomName]) return prev;
      return {
        ...prev,
        [azitId]: {
          ...currentRooms,
          [roomName]: [],
        },
      };
    });
  }, []);

  const renameRoomClips = React.useCallback(
    (azitId: number, fromName: string, toName: string) => {
      setClipsByAzit((prev) => {
        const currentRooms = prev[azitId] ?? {};
        if (!currentRooms[fromName] || currentRooms[toName]) return prev;
        const { [fromName]: roomClips, ...rest } = currentRooms;
        return {
          ...prev,
          [azitId]: {
            ...rest,
            [toName]: roomClips ?? [],
          },
        };
      });
    },
    []
  );

  const deleteRoomClips = React.useCallback((azitId: number, roomName: string) => {
    setClipsByAzit((prev) => {
      const currentRooms = prev[azitId] ?? {};
      if (!currentRooms[roomName]) return prev;
      const nextRooms = { ...currentRooms };
      delete nextRooms[roomName];
      return { ...prev, [azitId]: nextRooms };
    });
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
    ensureRoomClips,
    renameRoomClips,
    deleteRoomClips,
  };
};
