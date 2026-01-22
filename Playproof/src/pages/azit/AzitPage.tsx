// src/pages/azit/AzitPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { LeftPanel } from '@/features/team/components/azit/LeftPanel';
import { MainPanel } from '@/features/team/components/azit/MainPanel';
import { RightPanel } from '@/features/team/components/azit/RightPanel';
import {
  mockMembers,
  mockSchedules,
  mockVoiceChannels,
  mockChatChannels,
  mockClips,
} from '@/features/team/data/mockTeamData'; // 팀 데이터

const AzitPage = () => {
  const navigate = useNavigate();

  // 다음 경기 날짜 (더미)
  const [nextMatchDate] = useState<Date>(() => {
    return new Date(Date.now() + (1000 * 60 * 60 * 1) + (1000 * 60 * 59) + (1000 * 30));
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      
      {/* 네비바 */}
      <div className="flex-none z-50"> 
        <Navbar />
      </div>

      {/* 아지트 전용 헤더 */}
      <header className="h-16 px-4 flex items-center border-b border-gray-100 bg-white shrink-0 flex-none">
        <button 
          onClick={() => navigate('/azit')} 
          className="flex items-center text-gray-800 font-bold gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">목록으로</span>
        </button>
        
        <div className="ml-6 flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Playproof</h1>
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium mt-1">
              <Users className="w-3 h-3"/> 멤버 {mockMembers.length}명
            </span>
          </div>
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full self-start">
            운영중
          </span>
        </div>
      </header>

      {/* 3칼럼 레이아웃 */}
      <div className="flex flex-1 overflow-hidden relative z-0">
        
        <LeftPanel 
          nextMatchDate={nextMatchDate}
          schedules={mockSchedules}
          voiceChannels={mockVoiceChannels}
          chatChannels={mockChatChannels}
        />

        <MainPanel />

        <RightPanel 
          members={mockMembers}
          clips={mockClips}
        />
        
      </div>
    </div>
  );
};

export default AzitPage;
