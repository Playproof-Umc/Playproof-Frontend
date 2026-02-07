// src/features/mypage/components/profile/FavoriteGames.tsx

import { MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';
import type { MyProfileData } from '@/features/mypage/types';

interface FavoriteGamesProps {
  favoriteGames: MyProfileData['favoriteGames'];
}

export function FavoriteGames({ favoriteGames }: FavoriteGamesProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-gray-900">
        {MYPAGE_SECTION_LABELS.favoriteGames}
      </h3>
      <div className="rounded-lg bg-gray-100 p-4 space-y-2">
        {favoriteGames.map((game, index) => (
          <p 
            key={index} 
            className={`text-sm ${game.rank === 1 ? 'text-gray-600' : 'text-gray-400'}`}
          >
            {game.rank ? `${game.rank}위: ` : ''}{game.game}
          </p>
        ))}
      </div>
    </div>
  );
}
