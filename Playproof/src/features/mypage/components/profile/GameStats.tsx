// src/features/mypage/components/profile/GameStats.tsx

import { MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';
import type { MyProfileData } from '@/features/mypage/types';

interface GameStatsProps {
  gameStats: MyProfileData['gameStats'];
}

export function GameStats({ gameStats }: GameStatsProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-gray-900">
        {MYPAGE_SECTION_LABELS.gameStats}
      </h3>
      <div className="rounded-lg bg-gray-100 p-4 space-y-6">
        {gameStats.map((stat, index) => (
          <div key={index}>
            {/* 게임 이름 */}
            <h4 className="mb-3 text-base font-bold text-gray-900">{stat.game}</h4>
            
            {/* 통계 그리드 */}
            <div className="grid grid-cols-4 gap-4">
              {stat.tier && (
                <div>
                  <p className="text-xs text-gray-500">티어</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.tier}</p>
                </div>
              )}
              {stat.position && (
                <div>
                  <p className="text-xs text-gray-500">포지션</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.position}</p>
                </div>
              )}
              {stat.playTime && (
                <div>
                  <p className="text-xs text-gray-500">플레이 시간</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.playTime}</p>
                </div>
              )}
              {stat.totalGames !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">총 플레이</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.totalGames}게임</p>
                </div>
              )}
              {stat.winRate !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">승률</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.winRate}%</p>
                </div>
              )}
              {stat.kda !== undefined && stat.kda > 0 && (
                <div>
                  <p className="text-xs text-gray-500">KDA</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{stat.kda}</p>
                </div>
              )}
            </div>

            {/* 구분선 (마지막 항목 제외) */}
            {index < gameStats.length - 1 && (
              <div className="mt-4 border-t border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
