// src/features/matching/components/search/MatchingFilterModal.tsx
import React, { useState } from 'react'; // useEffect 삭제
import { X, RotateCcw } from 'lucide-react';
import { GAME_CONFIG, TAGS } from '@/features/matching/constants/matchingConfig';
import type { FilterState } from '@/features/matching/types';

interface MatchingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGame: string;
  onApply: (filters: FilterState) => void;
}

const INITIAL_FILTERS: FilterState = {
  minTs: '상관 없음',
  memberCount: '제한 없음',
  tags: [],
  useMic: false,
  positions: [],
  tiers: [],
};

export const MatchingFilterModal: React.FC<MatchingFilterModalProps> = ({
  isOpen,
  onClose,
  activeGame,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  if (!isOpen) return null;

  const currentConfig = GAME_CONFIG[activeGame] || GAME_CONFIG['기타'];

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const togglePosition = (posId: string) => {
    setFilters(prev => ({
      ...prev,
      positions: prev.positions.includes(posId)
        ? prev.positions.filter(p => p !== posId)
        : [...prev.positions, posId]
    }));
  };

  const toggleTier = (tier: string) => {
    setFilters(prev => ({
      ...prev,
      tiers: prev.tiers.includes(tier)
        ? prev.tiers.filter(t => t !== tier)
        : [...prev.tiers, tier]
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const selectedCount = filters.tags.length + filters.positions.length + filters.tiers.length;

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-default" onClick={onClose} />

      <div 
        className="absolute top-full right-0 mt-3 z-50 w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white">
          <h2 className="text-[17px] font-bold text-gray-900">
            {activeGame} 상세 필터
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-7 overflow-y-auto max-h-[60vh] scrollbar-hide bg-white">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">최소 TS</label>
              <div className="relative">
                <select 
                  value={filters.minTs}
                  onChange={(e) => setFilters({...filters, minTs: e.target.value})}
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                >
                  <option>상관 없음</option>
                  <option>90이상</option>
                  <option>80이상</option>
                  <option>70이상</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">모집 인원</label>
              <div className="relative">
                <select 
                  value={filters.memberCount}
                  onChange={(e) => setFilters({...filters, memberCount: e.target.value})}
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                >
                  <option>제한 없음</option>
                  <option>2명</option>
                  <option>3명</option>
                  <option>4명</option>
                  <option>5명</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">성향 태그</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    filters.tags.includes(tag)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
             <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.useMic}
                  onChange={(e) => setFilters({...filters, useMic: e.target.checked})}
                  className="w-5 h-5 border-2 border-gray-300 rounded checked:bg-black checked:border-black transition-colors cursor-pointer appearance-none peer"
                />
                <svg className="absolute w-3.5 h-3.5 text-white left-0.5 top-0.5 pointer-events-none peer-checked:block hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">마이크 사용 필수</span>
          </label>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">모집 포지션</label>
            <div className="grid grid-cols-2 gap-2">
              {currentConfig.positions.map((pos) => (
                <button 
                    key={pos.id}
                    onClick={() => togglePosition(pos.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${
                        filters.positions.includes(pos.id) 
                        ? 'bg-gray-900 border-gray-900 text-white' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                    <div className="opacity-80 scale-90">{pos.icon}</div>
                    <span className="text-xs font-bold">{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-bold text-gray-900">모집 티어</label>
             <div className="grid grid-cols-3 gap-2">
                {currentConfig.tiers.map((tier) => (
                  <button 
                    key={tier}
                    onClick={() => toggleTier(tier)} 
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        filters.tiers.includes(tier)
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-50 bg-gray-50/50 flex gap-3">
          <button 
            onClick={handleReset}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition-colors"
            title="초기화"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 h-12 bg-[#1A1F2C] hover:bg-black text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-gray-200"
          >
            필터 적용하기 {selectedCount > 0 && `(${selectedCount})`}
          </button>
        </div>
      </div>
    </>
  );
};
