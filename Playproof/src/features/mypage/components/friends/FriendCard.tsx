// src/features/mypage/components/friends/FriendCard.tsx

import React from 'react';
import { User, MoreVertical } from 'lucide-react';
import type { FriendData } from '@/features/mypage/types';
import { MYPAGE_ACTION_LABELS } from '@/features/mypage/constants/labels';

interface FriendCardProps {
  friend: FriendData;
  onRemove?: (userId: string) => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
      {/* 좌측: 프로필 + 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 + 온라인 상태 */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <User size={24} />
          </div>
          {friend.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>

        {/* 닉네임 + 상태 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{friend.nickname}</h3>
          <p className="text-xs text-gray-500">
            {friend.isOnline ? '온라인' : friend.lastSeen || '오프라인'}
          </p>
        </div>
      </div>

      {/* 우측: 더보기 버튼 */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 top-10 z-20 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => {
                  console.log('프로필 보기:', friend.userId);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {MYPAGE_ACTION_LABELS.viewProfile}
              </button>
              <button
                onClick={() => {
                  if (onRemove) onRemove(friend.userId);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
              >
                {MYPAGE_ACTION_LABELS.removeFriend}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
