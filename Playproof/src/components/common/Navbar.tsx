// src/components/common/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Settings, User, ChevronDown, CreditCard, ShoppingCart, LogOut, FileText, Gamepad2 } from 'lucide-react';
import { NotificationDropdown } from '@/features/notification/components';

interface NavbarProps {
  isProUser?: boolean;
  onTogglePro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isProUser = true, onTogglePro }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 드롭다운 외부 클릭 감지를 위한 Ref
  const profileRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  // ✨ 페이지별 드롭다운 메뉴 내용을 결정하는 함수
  const renderProfileMenu = () => {
    // 1. 상점 페이지 (/store) 메뉴
    if (location.pathname.startsWith('/store')) {
      return (
        <>
          <div 
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate('/mypage')}
          >
            <User size={16} className="text-gray-400" />
            <span>마이페이지 가기</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-gray-400" />
              <span>결제 및 포인트</span>
            </div>
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">5,400 P</span>
          </div>
          <div 
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => alert('장바구니 페이지로 이동')}
          >
            <ShoppingCart size={16} className="text-gray-400" />
            <span>장바구니</span>
          </div>
        </>
      );
    }

    // 2. 커뮤니티 페이지 (/community) 메뉴 (예시)
    if (location.pathname.startsWith('/community')) {
      return (
        <>
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/mypage')}>
            <User size={16} className="text-gray-400" />
            <span>내 프로필</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
            <FileText size={16} className="text-gray-400" />
            <span>내가 쓴 글 보기</span>
          </div>
        </>
      );
    }

    // 3. 기본(매칭 등) 페이지 메뉴
    return (
      <>
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/mypage')}>
          <User size={16} className="text-gray-400" />
          <span>마이페이지</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
          <Gamepad2 size={16} className="text-gray-400" />
          <span>내 파티 관리</span>
        </div>
        <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
          <LogOut size={16} />
          <span>로그아웃</span>
        </div>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. 로고 및 네비게이션 */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/home')}>
            <h1 className="text-2xl font-black tracking-tighter">PLAYPROOF</h1>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600">Pro</span>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <button onClick={() => navigate('/matching')} className={`h-16 px-1 transition-colors border-b-2 ${isActive('/matching') ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'}`}>매칭하기</button>
            <button onClick={() => navigate('/community')} className={`h-16 px-1 transition-colors border-b-2 ${isActive('/community') ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'}`}>커뮤니티</button>
            <button onClick={() => navigate('/azit')} className={`h-16 px-1 transition-colors border-b-2 ${isActive('/azit') ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'}`}>아지트</button>
            <button onClick={() => navigate('/store')} className={`h-16 px-1 transition-colors border-b-2 ${isActive('/store') ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'}`}>상점</button>
          </nav>
        </div>
        
        {/* 2. 우측 컨트롤 */}
        <div className="flex items-center gap-4">
          {onTogglePro && (
            <button 
              onClick={onTogglePro} 
              className={`text-xs border px-3 py-1 rounded-full font-bold transition-colors ${isProUser ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
            >
              {isProUser ? 'Pro ON' : 'Pro OFF'}
            </button>
          )}

          {/* ✨ 프로필 영역 (드롭다운 트리거) */}
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full pl-1.5 pr-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors select-none"
            >
              {/* 유저 아바타 */}
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white overflow-hidden">
                <User size={14} />
              </div>
              
              {/* 닉네임 & 뱃지 */}
              <span className="font-bold text-sm text-gray-800">플루</span>
              <span className="bg-zinc-200 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-600">Pro</span>

              {/* 스크롤 버튼 (화살표) */}
              <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* ✨ 프로필 드롭다운 메뉴 */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                
                {/* 상단: 간략 프로필 정보 */}
                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">플루</p>
                      <p className="text-xs text-gray-500">playproof12@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* 메뉴 리스트 (페이지별 변경) */}
                <div className="py-1">
                  {renderProfileMenu()}
                </div>
              </div>
            )}
          </div>
          
          {/* 알림 */}
          <div className="relative">
            <button 
              onClick={() => setIsNotiOpen(!isNotiOpen)}
              className={`p-2 rounded-full transition-all relative ${isNotiOpen ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-gray-500 hover:text-black'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            {isNotiOpen && <NotificationDropdown onClose={() => setIsNotiOpen(false)} />}
          </div>

          <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
        </div>
      </div>
    </header>
  );
};
