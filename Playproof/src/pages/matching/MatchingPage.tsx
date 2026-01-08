import React from 'react';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/MatchingCard';
import { MatchingSearchBar } from '@/features/matching/components/MatchingSearchBar';
import { GameFilter } from '@/features/matching/components/GameFilter';
import { RecommendedSection } from '@/features/matching/components/RecommendedSection';
import { PartyRequestBanner } from '@/features/matching/components/PartyRequestBanner';
import { MatchingWriteModal } from '@/features/matching/components/MatchingWriteModal';
import { useMatchingBoard } from '@/features/matching/hooks/useMatchingBoard'; 

const GAMES = ['리그오브레전드', '발로란트', '오버워치', '배틀그라운드', 'Steam', '기타'];

const MatchingPage = () => {
  const { state, setters, actions } = useMatchingBoard();
  const { allMatches, activeGame, searchText, isWriteModalOpen, isProUser, matchesByGame, popularMatches, filteredMatches } = state;

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>PLAYPROOF</h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
              <button className="text-black font-bold border-b-2 border-black h-16 px-1">매칭하기</button>
              <button className="h-16 px-1 hover:text-black transition-colors">커뮤니티</button>
              <button className="h-16 px-1 hover:text-black transition-colors">아지트</button>
              <button className="h-16 px-1 hover:text-black transition-colors">상점</button>
            </nav>
           </div>
           <div className="flex items-center gap-4">
            <button onClick={() => setters.setIsProUser(!isProUser)} className={`text-xs border px-3 py-1 rounded-full font-bold transition-colors ${isProUser ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{isProUser ? 'Pro ON' : 'Pro OFF'}</button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
               <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
               <span className="font-medium">플레이프루프12...</span>
            </div>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
            <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
           </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col gap-5">
          <div className="w-full">
             <GameFilter games={GAMES} activeGame={activeGame} onGameSelect={setters.setActiveGame} />
          </div>
          <div className="w-full border-t border-gray-50 pt-5">
             <MatchingSearchBar 
                searchText={searchText} 
                onSearchChange={setters.setSearchText} 
                onSearchSubmit={setters.setSearchText}
                onWriteClick={actions.openWriteModal}
                activeGame={activeGame}
                userId={'user-1'}
             />
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-10">
        <PartyRequestBanner />
        <RecommendedSection isProUser={isProUser} recommendations={matchesByGame.slice(0, 3)} />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">인기 매칭</h2>
            <RefreshCw size={16} className="text-gray-400 cursor-pointer"/>
          </div>
          {popularMatches.length === 0 ? (
            <div className="w-full h-32 bg-gray-50 rounded-xl border border-gray-100 border-dashed flex items-center justify-center text-gray-400 text-sm"><p>현재 인기 매칭이 없습니다.</p></div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x no-scrollbar">
              {popularMatches.map((item) => (
                <div key={`pop-${item.id}`} className="min-w-[280px] w-[280px] snap-start"><MatchingCard data={item} /></div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-bold text-lg text-gray-900">{searchText.length >= 2 ? `'${searchText}' 검색 결과 (${filteredMatches.length})` : `전체 매칭 (${filteredMatches.length})`}</h2>
             <RefreshCw size={16} className="text-gray-400 cursor-pointer"/>
          </div>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-xl text-gray-400 border border-gray-100 border-dashed flex flex-col items-center justify-center gap-3">
                <p className="text-xl font-bold text-gray-300">{searchText.length >= 2 ? '검색 결과가 없습니다.' : '작성된 글이 없습니다.'}</p>
                {searchText.length < 2 && <p className="text-sm">우측 상단 '글쓰기' 버튼을 눌러 첫 매칭을 시작해보세요!</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 px-4 md:px-14 lg:px-28 justify-items-center">
                {filteredMatches.map((item) => (<div key={`all-${item.id}`} className="w-full max-w-[280px]"><MatchingCard data={item} /></div>))}
            </div>
          )}
        </section>
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