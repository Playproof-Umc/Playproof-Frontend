//src/features/matching/components/PartyRequestBanner.tsx
import React from 'react';
import { User, Plus, RefreshCw, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { usePartyRequests } from '@/features/matching/hooks/usePartyRequests';

export const PartyRequestBanner = () => {
  // 훅
  const { state, actions } = usePartyRequests();
  const { isOpen, sortedApplicants, bannerDescription, count } = state;

  if (count === 0) return null;

  return (
    <div className="w-full mb-6">
        
        {/* 배너 영역 */}
        <div className={`flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm transition-all duration-200 ${isOpen ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <User size={24} />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{count}</div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base">{count}명의 파티 참가 요청이 있습니다.</h3>
                    <p className="text-sm text-gray-500">{bannerDescription}</p>
                </div>
            </div>
            <button onClick={actions.toggleOpen} className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
                {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
                <span>신청자 목록 확인</span>
            </button>
        </div>

        {/* 목록 영역 */}
        {isOpen && (
            <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-gray-900 text-sm">신청자 목록 <span className="ml-1 text-blue-600">{count}</span></h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <button onClick={actions.handleRejectAll} className="hover:text-black transition-colors">전체 거절</button>
                        <button onClick={actions.handleAcceptAll} className="hover:text-black transition-colors">전체 수락</button>
                        <button className="hover:text-black transition-colors"><RefreshCw size={14} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedApplicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]">
                            <div className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
                                <span>{applicant.game}</span>
                            </div>

                            <div onClick={(e) => actions.handleMoveToProfile(e, applicant.userId)} className="flex flex-col items-center mb-4 cursor-pointer group">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                                    <User size={32} />
                                </div>
                                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:underline underline-offset-2">{applicant.user}</div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                    <span>TS {applicant.ts}</span><Settings size={10} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 line-clamp-1 text-center bg-gray-50 p-2 rounded-lg">"{applicant.title}"</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <button onClick={() => actions.handleRemove(applicant.id)} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white">거절</button>
                                    <button onClick={() => actions.handleRemove(applicant.id)} className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">수락</button>
                                </div>
                                <div className="text-[10px] text-gray-300 font-medium text-center">{applicant.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};