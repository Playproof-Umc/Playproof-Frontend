// src/features/mypage/components/friends/FriendsList.tsx

import React from 'react';
import { Search } from 'lucide-react';
import { getFriends, getBlockedUsers, removeFriend, unblockUser } from '@/features/mypage/api/mypageApi';
import type { FriendData, BlockedUserData } from '@/features/mypage/types';
import { FriendCard } from '@/features/mypage/components/friends/FriendCard';
import { BlockedUserCard } from '@/features/mypage/components/friends/BlockedUserCard';
import { MYPAGE_ACTION_LABELS, MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';
import { AddFriendModal } from '@/features/mypage/components/feedback/AddFriendModal';

export function FriendsList() {
  const [friends, setFriends] = React.useState<FriendData[]>([]);
  const [blockedUsers, setBlockedUsers] = React.useState<BlockedUserData[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = React.useState('');
  const [blockedSearchQuery, setBlockedSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [isAddFriendOpen, setIsAddFriendOpen] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [friendsData, blockedData] = await Promise.all([
          getFriends(),
          getBlockedUsers(),
        ]);
        setFriends(friendsData);
        setBlockedUsers(blockedData);
      } catch (error) {
        console.error('Failed to load friends/blocked users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRemoveFriend = async (userId: string) => {
    if (confirm(MYPAGE_ACTION_LABELS.confirmRemoveFriend)) {
      try {
        await removeFriend(userId);
        setFriends(friends.filter(f => f.userId !== userId));
      } catch (error) {
        console.error('Failed to remove friend:', error);
        alert(MYPAGE_ACTION_LABELS.removeFriendFail);
      }
    }
  };

  const handleUnblock = async (userId: string) => {
    if (confirm(MYPAGE_ACTION_LABELS.confirmUnblock)) {
      try {
        await unblockUser(userId);
        setBlockedUsers(blockedUsers.filter(u => u.userId !== userId));
      } catch (error) {
        console.error('Failed to unblock user:', error);
        alert(MYPAGE_ACTION_LABELS.unblockFail);
      }
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.nickname.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  const filteredBlockedUsers = blockedUsers.filter(user =>
    user.nickname.toLowerCase().includes(blockedSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">{MYPAGE_ACTION_LABELS.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 친구 목록 섹션 */}
      <div className="space-y-6">
        {/* 헤더 + 친구 추가 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {MYPAGE_SECTION_LABELS.friends} ({friends.length}명)
          </h2>
          <button
            type="button"
            onClick={() => setIsAddFriendOpen(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            {MYPAGE_ACTION_LABELS.addFriend}
          </button>
        </div>

        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={friendSearchQuery}
            onChange={(e) => setFriendSearchQuery(e.target.value)}
            placeholder={MYPAGE_ACTION_LABELS.searchFriendPlaceholder}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* 친구 목록 */}
        <div className="space-y-3">
          {filteredFriends.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              {friendSearchQuery
                ? MYPAGE_ACTION_LABELS.emptySearch
                : MYPAGE_ACTION_LABELS.emptyFriends}
            </p>
          ) : (
            filteredFriends.map((friend) => (
              <FriendCard
                key={friend.userId}
                friend={friend}
                onRemove={handleRemoveFriend}
              />
            ))
          )}
        </div>
      </div>

      {/* 차단 유저 섹션 */}
      <div className="space-y-6">
        {/* 헤더 */}
        <h2 className="text-xl font-bold text-gray-900">
          {MYPAGE_SECTION_LABELS.blockedUsers}
        </h2>

        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={blockedSearchQuery}
            onChange={(e) => setBlockedSearchQuery(e.target.value)}
            placeholder={MYPAGE_ACTION_LABELS.searchFriendPlaceholder}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* 차단 유저 목록 */}
        <div className="space-y-3">
          {filteredBlockedUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              {blockedSearchQuery
                ? MYPAGE_ACTION_LABELS.emptySearch
                : MYPAGE_ACTION_LABELS.emptyBlocked}
            </p>
          ) : (
            filteredBlockedUsers.map((user) => (
              <BlockedUserCard
                key={user.userId}
                user={user}
                onUnblock={handleUnblock}
              />
            ))
          )}
        </div>
      </div>

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
    </div>
  );
}
