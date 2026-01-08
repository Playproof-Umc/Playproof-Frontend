import React from 'react';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  nickname: string;
  isMyPage?: boolean; // 내 페이지인지 여부
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ nickname, isMyPage }) => {
  return (
    <div className="-mt-12 mb-4 flex justify-between items-end">
        {/* 아바타 */}
        <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center">
            <User size={48} className="text-gray-400" />
        </div>
        
        {/* 버튼 영역: 내 페이지면 '수정', 남의 페이지면 '친구추가' */}
        <div className="flex gap-2 mb-1">
            {isMyPage ? (
                <button className="px-3 py-1.5 bg-gray-200 text-xs font-bold rounded-lg">프로필 수정</button>
            ) : (
                <>
                    <button className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg">신고</button>
                    <button className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg">친구 추가</button>
                </>
            )}
        </div>
    </div>
  );
};