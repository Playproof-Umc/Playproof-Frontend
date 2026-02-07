// src/features/community/components/community-search/CommunitySearchInput.tsx

import React from "react";
import { Search, X } from "lucide-react";

type CommunitySearchInputProps = {
  activeTab: string;
  userId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: (query: string) => void;
};

export function CommunitySearchInput({
  activeTab,
  userId,
  searchQuery,
  onSearchChange,
  onSearch,
}: CommunitySearchInputProps) {
  const storageKey = userId ? `recent_${userId}_community_${activeTab}` : `recent_guest_community`;
  const [recentKeywords, setRecentKeywords] = React.useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [showRecentSearch, setShowRecentSearch] = React.useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 20) {
      onSearchChange(value);
    }
  };

  const handleSubmit = (keyword: string) => {
    if (!keyword.trim()) return;
    if (keyword.length >= 2) {
      const newKeywords = [keyword, ...recentKeywords.filter((k) => k !== keyword)].slice(0, 10);
      setRecentKeywords(newKeywords);
      localStorage.setItem(storageKey, JSON.stringify(newKeywords));
    }
    onSearch?.(keyword);
    setShowRecentSearch(false);
  };

  const removeKeyword = (event: React.MouseEvent, keyword: string) => {
    event.stopPropagation();
    const newKeywords = recentKeywords.filter((k) => k !== keyword);
    setRecentKeywords(newKeywords);
    localStorage.setItem(storageKey, JSON.stringify(newKeywords));
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={`'${activeTab}' 내 검색 (2글자 이상)`}
        className="w-full rounded-lg bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder-gray-400 focus:ring-2 focus:ring-black"
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => setShowRecentSearch(true)}
        onBlur={() => setTimeout(() => setShowRecentSearch(false), 200)}
        onKeyDown={(event) => event.key === "Enter" && handleSubmit(searchQuery)}
      />

      {showRecentSearch && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-500">
              최근 검색어 ({userId ? `${activeTab}` : "Guest"})
            </div>
          </div>
          {recentKeywords.length === 0 ? (
            <div className="py-4 text-center text-xs text-gray-400">
              최근 검색 내역이 없습니다.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentKeywords.map((keyword, index) => (
                <div
                  key={`${keyword}-${index}`}
                  className="flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                  onMouseDown={() => handleSubmit(keyword)}
                >
                  <span>{keyword}</span>
                  <X
                    size={12}
                    className="text-gray-400 hover:text-black"
                    onClick={(event) => removeKeyword(event, keyword)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
