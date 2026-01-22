//src/features/team/components/azit/MainPanel.tsx
import React from 'react';
// Chat 기능 
import { ChatHeader, MessageList, ChatInput } from '@/features/chat/components';

export const MainPanel: React.FC = () => {
  return (
    <main className="flex-1 h-full bg-gray-50 p-4 min-w-[400px]">
      <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* 1. 헤더 */}
        <ChatHeader />

        {/* 2. 메시지 리스트 */}
        <MessageList />

        {/* 3. 입력창 */}
        <ChatInput />

      </div>
    </main>
  );
};
