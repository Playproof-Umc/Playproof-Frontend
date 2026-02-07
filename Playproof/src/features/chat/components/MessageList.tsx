// src/features/chat/components/MessageList.tsx

//src/features/chat/components/MessageList.tsx
import React from 'react';

export const MessageList: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 space-y-4 scrollbar-hide">
      
      <div className="flex items-center justify-center my-4">
        <div className="h-px bg-gray-100 w-full"></div>
        <span className="px-3 text-xs text-gray-400 font-medium whitespace-nowrap">2025년 12월 20일</span>
        <div className="h-px bg-gray-100 w-full"></div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        <div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-sm font-bold text-gray-700">레나</span>
            <span className="text-[10px] text-gray-400">오후 2:30</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-r-xl rounded-bl-xl text-sm text-gray-700 inline-block">
            오늘 스크림 일정 확인 부탁드려요!
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-l-xl rounded-br-xl text-sm inline-block shadow-sm">
          네 확인했습니다. 8시 맞죠?
        </div>
        <span className="text-[10px] text-gray-400 mt-1">오후 2:32</span>
      </div>
      
    </div>
  );
};