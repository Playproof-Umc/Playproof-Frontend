import React from 'react';
import { Card } from '@/components/ui/Card';
import { fetchMyFeedbacks, type FeedbackData } from '@/data/mockData';
import { FeedbackCard } from './FeedbackCard';

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
        <p className="text-center text-sm text-gray-500">로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card className="!p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">받은 피드백</h2>
        <p className="mt-1 text-sm text-gray-500">
          총 {feedbacks.length}개의 피드백
        </p>
      </div>

      {/* 피드백 카드 3열 그리드 */}
      {feedbacks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">피드백이 없습니다.</p>
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