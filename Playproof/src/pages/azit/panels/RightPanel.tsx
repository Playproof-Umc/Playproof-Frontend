//src/pages/azit/panels/RightPanel.tsx
import React from 'react';
import type { User, Clip } from '@/types';

// Team 기능 
import { TeamMemberList } from '@/features/team/components/TeamMemberList';
import { ClipList } from '@/features/team/components/ClipList';

interface RightPanelProps {
  members: User[];
  clips: Clip[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ members, clips }) => {
  return (
    <aside className="w-[320px] bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      {/* 1. 멤버 목록 */}
      <TeamMemberList members={members} />

      {/* 2. 최근 클립 */}
      <ClipList clips={clips} />

    </aside>
  );
};
