// src/features/home/components/HomeFriendList.tsx
import React from "react";
import { User } from "lucide-react";

interface Friend {
  id: number;
  nickname: string;
  statusMessage?: string;
  isOnline: boolean;
  avatarUrl?: string;
}

interface HomeFriendListProps {
  friends: Friend[];
}

export const HomeFriendList: React.FC<HomeFriendListProps> = ({ friends }) => {
  const onlineCount = friends.filter((f) => f.isOnline).length;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      {/* 헤더: 제목 + 온라인 뱃지 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">친구 목록</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600 border border-green-100">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {onlineCount} online
        </div>
      </div>

      {/* 친구 리스트 */}
      <ul className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        {friends.map((friend) => (
          <li key={friend.id} className="flex items-center gap-3 group cursor-pointer">
            {/* 아바타 + 온라인 표시 */}
            <div className="relative">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-100 overflow-hidden ring-1 ring-black/5">
                {friend.avatarUrl ? (
                  <img src={friend.avatarUrl} alt={friend.nickname} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <User size={20} />
                  </div>
                )}
              </div>
              {friend.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </div>

            {/* 정보 */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {friend.nickname}
              </div>
              <div className="truncate text-xs font-medium text-zinc-500">
                {friend.statusMessage || (friend.isOnline ? "온라인" : "오프라인")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};