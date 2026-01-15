//src/features/store/components/StoreSidebar.tsx
import React from 'react';
import { Card } from '@/components/ui/Card'; // 기존 공용 Card 사용
import { Button } from '@/components/ui/Button'; // 기존 공용 Button 사용

interface StoreSidebarProps {
  currentPoint: number;
}

const MENU_ITEMS = [
  { label: '전체', value: 'ALL' },
  { label: '추천', value: 'RECOMMEND' },
  { label: '프로필 패키지', value: 'PROFILE' },
  { label: '멤버십', value: 'MEMBERSHIP' },
];

export const StoreSidebar = ({ currentPoint }: StoreSidebarProps) => {
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col gap-6">
      {/* 1. 빠른 매칭 버튼 (디자인 포인트) */}
      <Button 
        className="w-full bg-gray-900 text-white hover:bg-gray-800 py-6 text-base font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> 빠른 매칭
      </Button>

      {/* 2. 내 포인트 카드 */}
      <Card className="p-6 border border-gray-200 shadow-sm bg-white rounded-xl">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-gray-500 text-sm font-medium">내 포인트</span>
            <div className="text-2xl font-bold mt-1 text-gray-900">
              {currentPoint.toLocaleString()} P
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700 h-10 rounded-lg text-sm font-semibold transition-colors"
          >
            충전하기
          </Button>
        </div>
      </Card>

      {/* 3. 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-1 px-2">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={item.value}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${index === 0 
                ? 'bg-gray-100 text-gray-900 font-bold' // '전체' 활성화 상태 예시
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};