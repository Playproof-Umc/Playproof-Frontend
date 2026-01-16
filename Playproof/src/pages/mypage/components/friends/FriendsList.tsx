import React from 'react';
import { Card } from '@/components/ui/Card';

interface FriendsListProps {
  type: 'friends' | 'blocked';
}

export function FriendsList({ type }: FriendsListProps) {
  const title = type === 'friends' ? '친구 목록' : '차단 목록';
  const emptyMessage = type === 'friends' 
    ? '친구 목록이 여기에 표시됩니다.' 
    : '차단한 사용자 목록이 여기에 표시됩니다.';

  return (
    <Card className="!p-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-4 text-sm text-gray-600">{emptyMessage}</p>
      {/* TODO: 친구/차단 카드 컴포넌트 추가 */}
    </Card>
  );
}