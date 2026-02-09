// src/features/mypage/components/feedback/AddFriendModal.tsx

import React from 'react';
import { X, User } from 'lucide-react';
import { MYPAGE_ACTION_LABELS } from '@/features/mypage/constants/labels';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  userNickname?: string;
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
  const [step, setStep] = React.useState<'search' | 'confirm'>('search');
  const [nickname, setNickname] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    if (userNickname) {
      setStep('confirm');
      setNickname(userNickname);
      return;
    }
    setStep('search');
    setNickname('');
  }, [isOpen, userNickname]);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleSearchConfirm = () => {
    if (!nickname.trim()) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    const targetNickname = nickname.trim();
    if (!targetNickname) return;
    // TODO: 친구 추가 API 호출
    console.log('친구 추가:', { userNickname: targetNickname });
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

        {step === 'search' ? (
          <>
            <h2 className="mb-6 text-center text-lg font-bold text-gray-900">
              {MYPAGE_ACTION_LABELS.addFriendPrompt}
            </h2>
            <div className="mb-8">
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder={MYPAGE_ACTION_LABELS.addFriendInputPlaceholder}
                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
              >
                {MYPAGE_ACTION_LABELS.cancel}
              </button>
              <button
                onClick={handleSearchConfirm}
                className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {MYPAGE_ACTION_LABELS.confirm}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-center text-lg font-bold text-gray-900">
              {MYPAGE_ACTION_LABELS.addFriendConfirmTitle}
            </h2>
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-3 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-white">
                <User size={40} />
              </div>
              <h3 className="text-base font-bold text-gray-900">{nickname}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <span>TS</span>
                <span className="font-semibold text-gray-900">{userTS}</span>
                <img
                  src={`/icons/tiers/icon_tear_${userTier.toLowerCase()}.svg`}
                  alt="tier"
                  className="h-4 w-4"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
              >
                {MYPAGE_ACTION_LABELS.cancel}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {MYPAGE_ACTION_LABELS.confirm}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
