// src/features/matching/components/home/FilteredMatchList.tsx
import { RefreshCw } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/common/MatchingCard';
import type { MatchingData } from '@/features/matching/types';

interface FilteredMatchListProps {
  matches: MatchingData[];
  searchText: string;
}

export const FilteredMatchList = ({ matches, searchText }: FilteredMatchListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-900">
          {searchText.length >= 2
            ? `'${searchText}' 검색 결과 (${matches.length})`
            : `전체 매칭 (${matches.length})`}
        </h2>
        <RefreshCw size={16} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-xl text-gray-400 border border-gray-100 border-dashed flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-bold text-gray-300">
            {searchText.length >= 2 ? '검색 결과가 없습니다.' : '작성된 글이 없습니다.'}
          </p>
          {searchText.length < 2 && (
            <p className="text-sm">우측 상단 '글쓰기' 버튼을 눌러 첫 매칭을 시작해보세요!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {matches.map((item) => (
            <div key={`all-${item.id}`} className="w-[320px] max-w-full">
              <MatchingCard data={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
