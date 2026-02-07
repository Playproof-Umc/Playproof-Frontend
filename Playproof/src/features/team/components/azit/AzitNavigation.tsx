// src/features/team/components/azit/AzitNavigation.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { Azit } from '@/features/team/types'; 

interface AzitNavigationProps {
  azits: Azit[];
  selectedId: number;
  onSelect: (id: number) => void;
  onOpenCreate: () => void;
}

export const AzitNavigation: React.FC<AzitNavigationProps> = ({
  azits,
  selectedId,
  onSelect,
  onOpenCreate,
}) => {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white overflow-x-auto">
      {azits.map((azit) => (
        <button
          key={azit.id}
          onClick={() => onSelect(azit.id)}
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm overflow-hidden shrink-0
            ${selectedId === azit.id ? 'ring-4 ring-gray-200 ring-offset-2' : 'hover:scale-105'}
          `}
        >
          {azit.icon ? (
            <img src={azit.icon} alt={azit.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-white font-bold text-lg
              ${azit.id === 1 ? 'bg-gray-900' : 'bg-blue-500'} 
            `}>
              {azit.name.slice(0, 1)}
            </div>
          )}
        </button>
      ))}
      <button 
        className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-500 transition-colors shrink-0"
        onClick={onOpenCreate}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
