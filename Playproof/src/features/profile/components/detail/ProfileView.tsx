// src/features/profile/components/detail/ProfileView.tsx
import { X, User, ThumbsUp, MessageCircle, Gamepad2, Trophy } from 'lucide-react';
import type { UserProfile } from '@/features/profile/types';

interface ProfileViewProps {
  userData: UserProfile;
  onClose: () => void;
  onChatRequest: () => void;
}

export const ProfileView = ({ userData, onClose, onChatRequest }: ProfileViewProps) => {
  return (
    <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
      
      {/* 상단 배경 및 닫기 버튼 */}
      <div className="h-24 bg-gradient-to-r from-gray-800 to-black relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 p-1 rounded-full backdrop-blur-md">
          <X size={20} />
        </button>
      </div>

      <div className="px-6 pb-6 relative">
        {/* 프로필 이미지 및 액션 버튼 */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center text-gray-400">
            <User size={48} />
          </div>
          <div className="flex gap-2 mb-1">
            <button className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">신고</button>
            <button className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">친구 추가</button>
          </div>
        </div>

        {/* 닉네임 및 점수 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {userData.nickname}
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">LV. 24</span>
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1 text-blue-600 font-bold"><Trophy size={14} /> <span>TS {userData.tsScore}</span></div>
            <div className="flex items-center gap-1 text-green-600 font-bold"><ThumbsUp size={14} /> <span>매너 {userData.mannerScore}</span></div>
          </div>
        </div>

        {/* 소개글 */}
        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 mb-6">"{userData.introduction}"</div>

        {/* 게임 태그 정보 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Played Games</h3>
            <div className="flex gap-2">
              {userData.mostGames.map((game) => (
                <span key={game} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                  <Gamepad2 size={12} /> {game}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Play Style</h3>
            <div className="flex flex-wrap gap-2">
              {userData.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"># {tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <button onClick={onChatRequest} className="w-full mt-8 bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
          <MessageCircle size={18} /><span>1:1 채팅 요청하기</span>
        </button>
      </div>
    </div>
  );
};
