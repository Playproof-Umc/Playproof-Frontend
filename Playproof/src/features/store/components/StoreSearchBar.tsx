// src/features/store/components/StoreSearchBar.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const StoreSearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentKeywords, setRecentKeywords] = useState(['경험치', '닉네임', '멤버십']);

  return (
    <div className="relative w-full mb-6 z-20">
      <div className="flex gap-2">
        <Input 
          placeholder="원하는 아이템을 검색해보세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="flex-1 h-12 text-base bg-white"
        />
        <Button className="h-12 px-8 font-bold bg-gray-900 text-white rounded-lg">
          검색
        </Button>
      </div>

      {/* 최근 검색어 팝업 */}
      {isFocused && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsFocused(false)} 
          />
          <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-20">
            <span className="text-xs font-bold text-gray-500 mb-2 block">최근 검색어</span>
            <div className="flex flex-wrap gap-2">
              {recentKeywords.map((word) => (
                <button 
                  key={word}
                  className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => setKeyword(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};