// src/features/mypage/components/friends/BlockedUserCard.tsx

import { User } from 'lucide-react';
import type { BlockedUserData } from '@/features/mypage/types';

interface BlockedUserCardProps {
  user: BlockedUserData;
  onUnblock?: (userId: string) => void;
}

export function BlockedUserCard({ user, onUnblock }: BlockedUserCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
      {/* 좌측: 프로필 + 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
          <User size={24} />
        </div>

        {/* 닉네임 + 차단 날짜 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{user.nickname}</h3>
          <p className="text-xs text-gray-500">차단됨 · {user.blockedAt}</p>
        </div>
      </div>

      {/* 우측: 해제 버튼 */}
      <button
        onClick={() => onUnblock && onUnblock(user.userId)}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
      >
        해제
      </button>
    </div>
  );
}