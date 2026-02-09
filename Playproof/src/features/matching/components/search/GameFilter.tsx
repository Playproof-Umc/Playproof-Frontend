// src/features/matching/components/search/GameFilter.tsx

//src/features/matching/components/search/GameFilter.tsx
import React from 'react';

interface GameFilterProps {
  games: string[];
  activeGame: string;
  onGameSelect: (game: string) => void;
}

export const GameFilter: React.FC<GameFilterProps> = ({ games, activeGame, onGameSelect }) => {
  return (
    <div className="flex gap-6 text-sm font-medium text-gray-500 overflow-x-auto w-full md:w-auto no-scrollbar">
      {games.map((game) => (
          <button 
              key={game} 
              type="button"
              onClick={() => onGameSelect(game)}
              className={`${activeGame === game ? 'text-black font-bold border-b-2 border-black pb-0.5' : 'hover:text-black'} whitespace-nowrap transition-colors`}
          >
              {game}
          </button>
      ))}
    </div>
  );
};
