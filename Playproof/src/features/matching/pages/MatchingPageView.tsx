// src/features/matching/pages/MatchingPageView.tsx
import React, { useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { MatchingSearchBar, GameFilter, RecommendedSection, PartyRequestBanner, MatchingWriteModal } from '@/features/matching/components';
import { PopularMatchList } from '@/features/matching/components/home/PopularMatchList';
import { FilteredMatchList } from '@/features/matching/components/home/FilteredMatchList';
import { useMatchingBoard } from '@/features/matching/hooks/useMatchingBoard';
import { GAME_LIST } from '@/features/matching/constants/matchingConfig';

const CURRENT_USER_ID = 'user-1';

export const MatchingPageView = () => {
  const { state, setters, actions } = useMatchingBoard();
  const {
    allMatches,
    activeGame,
    searchText,
    isWriteModalOpen,
    isFilterModalOpen,
    isProUser,
    matchesByGame,
    popularMatches,
    filteredMatches,
  } = state;

  // 수정됨: 4개 이상일 때 스크롤을 확인하기 위해 3개 제한을 10개로 늘림
  const recommendedData = useMemo(() => {
    return matchesByGame.slice(0, 10); 
  }, [matchesByGame]);

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      <Navbar isProUser={isProUser} onTogglePro={() => setters.setIsProUser(!isProUser)} />

      <div className="bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col gap-5">
          <div className="w-full">
            <GameFilter games={GAME_LIST} activeGame={activeGame} onGameSelect={setters.setActiveGame} />
          </div>
          <div className="w-full border-t border-gray-50 pt-5">
            <MatchingSearchBar
              key={`${activeGame}-${CURRENT_USER_ID}`}
              searchText={searchText}
              onSearchChange={setters.setSearchText}
              onSearchSubmit={setters.setSearchText}
              onWriteClick={actions.openWriteModal}
              isFilterOpen={isFilterModalOpen}
              onFilterToggle={() => (isFilterModalOpen ? actions.closeFilterModal() : actions.openFilterModal())}
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
        {/* 추천 섹션 */}
        <RecommendedSection isProUser={isProUser} recommendations={recommendedData} />
        <PopularMatchList matches={popularMatches} />
        <FilteredMatchList matches={filteredMatches} searchText={searchText} />
      </main>

      <MatchingWriteModal
        isOpen={isWriteModalOpen}
        onClose={actions.closeWriteModal}
        onUpload={actions.handleNewPost}
        existingPosts={allMatches.filter((p) => p.hostUser.id === 'me')}
      />
    </div>
  );
};