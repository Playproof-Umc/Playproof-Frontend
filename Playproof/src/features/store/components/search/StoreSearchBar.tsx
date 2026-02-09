// src/features/store/components/search/StoreSearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface StoreSearchBarProps {
  onSearch: (keyword: string) => void;
  isLoggedIn?: boolean; 
}

export const StoreSearchBar = ({ onSearch, isLoggedIn = false }: StoreSearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

    // 최근 검색어 상태 (로컬 스토리지 기반)
  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => {
    const key = isLoggedIn ? 'store_recent_keywords_user' : 'store_recent_keywords_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // 검색어 저장
  const saveKeyword = (newKeyword: string) => {
    let updated = [newKeyword, ...recentKeywords.filter((k) => k !== newKeyword)];
    if (updated.length > 10) updated = updated.slice(0, 10);

    setRecentKeywords(updated);

    if (isLoggedIn) {
      localStorage.setItem('store_recent_keywords_user', JSON.stringify(updated));
    } else {
      localStorage.setItem('store_recent_keywords_guest', JSON.stringify(updated));
    }
  };

  // 검색어 삭제
  const removeKeyword = (e: React.MouseEvent, target: string) => {
    e.stopPropagation();
    const updated = recentKeywords.filter((k) => k !== target);
    setRecentKeywords(updated);
    
    const storageKey = isLoggedIn ? 'store_recent_keywords_user' : 'store_recent_keywords_guest';
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // 검색 실행
  const handleSearch = () => {
    const trimmed = keyword.trim();

    if (trimmed.length === 0) {
      onSearch('');
      setIsFocused(false);
      return;
    }

    if (trimmed.length < 2) return;

    saveKeyword(trimmed);
    onSearch(trimmed);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleChipClick = (word: string) => {
    setKeyword(word);
    saveKeyword(word);
    onSearch(word);
    setIsFocused(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-8 z-20" ref={containerRef}>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="제목, 한줄 소개를 검색해보세요."
            value={keyword}
            maxLength={20}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
          />

          {/* 최근 검색어 팝업 */}
          {isFocused && (
            <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-30">
              <span className="text-xs font-bold text-gray-500 mb-3 block">최근 검색어</span>
              
              {recentKeywords.length === 0 ? (
                <div className="text-sm text-gray-400 py-4 text-center">
                  최근 검색어가 없습니다.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentKeywords.map((word) => (
                    <div 
                      key={word}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={() => handleChipClick(word)}
                    >
                      <span>{word}</span>
                      <button 
                        onClick={(e) => removeKeyword(e, word)}
                        className="p-0.5 hover:bg-gray-300 rounded-full text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors relative">
           <SlidersHorizontal size={20} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <button 
          onClick={handleSearch}
          className="px-8 h-12 font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          검색
        </button>
      </div>

    </div>
  );
};
