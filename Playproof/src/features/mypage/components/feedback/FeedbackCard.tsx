// src/features/mypage/components/feedback/FeedbackCard.tsx

import React from 'react';
import { User, ThumbsUp, ThumbsDown, UserPlus, Siren } from 'lucide-react';
import type { FeedbackData } from '@/features/mypage/types';
import { AddFriendModal } from '@/features/mypage/components/feedback/AddFriendModal';
import { ReportModal } from '@/features/mypage/components/feedback/ReportModal';
import { MYPAGE_ACTION_LABELS } from '@/features/mypage/constants/labels';

interface FeedbackCardProps {
  feedback: FeedbackData;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const isPositive = feedback.temperScoreChange > 0;
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-[320px]">
        {/* 상단: TS 점수 + 아이콘 / 신고 + 친구추가 */}
        <div className="mb-4 flex items-center justify-between flex-shrink-0">
          {/* 좌측: TS 점수 변화 */}
          <div className="flex items-center gap-2">
            {isPositive ? (
              <ThumbsUp className="h-5 w-5 text-blue-500" />
            ) : (
              <ThumbsDown className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
              TS {isPositive ? '+' : ''}{feedback.temperScoreChange}
            </span>
          </div>

          {/* 우측: 신고하기 + 친구추가 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              title={MYPAGE_ACTION_LABELS.report}
            >
              <Siren className="h-4 w-4 text-red-500" />
            </button>
            <button
              onClick={() => setIsAddFriendModalOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              title={MYPAGE_ACTION_LABELS.addFriendTitle}
            >
              <UserPlus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 중앙: 프로필 + 닉네임 + TS + 메모 */}
        <div className="mb-4 flex flex-col items-center text-center flex-shrink-0">
          {/* 프로필 이미지 */}
          <div className="mb-3 h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <User size={32} />
          </div>

          {/* 닉네임 + TS */}
          <h3 className="text-base font-bold text-gray-900">{feedback.fromUser.nickname}</h3>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-gray-500">TS</span>
            <span className="text-sm font-semibold text-gray-900">98</span>
            <img 
              src="/icons/tiers/icon_tear_platinum.svg" 
              alt="tier" 
              className="h-4 w-4"
            />
          </div>

          {/* 메모 (2줄 고정, 넘으면 스크롤) */}
          {feedback.memo && (
            <div className="mt-3 w-full max-h-[2.5rem] overflow-y-auto">
              <p className="text-xs text-gray-700 leading-relaxed break-all">
                "{feedback.memo}"
              </p>
            </div>
          )}
        </div>

        {/* 하단: 피드백 태그 */}
        <div className="flex flex-wrap justify-center gap-2 flex-shrink-0">
          {feedback.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 친구 추가 모달 */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        userNickname={feedback.fromUser.nickname}
        userTier="platinum"
        userTS={98}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetUserNickname={feedback.fromUser.nickname}
      />
    </>
  );
}
