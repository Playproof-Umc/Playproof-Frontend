// src/features/matching/components/detail/MatchingPostInfo.tsx
import { MoreHorizontal, User, UserPlus, Home, AlertTriangle, Eye, Heart, MessageCircle } from 'lucide-react';
import { getPositionInfo } from '@/features/matching/utils/matchingUtils';
import type { MatchingData } from '@/features/matching/types';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import { useAuthStore } from '@/store/authStore';

interface MatchingPostInfoProps {
  post: MatchingData;
  commentCount: number;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onMoveToProfile: (userId: string) => void;
}

export const MatchingPostInfo = ({ post, commentCount, isMenuOpen, onToggleMenu, onMoveToProfile }: MatchingPostInfoProps) => {
  const { toggleLike, getLikeState } = useMatchingDetail();
  const likeState = getLikeState(post);
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : 'user-1';
  const displayName = post.hostUser.id === currentUserId ? (authNickname ?? post.hostUser.nickname) : post.hostUser.nickname;
  return (
    <div className="w-[60%] p-8 flex flex-col h-full overflow-y-auto border-r border-gray-100 relative scrollbar-hide">
      {/* Header & Menu */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-bold text-gray-400">{post.time}</span>
        <div className="relative">
          <button onClick={onToggleMenu} className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={24} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
              <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><UserPlus size={14} /> 친구추가</button>
              <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><Home size={14} /> 아지트 초대</button>
              <button className="w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 text-left"><AlertTriangle size={14} /> 신고하기</button>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 mb-8">
        <div onClick={() => onMoveToProfile(post.hostUser.id)} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
          {post.hostUser.avatarUrl ? <img src={post.hostUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover"/> : <User size={32} />}
        </div>
        <div>
          <h2 onClick={() => onMoveToProfile(post.hostUser.id)} className="text-xl font-bold text-gray-900 cursor-pointer hover:underline underline-offset-2">{displayName}</h2>
          <p className="text-xs font-medium text-gray-500 mt-1">TS {post.tsScore}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
          {post.memo || "작성된 내용이 없습니다."}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center"><span className="w-24 text-xs font-bold text-gray-900">모집티어</span><span className="text-sm font-medium text-gray-600">{post.tier}</span></div>
        <div className="flex items-center"><span className="w-24 text-xs font-bold text-gray-900">아지트</span><span className="text-sm font-medium text-gray-600">{post.azit}</span></div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold text-gray-900 mb-2">이런 사람을 원해요!</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.length > 0 ? post.tags.map(tag => (<span key={tag} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">{tag}</span>)) : <span className="text-xs text-gray-400">태그 없음</span>}
        </div>
      </div>

      {/* Footer (Positions & Stats) */}
      <div className="mt-auto">
        <p className="text-xs font-bold text-gray-900 mb-2">모집 포지션</p>
        <div className="flex gap-2 mb-6">
          {post.position?.map(posId => {
            const { label, icon } = getPositionInfo(posId);
            return (<div key={posId} className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-500 text-[11px] font-bold gap-1.5">{icon}<span>{label}</span></div>);
          })}
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-400 border-t border-gray-50 pt-4">
          <div className="flex items-center gap-1"><Eye size={14} /> <span>{post.views}</span></div>
          <button
            type="button"
            onClick={() => toggleLike(post)}
            className={`flex items-center gap-1 transition-colors ${
              likeState.isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="좋아요"
          >
            <Heart size={14} fill={likeState.isLiked ? "currentColor" : "none"} />
            <span>{likeState.count}</span>
          </button>
          <div className="flex items-center gap-1"><MessageCircle size={14} /> <span>{commentCount}</span></div>
        </div>
      </div>
    </div>
  );
};
