// src/features/team/pages/AzitPageView.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, Users } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

import { AzitNavigation } from '@/features/team/components/azit/AzitNavigation';
import { LeftPanel } from '@/features/team/components/azit/LeftPanel';
import { MainPanel } from '@/features/team/components/azit/MainPanel';
import { RightPanel } from '@/features/team/components/azit/RightPanel';
import { ScheduleCreateModal } from '@/features/team/components/schedule/ScheduleCreateModal';

import {
  MOCK_MY_AZITS,
  mockClipsByAzit,
  mockMembersByAzit,
  mockSchedulesByAzit,
} from '@/features/team/data/mockTeamData';

export const AzitPageView = () => {
  const location = useLocation();
  const state = location.state as { azitId?: number } | null;
  const [currentAzitId, setCurrentAzitId] = useState<number>(state?.azitId ?? 1);
  
  // 모달 위치의 기준이 될 요소(Anchor Element)
  const [scheduleAnchorEl, setScheduleAnchorEl] = useState<HTMLElement | null>(null);

  const currentAzit = MOCK_MY_AZITS.find(a => a.id === currentAzitId) || MOCK_MY_AZITS[0];
  const currentMembers = mockMembersByAzit[currentAzitId] ?? mockMembersByAzit[1];
  const currentClips = mockClipsByAzit[currentAzitId] ?? mockClipsByAzit[1];
  const currentSchedules = mockSchedulesByAzit[currentAzitId] ?? mockSchedulesByAzit[1];

  const handleCreateSchedule = (data: any) => {
    console.log("새 스케줄 데이터:", data);
    // TODO: 백엔드 API 전송 로직
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
            azits={MOCK_MY_AZITS} 
            selectedId={currentAzitId} 
            onSelect={setCurrentAzitId}
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
          {/* ✅ LeftPanel에서 넘겨준 요소(헤더 div)를 상태에 저장 */}
          <LeftPanel 
            members={currentMembers} 
            schedules={currentSchedules} 
            onAddSchedule={(target) => setScheduleAnchorEl(target)}
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

      {/* Anchor Element가 있으면 모달을 렌더링하고, 위치를 해당 요소 기준으로 잡음 */}
      <ScheduleCreateModal 
        anchorEl={scheduleAnchorEl}
        onClose={() => setScheduleAnchorEl(null)}
        onCreate={handleCreateSchedule}
      />
    </div>
  );
};