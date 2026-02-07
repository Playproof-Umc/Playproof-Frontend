// src/features/matching/components/write/WritePositionSection.tsx
import { GAME_CONFIG } from '@/features/matching/constants/matchingConfig';

interface WritePositionSectionProps {
  game: string;
  selectedPositions: string[];
  onPositionToggle: (posId: string) => void;
}

export const WritePositionSection = ({ game, selectedPositions, onPositionToggle }: WritePositionSectionProps) => {
  const currentConfig = GAME_CONFIG[game] || GAME_CONFIG['기타'];

  return (
    <div className="space-y-2">
       <label className="text-sm font-bold text-gray-900">
         모집 포지션 <span className="text-xs text-gray-500 font-medium">(중복 가능)</span>
       </label>
       <div className={`grid gap-2 ${currentConfig.positions.length > 4 ? 'grid-cols-5' : 'grid-cols-4'}`}>
          {currentConfig.positions.map((pos) => (
            <button 
              key={pos.id} 
              onClick={() => onPositionToggle(pos.id)} 
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                selectedPositions.includes(pos.id) 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
              }`}
            >
              <span className="mb-1">{pos.icon}</span>
              <span className="text-xs font-bold whitespace-nowrap">{pos.label}</span>
            </button>
          ))}
       </div>
    </div>
  );
};