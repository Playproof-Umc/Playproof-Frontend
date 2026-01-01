import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';

// 레이아웃
import { LeftPanel } from './panels/LeftPanel';
import { MainPanel } from './panels/MainPanel';
import { RightPanel } from './panels/RightPanel';

// 더미데이터
import { 
  mockSchedules, 
  mockVoiceChannels, 
  mockChatChannels, 
  mockMembers, 
  mockClips 
} from '@/data/mockData';

const AzitPage = () => {
  // 다음 경기 날짜 (더미데이터)
  const [nextMatchDate] = useState<Date>(() => {
    return new Date(Date.now() + (1000 * 60 * 60 * 1) + (1000 * 60 * 59) + (1000 * 30));
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <header className="h-16 px-4 flex items-center border-b border-gray-100 bg-white shrink-0">
        <button className="flex items-center text-gray-800 font-bold gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>
        <div className="ml-6">
          <h1 className="text-xl font-bold text-gray-900">Playproof</h1>
          <span className="text-xs text-gray-500 flex items-center gap-1 font-medium mt-0.5">
            <Users className="w-3 h-3"/> 멤버 {mockMembers.length}명
          </span>
        </div>
      </header>

      {/* 3칼럼 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        
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