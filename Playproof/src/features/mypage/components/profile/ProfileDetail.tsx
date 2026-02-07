// src/features/mypage/components/profile/ProfileDetail.tsx

import { Card } from '@/components/ui/Card';
import { User } from 'lucide-react';
import type { MyProfileData } from '@/features/mypage/types';
import { PlayStyleTags } from '@/features/mypage/components/profile/PlayStyleTags';
import { FeedbackTags } from '@/features/mypage/components/profile/FeedbackTags';
import { GameAccounts } from '@/features/mypage/components/profile/GameAccounts';
import { GameStats } from '@/features/mypage/components/profile/GameStats';
import { FavoriteGames } from '@/features/mypage/components/profile/FavoriteGames';

interface ProfileDetailProps {
  profileData: MyProfileData;
}

export function ProfileDetail({ profileData }: ProfileDetailProps) {
  return (
    <>
      {/* 상세 통계 카드 */}
      <Card className="!p-6">
        {/* 프로필 이미지 중앙 */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-white">
              <User size={48} />
            </div>
          </div>
        </div>

        {/* 이름 + 티어 */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">{profileData.nickname}</h2>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Tier</span>
            <img 
              src={`/icons/tiers/icon_tear_${profileData.tier.toLowerCase()}.svg`}
              alt={`${profileData.tier} tier`}
              className="h-5 w-5"
            />
            <span className="text-sm text-gray-500">TS {profileData.tierScore}</span>
          </div>
        </div>

        {/* 통계 3개 */}
        <div className="mt-6 grid grid-cols-3 gap-6 border-y border-gray-100 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">랭킹</p>
            <p className="mt-1 text-lg font-bold text-gray-900">#{profileData.ranking.rank}</p>
            <p className="text-xs text-gray-400">(상위 {profileData.ranking.percentile}%)</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Temper Score</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{profileData.temperScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">긍정 평가</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{profileData.positivityRating}%</p>
          </div>
        </div>

        {/* 각 섹션을 간격을 두고 배치 */}
        <div className="mt-6 space-y-4">
          <PlayStyleTags 
            playStyles={profileData.playStyles} 
            preferredTags={profileData.preferredTags}
          />
          <FeedbackTags feedbackTags={profileData.feedbackTags} />
          <GameAccounts gameAccounts={profileData.gameAccounts} />
          <GameStats gameStats={profileData.gameStats} />
          <FavoriteGames favoriteGames={profileData.favoriteGames} />
        </div>
      </Card>
    </>
  );
}