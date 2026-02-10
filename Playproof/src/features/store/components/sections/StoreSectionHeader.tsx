// src/features/store/components/sections/StoreSectionHeader.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '@/features/store/types';

interface SectionHeaderProps {
  title: string;
  sortOption: SortOption;
  onSortChange: (opt: SortOption) => void;
  children?: React.ReactNode; // 접기/펼치기 버튼 등 우측 컨트롤
}

const SORT_LABELS: Record<SortOption, string> = {
  'RECOMMEND': '추천순',
  'LOW_PRICE': '가격 낮은순',
  'HIGH_PRICE': '가격 높은순',
};

export const StoreSectionHeader = ({ title, sortOption, onSortChange, children }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 select-none">
      {/* 좌측: 섹션 제목 */}
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      
      {/* 우측: 컨트롤 영역 (접기 버튼 + 정렬 드롭다운) */}
      <div className="flex items-center gap-4">
        {/* 외부에서 받은 컴포넌트 (접기 버튼) 렌더링 */}
        {children}

        {/* 정렬 드롭다운 */}
        <div className="relative group z-10">
          <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
            {SORT_LABELS[sortOption]}
            <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-2 hidden group-hover:block">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <button
                key={key}
                onClick={() => onSortChange(key)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === key ? 'font-bold text-black' : 'text-gray-500'}`}
              >
                {SORT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
