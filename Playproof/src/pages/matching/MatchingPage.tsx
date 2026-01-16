import React, { useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { MatchingSearchBar } from '@/features/matching/components/MatchingSearchBar';
import { GameFilter } from '@/features/matching/components/GameFilter';
import { RecommendedSection } from '@/features/matching/components/RecommendedSection';
import { PartyRequestBanner } from '@/features/matching/components/PartyRequestBanner';
import { MatchingWriteModal } from '@/features/matching/components/MatchingWriteModal';
import { PopularMatchList } from '@/features/matching/components/home/PopularMatchList';
import { FilteredMatchList } from '@/features/matching/components/home/FilteredMatchList';
import { useMatchingBoard } from '@/features/matching/hooks/useMatchingBoard';
import { GAME_LIST } from '@/features/matching/constants/matchingConfig';

const CURRENT_USER_ID = 'user-1';

const MatchingPage = () => {
  const { state, setters, actions } = useMatchingBoard();
  const { 
    allMatches, activeGame, searchText, isWriteModalOpen, isFilterModalOpen, 
    isProUser, matchesByGame, popularMatches, filteredMatches 
  } = state;

  // 코드 리뷰 반영: slice 연산 최적화를 위해 useMemo 사용
  const recommendedData = useMemo(() => {
    return matchesByGame.slice(0, 3);
  }, [matchesByGame]);

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      <Navbar 
        isProUser={isProUser} 
        onTogglePro={() => setters.setIsProUser(!isProUser)} 
      />

      <div className="bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col gap-5">
          <div className="w-full">
             <GameFilter 
               games={GAME_LIST} 
               activeGame={activeGame} 
               onGameSelect={setters.setActiveGame} 
             />
          </div>
          <div className="w-full border-t border-gray-50 pt-5">
             <MatchingSearchBar 
                key={`${activeGame}-${CURRENT_USER_ID}`}
                searchText={searchText} 
                onSearchChange={setters.setSearchText} 
                onSearchSubmit={setters.setSearchText}
                onWriteClick={actions.openWriteModal}
                isFilterOpen={isFilterModalOpen}
                onFilterToggle={() => isFilterModalOpen ? actions.closeFilterModal() : actions.openFilterModal()}
                onFilterClose={actions.closeFilterModal}
                onFilterApply={actions.handleApplyFilter}
                activeGame={activeGame}
                userId={CURRENT_USER_ID}
             />
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-10">
        <PartyRequestBanner />
        {/* 수정된 recommendedData 전달 */}
        <RecommendedSection isProUser={isProUser} recommendations={recommendedData} />
        <PopularMatchList matches={popularMatches} />
        <FilteredMatchList matches={filteredMatches} searchText={searchText} />
      </main>

      <MatchingWriteModal 
        isOpen={isWriteModalOpen} 
        onClose={actions.closeWriteModal}
        onUpload={actions.handleNewPost}
        existingPosts={allMatches.filter(p => p.hostUser.id === 'me')} 
      />
    </div>
  );
};

export default MatchingPage;