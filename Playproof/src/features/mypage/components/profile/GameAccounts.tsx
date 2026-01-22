import React from 'react';
import type { MyProfileData } from '@/features/mypage/types';

interface GameAccountsProps {
  gameAccounts: MyProfileData['gameAccounts'];
}

export function GameAccounts({ gameAccounts }: GameAccountsProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-gray-900">게임 아이디</h3>
      <div className="rounded-lg bg-gray-100 p-4 space-y-4">
        {gameAccounts.map((account, index) => (
          <div key={index} className="flex items-center gap-8 text-sm">
            <span className="w-32 flex-shrink-0 text-gray-600">{account.game}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{account.nickname}</span>
              <a href="#" className="text-blue-600 underline">{account.tag}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}