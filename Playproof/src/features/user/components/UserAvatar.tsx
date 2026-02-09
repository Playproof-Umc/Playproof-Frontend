// src/features/user/components/UserAvatar.tsx

//src/features/user/components/UserAvatar.tsx
import React from 'react';
import type { User } from '@/types';

interface Props {
  user: User | null; 
  size?: string;     
  showStatus?: boolean; // 온라인 상태 
}

export const UserAvatar: React.FC<Props> = ({ 
  user, 
  size = "w-10 h-10", 
  showStatus = true 
}) => {
  if (!user) {
    return <div className={`${size} rounded-full bg-gray-200`} />;
  }

  return (
    <div className={`relative shrink-0 ${size}`}>
      {/* 이미지 또는 이니셜(IMG) */}
      {user.avatarUrl ? (
        <img 
          src={user.avatarUrl} 
          alt={user.nickname} 
          className="w-full h-full rounded-full object-cover border border-gray-100" 
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-100">
          <span className="text-[10px] font-bold">IMG</span>
        </div>
      )}

      {/* 온라인 상태 표시 */}
      {showStatus && user.isOnline && (
        <span className="absolute bottom-0 right-0 w-[25%] h-[25%] bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};