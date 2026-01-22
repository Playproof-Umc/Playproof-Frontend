import { useState, useRef, ChangeEvent } from 'react';

export const useAzitChat = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    
    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = '';
  };

  // 이미지 삭제
  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]); // 메모리 해제
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
    setPreviewUrls((prev) => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
  };

  return {
    message,
    setMessage,
    previewUrls,
    fileInputRef,
    handleFileSelect,
    handleRemoveImage,
    triggerFileInput,
    sendMessage,
    hasContent: message.trim() !== '' || selectedFiles.length > 0
  };
};
