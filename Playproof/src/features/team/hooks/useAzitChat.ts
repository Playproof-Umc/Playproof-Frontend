// src/features/team/hooks/useAzitChat.ts

import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';

export const useAzitChat = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewItems, setPreviewItems] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 10;

  // 파일 선택
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let nextFiles: File[] = [];
    setSelectedFiles((prev) => {
      const remaining = MAX_FILES - prev.length;
      if (remaining <= 0) {
        return prev;
      }
      nextFiles = files.slice(0, remaining);
      return [...prev, ...nextFiles];
    });
    if (nextFiles.length > 0) {
      const newPreviewItems = nextFiles.map((file) => {
        const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
        return {
          url: URL.createObjectURL(file),
          type: mediaType,
        };
      });
      setPreviewItems((prev) => [...prev, ...newPreviewItems]);
    }
    
    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = '';
  };

  // 이미지 삭제
  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewItems((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].url); // 메모리 해제
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // 파일 선택창 열기
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 메시지 전송 (API 호출 로직이 들어갈 곳)
  const sendMessage = () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    
    console.log('Send:', { message, selectedFiles });
    
    // 초기화
    setMessage('');
    setSelectedFiles([]);
    setPreviewItems((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
  };

  return {
    message,
    setMessage,
    selectedFiles,
    previewItems,
    fileInputRef,
    handleFileSelect,
    handleRemoveImage,
    triggerFileInput,
    sendMessage,
    hasContent: message.trim() !== '' || selectedFiles.length > 0
  };
};
