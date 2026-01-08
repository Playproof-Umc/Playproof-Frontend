import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import type { MatchingData } from '@/features/matching/types/types';
import { User, MessageCircle, Heart, Eye, Mic, MicOff } from 'lucide-react';

interface MatchingCardProps {
  data: MatchingData;
}

export const MatchingCard: React.FC<MatchingCardProps> = ({ data }) => {
  const navigate = useNavigate();
  const { openMatchingDetail } = useMatchingDetail();

  // 1. 카드 전체 클릭 -> 상세 모달 오픈
  const handleCardClick = () => {
    openMatchingDetail(data);
  };

  // 2. 프로필 클릭 -> 유저 페이지 이동 (카드 클릭 이벤트 전파 방지)
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/user/${data.hostUser.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative group flex flex-col h-full min-h-[200px]"
    >
      {/* 상단: 뱃지 및 시간 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
           {/* 모집 중 뱃지 (임시 로직) */}
           <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md">
             모집중
           </span>
           {/* 게임명 뱃지 */}
           <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">
             {data.game}
           </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{data.time}</span>
      </div>

      {/* ──────────────────────────────────────────────
          프로필 영역 (클릭 시 페이지 이동)
      ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div 
            onClick={handleProfileClick}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors z-10 shrink-0"
        >
          {data.hostUser.avatarUrl ? (
            <img src={data.hostUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={20} />
          )}
        </div>
        <div className="overflow-hidden">
           <div 
             onClick={handleProfileClick}
             className="font-bold text-sm text-gray-900 hover:underline underline-offset-2 z-10 inline-block truncate max-w-full"
           >
             {data.hostUser.nickname}
           </div>
           <div className="text-xs text-blue-600 font-bold flex items-center gap-1">
             TS {data.tsScore}
           </div>
        </div>
      </div>

      {/* 카드 제목 */}
      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 break-all">
        {data.title}
      </h3>

      {/* 태그 목록 (최대 2줄) */}
      <div className="flex flex-wrap gap-1.5 mb-4 h-12 overflow-hidden content-start">
        {data.tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-500 font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* 하단 정보 (인원, 티어, 통계) */}
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
         
         {/* 좌측: 인원 및 티어 */}
         <div className="flex flex-col gap-1">
            <div className="text-xs font-bold text-gray-900">
              {data.currentMembers} / {data.maxMembers}명
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              {data.tier}
            </div>
         </div>

         {/* 우측: 아이콘 통계 */}
         <div className="flex items-center gap-3 text-gray-300">
            {/* 마이크 상태 (데이터에 없으면 임의 표시) */}
            <Mic size={14} className="text-gray-400" />
            
            <div className="flex items-center gap-0.5 text-xs font-medium">
              <Eye size={12} /> 
              <span>{data.views}</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs font-medium">
              <MessageCircle size={12} /> 
              <span>{data.comments}</span>
            </div>
         </div>
      </div>
      
    </div>
  );
};