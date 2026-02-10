// src/features/matching/components/home/PopularMatchList.tsx
import { RefreshCw } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/common/MatchingCard';
import type { MatchingData } from '@/features/matching/types';

interface PopularMatchListProps {
  matches: MatchingData[];
  onCardClick?: (match: MatchingData) => void;
}

export const PopularMatchList = ({ matches, onCardClick }: PopularMatchListProps) => {
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
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 box-border py-4">
          <div className="w-[1008px] mx-auto overflow-hidden">
            <div className="w-[1008px] flex gap-6 overflow-x-auto pb-4 snap-x no-scrollbar">
              {matches.map((item) => (
                <div key={`pop-${item.id}`} className="w-[320px] min-w-[320px] shrink-0 snap-start">
                  <MatchingCard data={item} onOpen={onCardClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
