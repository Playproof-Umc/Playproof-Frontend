// src/features/mypage/components/feedback/FeedbackSection.tsx

import React from 'react';
import { Card } from '@/components/ui/Card';
import { fetchMyFeedbacks } from '@/features/mypage/data/mockMyPageData';
import type { FeedbackData } from '@/features/mypage/types';
import { FeedbackCard } from '@/features/mypage/components/feedback/FeedbackCard';
import { MYPAGE_ACTION_LABELS, MYPAGE_FEEDBACK_LABELS, MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';

export function FeedbackSection() {
  const [feedbacks, setFeedbacks] = React.useState<FeedbackData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchMyFeedbacks();
        setFeedbacks(data);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  if (loading) {
    return (
      <Card className="!p-6">
        <p className="text-center text-sm text-gray-500">
          {MYPAGE_ACTION_LABELS.loading}
        </p>
      </Card>
    );
  }

  return (
    <Card className="!p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          {MYPAGE_SECTION_LABELS.feedbackTitle}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {MYPAGE_FEEDBACK_LABELS.totalPrefix} {feedbacks.length}
          {MYPAGE_FEEDBACK_LABELS.totalSuffix}
        </p>
      </div>

      {/* 피드백 카드 3열 그리드 */}
      {feedbacks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">{MYPAGE_FEEDBACK_LABELS.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </Card>
  );
}
