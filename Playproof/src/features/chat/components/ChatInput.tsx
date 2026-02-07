// src/features/chat/components/ChatInput.tsx

//src/features/chat/components/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, SquareArrowUp } from 'lucide-react'; 

export const ChatInput: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; previewUrl: string }[]>([]);

  // 1. Unmount 시 cleanup을 위해 현재 파일 목록을 추적하는 ref
  const filesRef = useRef(selectedFiles);

  useEffect(() => {
    filesRef.current = selectedFiles;
  }, [selectedFiles]);

  // 2. 컴포넌트가 화면에서 사라질 때(언마운트) 남은 파일들의 메모리 해제
  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file), // 메모리에 URL 생성
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    if (e.target.value) e.target.value = '';
  };

  // 개별 파일 삭제 시 메모리 해제
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => {
      const target = prev[indexToRemove];
      
      // 삭제 대상이 있다면 메모리에서 해제(revoke)
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleShareFile = (file: File) => {
    console.log("Sharing file:", file.name);
    alert(`'${file.name}' 파일을 공유합니다. (기능 준비 중)`);
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      
      {selectedFiles.length > 0 && (
        <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-thin">
          {selectedFiles.map((item, index) => (
            <div key={index} className="relative group w-24 h-24 shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover"/>
              
              <div className="absolute top-1 right-1 flex items-center bg-gray-100 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                
                <button 
                  onClick={() => handleShareFile(item.file)}
                  className="text-gray-800 hover:bg-gray-200 rounded-md p-1 transition-colors"
                  title="공유하기"
                >
                  <SquareArrowUp className="w-3.5 h-3.5" />
                </button>

                <button 
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-800 hover:bg-gray-200 rounded-md p-1 transition-colors ml-0.5"
                  title="삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-center">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden" 
          accept="image/*" 
          multiple 
        />
        
        <button 
          onClick={handleClipClick}
          className="absolute left-4 text-gray-400 hover:text-gray-600 p-1 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <input 
          type="text" 
          placeholder="메세지를 입력해주세요." 
          className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-full focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all text-sm outline-none placeholder:text-gray-400"
        />
        
        <button className="absolute right-3 bg-gray-900 hover:bg-black text-white p-2 rounded-full shadow-sm transition-colors">
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};