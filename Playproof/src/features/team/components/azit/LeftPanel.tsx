// src/features/team/components/azit/LeftPanel.tsx
import React from 'react';
import { Plus, Volume2, Mic } from 'lucide-react';
import type { User, Schedule } from '@/features/team/types/types';
import { ScheduleItem } from '@/features/team/components/azit/schedule/ScheduleItem';

interface LeftPanelProps {
  members: User[];
  schedules?: Schedule[];
  currentUserId: string;
  onAddSchedule?: (target: HTMLElement) => void;
  // [추가] 상태 변경 핸들러 타입 정의
  onStatusChange?: (scheduleId: string, newStatus: 'JOIN' | 'DECLINE') => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  members, 
  schedules = [], 
  currentUserId,
  onAddSchedule,
  onStatusChange
}) => {
  return (
    <aside className="w-[340px] flex flex-col gap-6 pr-2 overflow-y-auto pb-10 shrink-0 custom-scrollbar">
      
      <section>
        <div className="flex justify-between items-center mb-3 px-1 relative">
          <h2 className="text-lg font-bold text-gray-900">스케줄</h2>
          <button 
            onClick={(e) => onAddSchedule && e.currentTarget.parentElement && onAddSchedule(e.currentTarget.parentElement)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-2 px-1">
            <span className="font-bold text-gray-800 text-sm">정기 매칭 일정</span>
        </div>

        <div className="flex flex-col gap-4">
          {schedules.length > 0 ? (
            schedules.map((sch) => (
              <ScheduleItem 
                key={sch.id} 
                schedule={sch} 
                currentUserId={currentUserId}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
              등록된 일정이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 나머지 음성 채팅 및 멤버 섹션은 동일하게 유지 */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">음성 채팅</h2>
          <button className="hover:bg-gray-100 rounded-full p-1"><Plus className="w-4 h-4 text-gray-400" /></button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer h-12">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-600">로비</span>
          </div>
          <div className="bg-gray-50/50 pb-3 border-b border-gray-50">
             <div className="px-4 py-2 flex items-center gap-3 h-10">
               <Volume2 className="w-4 h-4 text-gray-900" />
               <span className="text-sm font-bold text-gray-900">스크림 룸</span>
             </div>
             <div className="pl-11 pr-4 space-y-2">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-gray-300" />
                 <span className="text-sm text-gray-600 font-medium">레나</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-gray-300" />
                 <span className="text-sm text-gray-600 font-medium">엘릭</span>
                 <Mic className="w-3 h-3 text-red-400 ml-auto" />
               </div>
             </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">멤버</h2>
          <button className="hover:bg-gray-100 rounded-full p-1"><Plus className="w-4 h-4 text-gray-400" /></button>
        </div>
        <div className="space-y-1">
          {members.slice(0, 3).map((member, i) => (
             <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
               <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div>
                 <div className="font-bold text-sm text-gray-900">{member.nickname || 'Member'}</div>
                 <div className="text-[11px] text-gray-400 font-medium">상태메세지</div>
               </div>
             </div>
          ))}
        </div>
      </section>

    </aside>
  );
};
