import React from 'react';
import { Card } from '@/components/ui/Card';

export function RecentPosts() {
  return (
    <div className="space-y-6">
      {/* 최근 작성한 매칭 글 */}
      <Card className="!p-6">
        <h2 className="text-lg font-bold text-gray-900">최근 작성한 매칭 글</h2>
        <p className="mt-4 text-sm text-gray-600">매칭 글이 여기에 표시됩니다.</p>
      </Card>

      {/* 최근 작성한 하이라이트 */}
      <Card className="!p-6">
        <h2 className="text-lg font-bold text-gray-900">최근 작성한 하이라이트</h2>
        <p className="mt-4 text-sm text-gray-600">하이라이트가 여기에 표시됩니다.</p>
      </Card>

      {/* 최근 작성한 커뮤니티 글 */}
      <Card className="!p-6">
        <h2 className="text-lg font-bold text-gray-900">최근 작성한 커뮤니티 글</h2>
        <p className="mt-4 text-sm text-gray-600">커뮤니티 글이 여기에 표시됩니다.</p>
      </Card>
    </div>
  );
}