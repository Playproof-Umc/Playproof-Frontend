// src/features/team/components/azit/RightPanel.tsx
import React from 'react';
import type { Clip } from '@/types'; // User 타입 제거
import { ClipList } from '@/features/team/components';

interface RightPanelProps {
  clips: Clip[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ clips }) => {
  return (
    <aside className="w-[320px] bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      <ClipList clips={clips} />

    </aside>
  );
};