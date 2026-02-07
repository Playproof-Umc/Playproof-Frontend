// src/features/team/components/azit/TeamMemberList.tsx

//src/features/team/components/azit/TeamMemberList.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { UserAvatar } from '@/features/user/components';

interface Props {
  members: User[];
}

export const TeamMemberList: React.FC<Props> = ({ members }) => {
  return (
    <section>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">멤버</h3>
        {/* 상단 초대 버튼 (+) */}
        <Plus className="w-5 h-5 text-gray-800 cursor-pointer hover:bg-gray-200 rounded-full p-0.5 transition-colors" />
      </div>
      
      {/* 멤버 리스트 */}
      <div className="space-y-3">
        {members.map(member => (
          <Card key={member.id} className="p-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3 cursor-pointer">
              
              {/* 공통 유저 아바타 컴포넌트 사용 */}
              <UserAvatar user={member} />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800 truncate">{member.nickname}</span>
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">
                  {member.isOnline ? '온라인' : '오프라인'}
                </div>
              </div>
            </div>
          </Card>
        ))}

      </div>
    </section>
  );
};
