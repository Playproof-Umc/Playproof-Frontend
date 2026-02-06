// src/features/team/pages/AzitPageView.tsx
import React from 'react';
import { Settings, Users } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

import { AzitNavigation } from '@/features/team/components/azit/AzitNavigation';
import { LeftPanel } from '@/features/team/components/azit/LeftPanel';
import { MainPanel } from '@/features/team/components/azit/MainPanel';
import { RightPanel } from '@/features/team/components/azit/RightPanel';
import { ScheduleCreateModal } from '@/features/team/components/schedule/ScheduleCreateModal';

import { useAzitPageLogic } from '@/features/team/hooks/useAzitPageLogic';

export const AzitPageView = () => {
  const { state, actions } = useAzitPageLogic();
  const {
    currentAzitId,
    scheduleAnchorEl,
    currentAzit,
    currentMembers,
    currentClips,
    schedules,
    currentUserId,
  } = state;

  const handleCreateSchedule = (data: any) => {
    console.log("새 스케줄 데이터:", data);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-none z-50 border-b border-gray-100">
        <Navbar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1920px] mx-auto">
        {/* Navigation */}
        <div className="flex-none">
          <AzitNavigation 
            azits={state.azits}
            selectedId={currentAzitId} 
            onSelect={actions.setCurrentAzitId}
          />
        </div>

        {/* Header */}
        <div className="px-6 pb-2 pt-2 shrink-0">
          <div className="h-[60px] bg-gray-100 rounded-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{currentAzit.name}</h1>
              <div className="flex items-center gap-1 text-gray-500 font-bold mt-0.5">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentAzit.memberCount}</span>
              </div>
            </div>
            <button className="text-gray-400 hover:bg-gray-200 rounded-full p-2 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 px-6 pb-6 gap-8 overflow-hidden">
          <LeftPanel 
            members={currentMembers} 
            schedules={schedules}  // State 전달
            currentUserId={currentUserId}
            onAddSchedule={(target) => actions.setScheduleAnchorEl(target)}
            onStatusChange={actions.handleStatusChange} // 핸들러 전달
          />
          
          <MainPanel key={currentAzitId} />
          
          <div className="w-[300px] flex flex-col shrink-0 gap-4">
             <div className="flex justify-between items-center px-1">
               <h2 className="text-lg font-bold text-gray-900">하이라이트</h2>
               <button className="text-xs text-gray-500 underline font-medium">전체보기</button>
             </div>
             <RightPanel clips={currentClips} />
          </div>
        </div>
      </div>

      <ScheduleCreateModal 
        anchorEl={scheduleAnchorEl}
        onClose={() => actions.setScheduleAnchorEl(null)}
        onCreate={handleCreateSchedule}
      />
    </div>
  );
};
