// src/features/matching/components/home/PopularMatchList.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/MatchingCard';
import type { MatchingData } from '@/features/matching/types';

interface PopularMatchListProps {
  matches: MatchingData[];
}

export const PopularMatchList = ({ matches }: PopularMatchListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-900">인기 매칭</h2>
        <RefreshCw size={16} className="text-gray-400 cursor-pointer" />
      </div>
      {matches.length === 0 ? (
        <div className="w-full h-32 bg-gray-50 rounded-xl border border-gray-100 border-dashed flex items-center justify-center text-gray-400 text-sm">
          <p>현재 인기 매칭이 없습니다.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x no-scrollbar">
          {matches.map((item) => (
            <div key={`pop-${item.id}`} className="min-w-[280px] w-[280px] snap-start">
              <MatchingCard data={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
