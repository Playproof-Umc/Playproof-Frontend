// src/features/chat/components/ChatHeader.tsx

//src/features/chat/components/ChatHeader.tsx
import React from 'react';
import { MoreVertical } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  return (
    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
          #
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-lg">팀채팅</span>
            <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" title="Online" />
          </div>
          <span className="text-xs text-gray-400">멤버들과 자유롭게 대화하세요</span>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};