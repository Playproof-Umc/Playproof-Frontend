// src/features/matching/components/write/WriteGameSection.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { GAME_CONFIG } from '@/features/matching/constants/matchingConfig';

interface WriteGameSectionProps {
  game: string;
  title: string;
  isProMatch: boolean;
  onGameChange: (game: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProMatchChange: (isPro: boolean) => void;
}

export const WriteGameSection = ({ 
  game, title, isProMatch, 
  onGameChange, onTitleChange, onProMatchChange 
}: WriteGameSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900">게임 선택</label>
        <div className="relative">
          <select 
            value={game} 
            onChange={(e) => onGameChange(e.target.value)} 
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer"
          >
            {Object.keys(GAME_CONFIG).map(g => (<option key={g} value={g}>{g}</option>))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-900">제목</label>
           <div className="flex items-center gap-4 text-sm">
             <label className="flex items-center gap-1.5 cursor-pointer">
               <input type="checkbox" className="accent-black w-4 h-4" checked={!isProMatch} onChange={() => onProMatchChange(false)} />
               <span className="text-gray-700 font-medium">일반</span>
             </label>
             <label className="flex items-center gap-1.5 cursor-pointer">
               <input type="checkbox" className="accent-black w-4 h-4" checked={isProMatch} onChange={() => onProMatchChange(true)} />
               <span className="text-gray-700 font-medium">Pro Match</span>
             </label>
           </div>
        </div>
        <input 
          type="text" 
          placeholder="최대 20글자" 
          value={title} 
          onChange={onTitleChange} 
          className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black placeholder-gray-400 font-medium"
        />
      </div>
    </>
  );
};