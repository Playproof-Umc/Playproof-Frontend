import React from 'react';
import { Navbar } from '@/components/common/Navbar'; // 
import { StoreSidebar } from './StoreSidebar';

interface StoreLayoutProps {
  children: React.ReactNode;
}

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  // 나중에 전역 상태(Context)에서 가져올 포인트 데이터 (일단 더미)
  const MOCK_USER_POINT = 5400;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 공통 네비바 유지 */}
      <Navbar />

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        
        {/* 좌측 사이드바 */}
        <StoreSidebar currentPoint={MOCK_USER_POINT} />

        {/* 우측 메인 컨텐츠 */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        
      </div>
    </div>
  );
};