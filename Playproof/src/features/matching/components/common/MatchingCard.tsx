// src/features/matching/components/common/MatchingCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import type { MatchingData } from '@/features/matching/types';
import { User, MessageCircle, Eye, Settings, Mic, Heart } from 'lucide-react'; 
import { useAuthStore } from '@/store/authStore';

interface MatchingCardProps {
  data: MatchingData;
  onOpen?: (data: MatchingData) => void;
}

export const MatchingCard: React.FC<MatchingCardProps> = ({ data, onOpen }) => {
  const navigate = useNavigate();
  const { openMatchingDetail, toggleLike, getLikeState, getCommentCount } = useMatchingDetail();
  const likeState = getLikeState(data);
  const commentCount = getCommentCount(data);
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : 'user-1';
  const displayName = data.hostUser.id === currentUserId ? (authNickname ?? data.hostUser.nickname) : data.hostUser.nickname;

  const handleCardClick = () => {
    if (onOpen) {
      onOpen(data);
      return;
    }
    openMatchingDetail(data);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/user/${data.hostUser.id}`);
  };

  // 요청 버튼 클릭 (상세 모달 열기 또는 별도 로직)
  const handleRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openMatchingDetail(data);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group flex flex-col items-center w-[320px] h-[470px]"
    >
      {/* Header: Game Name */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-sm font-bold text-gray-900">{data.game}</span>
        {/* 옵션: 모집중 배지 등을 우측에 배치하거나 생략 가능 */}
      </div>

      {/* Profile Section: Centered */}
      <div className="flex flex-col items-center mb-5">
        <div 
            onClick={handleProfileClick}
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors mb-3 overflow-hidden"
        >
          {data.hostUser.avatarUrl ? (
            <img src={data.hostUser.avatarUrl} alt={data.hostUser.nickname} className="w-full h-full object-cover" />
          ) : (
            <User size={32} />
          )}
        </div>
        
        <div className="text-center">
           <div onClick={handleProfileClick} className="font-bold text-gray-900 text-base hover:underline underline-offset-2 mb-1">
             {displayName}
           </div>
           <div className="flex items-center justify-center gap-1 text-xs text-gray-500 font-medium">
             <span>TS {data.tsScore}</span>
             <Settings size={12} />
           </div>
        </div>
      </div>

      {/* Tags Section: Centered Pills */}
      <div className="flex flex-col items-center gap-2 mb-6">
        {/* Row 1: Key Info (Tier, Role, Mic) */}
        <div className="flex flex-wrap justify-center gap-1.5">
            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-gray-600 flex items-center gap-1">
               {/* 티어 아이콘이 있다면 여기에 추가 */}
               {data.tier}
            </span>
             {/* 마이크 여부 (데이터에 있다면 조건부 렌더링, 예시로 추가함) */}
            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-gray-600">
               <Mic size={10} />
            </span>
        </div>
        
        {/* Row 2: Custom Tags */}
        <div className="flex flex-wrap justify-center gap-1.5">
            {data.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-gray-500">
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Content Section: Left Aligned */}
      <div className="mt-auto w-full">
        <div className="flex items-center gap-1 text-blue-500 text-xs font-bold mb-1">
            <span>모집 인원 {data.currentMembers}/{data.maxMembers}</span>
            <span className="text-[10px]">&gt;</span>
        </div>
        
        <h3 className="font-bold text-gray-900 text-[15px] mb-4 line-clamp-1 break-all">
            {data.title}
        </h3>

        {/* Action Button */}
        <button 
            onClick={handleRequestClick}
            className="w-full flex items-center justify-center gap-2 h-12 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl mb-4 hover:bg-gray-800 transition-colors"
        >
            매칭 요청
        </button>

      {/* Footer: Meta Info */}
      <div className="flex items-center justify-between text-gray-400 text-xs pt-1">
             <span>{data.time}</span>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{data.views}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(data);
                  }}
                  className={`flex items-center gap-1 transition-colors ${
                    likeState.isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="좋아요"
                >
                  <Heart size={14} fill={likeState.isLiked ? "currentColor" : "none"} />
                  <span>{likeState.count}</span>
                </button>
                <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{commentCount}</span>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
