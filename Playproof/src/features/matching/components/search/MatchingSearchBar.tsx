// src/features/matching/components/search/MatchingSearchBar.tsx
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Edit, X } from 'lucide-react';
import { MatchingFilterModal } from '@/features/matching/components/search/MatchingFilterModal';
import type { FilterState } from '@/features/matching/types';

interface MatchingSearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: (text: string) => void;
  onWriteClick: () => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  onFilterApply: (filters: FilterState) => void;
  activeGame: string;
  userId?: string; 
}

export const MatchingSearchBar: React.FC<MatchingSearchBarProps> = ({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onWriteClick,
  isFilterOpen,
  onFilterToggle,
  onFilterClose,
  onFilterApply,
  activeGame,
  userId,
}) => {
  const storageKey = userId ? `recent_${userId}_${activeGame}` : `recent_guest`;

  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showRecentSearch, setShowRecentSearch] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 20) {
      onSearchChange(val);
    }
  };

  const handleSubmit = (keyword: string) => {
    if (!keyword.trim()) return;
    if (keyword.length >= 2) {
        const newKeywords = [keyword, ...recentKeywords.filter(k => k !== keyword)].slice(0, 10);
        setRecentKeywords(newKeywords);
        localStorage.setItem(storageKey, JSON.stringify(newKeywords));
    }
    onSearchSubmit(keyword);
    setShowRecentSearch(false);
  };

  const removeKeyword = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    const newKeywords = recentKeywords.filter(k => k !== keyword);
    setRecentKeywords(newKeywords);
    localStorage.setItem(storageKey, JSON.stringify(newKeywords));
  };

  return (
    <div className="flex gap-2 w-full relative z-40">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder={`'${activeGame}' 내 검색 (2글자 이상)`}
          className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-400"
          value={searchText}
          onChange={handleInputChange} 
          onFocus={() => setShowRecentSearch(true)}
          onBlur={() => setTimeout(() => setShowRecentSearch(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(searchText)}
        />
        
        {showRecentSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold text-gray-500">
                    최근 검색어 ({userId ? `${activeGame}` : 'Guest'})
                </div>
              </div>
              {recentKeywords.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs py-4">최근 검색 내역이 없습니다.</div>
              ) : (
                  <div className="flex flex-wrap gap-2">
                      {recentKeywords.map((keyword, idx) => (
                          <div 
                              key={idx} 
                              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-200"
                              onMouseDown={() => handleSubmit(keyword)}
                          >
                              <span>{keyword}</span>
                              <X size={12} className="text-gray-400 hover:text-black" onClick={(e) => removeKeyword(e, keyword)}/>
                          </div>
                      ))}
                  </div>
              )}
            </div>
        )}
      </div>

      <div className="relative">
        <button 
          onClick={onFilterToggle}
          className={`p-3 border rounded-lg transition-colors bg-white ${isFilterOpen ? 'border-black text-black bg-gray-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
            <SlidersHorizontal size={18} />
        </button>

        <MatchingFilterModal 
          key={activeGame}
          isOpen={isFilterOpen}
          onClose={onFilterClose}
          activeGame={activeGame}
          onApply={onFilterApply}
        />
      </div>

      <button 
        onClick={onWriteClick}
        className="bg-black text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        <Edit size={14} /> <span className="hidden sm:inline">글쓰기</span>
      </button>

    </div>
  );
};
