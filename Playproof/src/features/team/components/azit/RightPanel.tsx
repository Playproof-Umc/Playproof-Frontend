// src/features/team/components/azit/RightPanel.tsx
import React from 'react';
import type { Clip } from '@/types'; // User 타입 제거

// Team 기능 
import { ClipList } from '@/features/team/components';
// TeamMemberList 제거

interface RightPanelProps {
  clips: Clip[];
  // members prop 제거
}

export const RightPanel: React.FC<RightPanelProps> = ({ clips }) => {
  return (
    <aside className="w-[320px] bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      {/* 우측은 하이라이트 전용 공간 - 디자인 번호 6 */}
      <ClipList clips={clips} />

    </aside>
  );
};