import React from 'react';
import { Card } from '@/components/ui/Card';

export function FeedbackSection() {
  return (
    <Card className="!p-6">
      <h2 className="text-lg font-bold text-gray-900">피드백</h2>
      <p className="mt-4 text-sm text-gray-600">피드백 내용이 여기에 표시됩니다.</p>
      {/* TODO: 피드백 카드 컴포넌트 추가 */}
    </Card>
  );
}