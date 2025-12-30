//src/features/team/components/ScheduleList.tsx
import React from 'react';
import { Plus, Users } from 'lucide-react';
import type { Schedule } from '@/types';
import { Card } from '@/components/ui/Card';

interface Props {
  schedules: Schedule[];
}

export const ScheduleList: React.FC<Props> = ({ schedules }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">Schedule</h3>
      </div>
      
      <Card>
        {/* 정기 매칭 일정 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h4 className="font-bold text-sm text-gray-800">정기 매칭 일정</h4>
          <button className="hover:bg-gray-100 p-1 rounded transition">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 일정 리스트 */}
        <div className="p-4 space-y-6">
          {schedules.map((sch, index) => {
            const isFirstItem = index === 0;

            return (
              <div key={sch.id} className="relative">
                <div className="flex gap-3 mb-3">
                  {/* 날짜 뱃지 */}
                  {isFirstItem ? (
                    <div className="border border-gray-300 rounded-lg w-12 h-12 flex flex-col items-center justify-center shrink-0 bg-white">
                      <span className="text-[10px] font-medium text-gray-500">{sch.dateStr.split(' ')[0]}</span>
                      <span className="text-sm font-bold text-gray-900">{sch.dateStr.split(' ')[1]}</span>
                    </div>
                  ) : null}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-base">{sch.timeStr}</span>
                      {!isFirstItem && sch.fullDate && (
                        <span className="text-sm text-gray-500 font-medium">
                          {sch.fullDate.getFullYear()}.{sch.fullDate.getMonth() + 1}.{sch.fullDate.getDate()}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2 font-medium">{sch.title}</div>
                    
                    <div className="flex -space-x-1.5 mb-3">
                      {sch.participants.map((p, idx) => (
                        <div key={idx} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white overflow-hidden flex items-center justify-center">
                           {p.user ? <img src={p.user.avatarUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-200"/>}
                        </div>
                      ))}
                      {sch.needMembers && (
                         <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400">
                           <Plus className="w-3 h-3" />
                         </div>
                      )}
                    </div>
                  </div>
                </div>

                {sch.isCompleted ? (
                   <button className="w-full bg-gray-100 text-gray-500 py-2 rounded text-xs font-medium">완료</button>
                ) : sch.needMembers ? (
                   <button className="w-full border border-gray-200 text-gray-600 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-50">
                     <Users className="w-3 h-3" /> 추가 게이머 찾기
                   </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-800 py-2 rounded text-xs font-bold hover:bg-gray-200">참여</button>
                    <button className="flex-1 bg-gray-200 text-gray-600 py-2 rounded text-xs font-bold hover:bg-gray-300">불참</button>
                  </div>
                )}
                
                {index < schedules.length - 1 && (
                  <div className="absolute -bottom-3 w-full h-px bg-gray-100"></div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};
