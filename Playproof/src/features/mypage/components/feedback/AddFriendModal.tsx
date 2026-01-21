import React from 'react';
import { X, User } from 'lucide-react';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  userNickname: string;
  userTier?: string;
  userTS?: number;
}

export function AddFriendModal({ 
  isOpen, 
  onClose, 
  userNickname,
  userTier = 'platinum',
  userTS = 98 
}: AddFriendModalProps) {
  const [message, setMessage] = React.useState('');

  if (!isOpen) return null;

  const handleCancel = () => {
    setMessage('');
    onClose();
  };

  const handleConfirm = () => {
    // TODO: 친구 추가 API 호출
    console.log('친구 추가:', { userNickname, message });
    setMessage('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-6 text-center text-lg font-bold text-gray-900">
          해당 유저를 추가하시겠습니까?
        </h2>

        {/* 프로필 영역 */}
        <div className="mb-6 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className="mb-3 h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <User size={40} />
          </div>

          {/* 닉네임 */}
          <h3 className="text-base font-bold text-gray-900">{userNickname}</h3>
          
          {/* TS 점수 */}
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-gray-500">TS</span>
            <span className="text-sm font-semibold text-gray-900">{userTS}</span>
            <img 
              src={`/icons/tiers/icon_tear_${userTier.toLowerCase()}.svg`}
              alt="tier" 
              className="h-4 w-4"
            />
          </div>
        </div>

        {/* 메시지 입력 (선택사항) */}
        <div className="mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="친구 추가 메시지를 입력하세요 (선택사항)"
            className="w-full rounded-lg border border-gray-300 p-3 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            maxLength={100}
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {message.length}/100
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-blue-500 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}