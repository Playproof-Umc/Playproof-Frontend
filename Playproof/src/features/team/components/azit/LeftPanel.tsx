// src/features/team/components/azit/LeftPanel.tsx
import React from 'react';
import { Plus, Volume2, Mic, Hash } from 'lucide-react'; // Hash 아이콘 추가 (채팅방용)
import { Card } from '@/components/ui/Card';
import type { User } from '@/types';

interface LeftPanelProps {
  members: User[];
  [key: string]: any;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ members }) => {
  return (
    <aside className="w-[340px] flex flex-col gap-6 pr-2 overflow-y-auto pb-10 shrink-0 custom-scrollbar">
      
      {/* 스케줄 섹션 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">스케줄</h2>
        
        
        <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-xl bg-white">
          
          {/* 정기 매칭 일정 헤더 */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
            <span className="font-bold text-gray-800 text-sm">정기 매칭 일정</span>
            <button className="text-gray-400 hover:bg-gray-100 p-1 rounded">
               <span className="sr-only">옵션</span>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
          
          {/* 메인 일정 (카운트다운) */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-4 mb-4">
               {/* 날짜 배지 */}
               <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl w-[52px] h-[52px] shrink-0">
                  <span className="text-[11px] text-gray-500 font-medium uppercase leading-none mb-0.5">Mon</span>
                  <span className="text-xl font-bold text-gray-900 leading-none">22</span>
               </div>
               
               {/* 내용 */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-lg font-bold text-gray-900 leading-none">20:00</span>
                   <Volume2 className="w-4 h-4 text-gray-400" />
                 </div>
                 <div className="text-sm text-gray-600 font-medium truncate">데바데 5인큐</div>
                 {/* 아바타 */}
                 <div className="flex -space-x-1.5 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                 </div>
               </div>
            </div>

            {/* 타이머 */}
            <div className="bg-gray-50 rounded-lg py-3 text-center mb-3">
              <div className="text-[11px] text-gray-500 mb-0.5">매칭완료까지</div>
              <div className="text-2xl font-black text-gray-900 tabular-nums tracking-tight">
                1 : 59 : 30
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-gray-200 text-gray-900 py-2 rounded-lg text-xs font-bold hover:bg-gray-50">
                참여
              </button>
              <button className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">
                불참
              </button>
            </div>
          </div>

          {/* 하위 일정  */}
          <div className="p-4 border-b border-gray-100 last:border-0">
             <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 text-base">20:00</span>
                <span className="text-xs text-gray-500 font-medium">2025.12.8</span>
             </div>
             <div className="text-sm text-gray-700 font-medium mb-2">데바데 5인큐</div>
             <div className="flex items-center gap-1.5 mb-3">
                {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200" />)}
             </div>
             <button className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-xs font-bold cursor-not-allowed">
               완료
             </button>
          </div>
          
          {/* 하위 일정 2 */}
          <div className="p-4">
             <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 text-base">20:00</span>
                <span className="text-xs text-gray-500 font-medium">2025.12.8</span>
             </div>
             <div className="text-sm text-gray-700 font-medium mb-2">데바데 3인큐</div>
             <div className="flex items-center gap-1.5 mb-3">
                {[1,2].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200" />)}
             </div>
             <button className="w-full bg-white border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-1">
               <Plus className="w-3 h-3" /> 추가 게이머 찾기
             </button>
          </div>

        </Card>
      </section>

      {/*음성 채팅 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">음성 채팅</h2>
          <button className="hover:bg-gray-100 rounded-full p-1"><Plus className="w-4 h-4 text-gray-400" /></button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          
          {/* 로비 (일반 음성방) */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer h-12">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-600">로비</span>
          </div>

          {/* 스크림 룸 (활성 - 참여자 표시) */}
          <div className="bg-gray-50/50 pb-3 border-b border-gray-50">
             <div className="px-4 py-2 flex items-center gap-3 h-10">
               <Volume2 className="w-4 h-4 text-gray-900" />
               <span className="text-sm font-bold text-gray-900">스크림 룸</span>
             </div>
             {/* 참여자 리스트 (들여쓰기) */}
             <div className="pl-11 pr-4 space-y-2">
               {/* 유저 1 */}
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-gray-300" />
                 <span className="text-sm text-gray-600 font-medium">레나</span>
               </div>
               {/* 유저 2 */}
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-gray-300" />
                 <span className="text-sm text-gray-600 font-medium">엘릭</span>
                 <Mic className="w-3 h-3 text-red-400 ml-auto" />
               </div>
             </div>
          </div>

          {/* 그 아래 다른 채팅방 (팀 채팅) */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer h-12">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-500">팀 채팅</span>
          </div>
          
           {/* 그 아래 다른 채팅방 (수다방) */}
           <div className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer h-12">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-500">수다방</span>
          </div>
        </div>
      </section>

      {/* 멤버 섹션 */}
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