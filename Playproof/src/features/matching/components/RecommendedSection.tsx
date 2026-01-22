import React from 'react';
import { RefreshCw, Lock } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/MatchingCard';
import type { MatchingData } from '@/features/matching/types';

interface RecommendedSectionProps {
  isProUser: boolean;
  recommendations: MatchingData[]; 
}

// 코드 리뷰 반영: React.memo로 감싸서 불필요한 리렌더링 방지
export const RecommendedSection = React.memo<RecommendedSectionProps>(({ isProUser, recommendations }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-gray-900">추천 유저</h2>
            {/* Pro 뱃지 */}
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
              PRO ONLY
            </span>
          </div>
          <RefreshCw size={16} className="text-gray-400 cursor-pointer hover:rotate-180 transition-transform duration-500"/>
      </div>
      
      <div className="relative w-full min-h-[240px] rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        
        {/* 일반 유저: 블러 처리 및 업그레이드 유도 */}
        {!isProUser && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-100 p-3 rounded-full mb-3">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <p className="font-bold text-lg text-gray-900 mb-1">매너 좋은 '고티어 유저'를 찾으시나요?</p>
                <p className="text-sm text-gray-500 mb-5">Pro 멤버십으로 TS 점수 상위 1% 유저를 추천받으세요.</p>
                <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Pro 멤버십 시작하기
                </button>
            </div>
        )}
        
        {/* Pro 유저: TS 점수 높은 유저 리스트 (가로 스크롤) */}
        <div className="absolute inset-0 z-10 p-4 flex items-center overflow-x-auto no-scrollbar gap-4">
             {recommendations.map((item) => (
                <div key={`rec-${item.id}`} className="min-w-[260px] w-[260px]">
                   
                   <div className="relative">
                      
                      {item.likes >= 50 && (
                        <div className="absolute -top-2 -left-2 z-20 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          TOP RATED
                        </div>
                      )}
                      <MatchingCard data={item} />
                   </div>
                </div>
             ))}
        </div>

      </div>
    </section>
  );
});