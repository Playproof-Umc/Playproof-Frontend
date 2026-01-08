// src/pages/azit/AzitPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // [추가] 뒤로가기 구현용

// [추가] 공통 네비바 임포트
import { Navbar } from '@/components/common/Navbar';

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
  const navigate = useNavigate(); // [추가]

  // 다음 경기 날짜 (더미데이터)
  const [nextMatchDate] = useState<Date>(() => {
    return new Date(Date.now() + (1000 * 60 * 60 * 1) + (1000 * 60 * 59) + (1000 * 30));
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      
      {/* 1. 공통 네비바 추가 (최상단 고정) */}
      {/* z-index를 높여서 다른 컨텐츠보다 위에 오게 함 */}
      <div className="flex-none z-50"> 
        <Navbar />
      </div>

      {/* 2. 아지트 전용 헤더 (돌아가기 버튼 & 아지트 정보) */}
      {/* flex-none으로 높이 고정 */}
      <header className="h-16 px-4 flex items-center border-b border-gray-100 bg-white shrink-0 flex-none">
        <button 
          onClick={() => navigate('/azit')} // [수정] 아지트 목록(메인)으로 이동
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

      {/* 3. 3칼럼 레이아웃 (남은 공간 모두 차지) */}
      {/* flex-1과 overflow-hidden을 줘서 이 영역 내부에서만 스크롤 되도록 설정 */}
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