// src/components/common/Navbar.tsx
import React, { useState } from 'react'; // useState 추가
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, User } from 'lucide-react';

// [New] 알림 드롭다운 컴포넌트 import
import { NotificationDropdown } from '@/features/notification/components/NotificationDropdown';

interface NavbarProps {
  isProUser?: boolean;
  onTogglePro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isProUser, onTogglePro }) => {
  const navigate = useNavigate();
  // [New] 알림 드롭다운 열림 상태 관리
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. 로고 및 네비게이션 */}
        <div className="flex items-center gap-8">
          <h1 
            className="text-2xl font-black tracking-tighter cursor-pointer" 
            onClick={() => navigate('/')} // 메인으로 이동
          >
            PLAYPROOF
          </h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <button onClick={() => navigate('/matching')} className="h-16 px-1 hover:text-black transition-colors border-b-2 border-transparent hover:border-black">매칭하기</button>
            <button onClick={() => navigate('/community')} className="h-16 px-1 hover:text-black transition-colors border-b-2 border-transparent hover:border-black">커뮤니티</button>
            <button onClick={() => navigate('/azit')} className="h-16 px-1 hover:text-black transition-colors border-b-2 border-transparent hover:border-black">아지트</button>
            <button onClick={() => navigate('/store')} className="h-16 px-1 hover:text-black transition-colors border-b-2 border-transparent hover:border-black">상점</button>
          </nav>
        </div>
        
        {/* 2. 우측 컨트롤 (Pro토글, 프로필, 알림) */}
        <div className="flex items-center gap-4">
          {/* onTogglePro 함수가 전달되었을 때만 버튼 표시 (매칭 페이지용) */}
          {onTogglePro && (
            <button 
              onClick={onTogglePro} 
              className={`text-xs border px-3 py-1 rounded-full font-bold transition-colors ${isProUser ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
            >
              {isProUser ? 'Pro ON' : 'Pro OFF'}
            </button>
          )}

          <div 
            onClick={() => navigate('/mypage')} // 마이페이지 이동
            className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white"><User size={12}/></div>
            <span className="font-medium">나(Player)</span>
          </div>
          
          {/* [Modified] 알림 아이콘 버튼 영역 */}
          <div className="relative">
            <button 
              onClick={() => setIsNotiOpen(!isNotiOpen)}
              className={`p-2 rounded-full transition-all relative ${
                isNotiOpen ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-gray-500 hover:text-black'
              }`}
            >
              <Bell className="w-5 h-5" />
              {/* 읽지 않은 알림 배지 (예시) */}
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* [New] 알림 드롭다운 컴포넌트 조건부 렌더링 */}
            {isNotiOpen && (
              <NotificationDropdown onClose={() => setIsNotiOpen(false)} />
            )}
          </div>

          <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
        </div>
      </div>
    </header>
  );
};