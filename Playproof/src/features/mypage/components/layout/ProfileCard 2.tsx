// src/features/mypage/components/layout/ProfileCard.tsx

import { User } from 'lucide-react';
// src/features/mypage/components/layout/ProfileCard.tsx
import type { MyProfileData } from '@/features/mypage/types';

interface ProfileCardProps {
  profileData: MyProfileData;
}

export function ProfileCard({ profileData }: ProfileCardProps) {
  return (
    <div className="bg-gray-50 p-6 h-full flex items-center">
      <div className="flex items-center gap-4 w-full">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-300">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt={profileData.nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white">
                <User size={40} />
              </div>
            )}
          </div>
        </div>

        {/* 닉네임 + 랭크 */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{profileData.nickname}</h1>
          <p className="mt-1 text-sm text-gray-500">Rank #{profileData.rank}</p>
        </div>
      </div>
    </div>
  );
}
