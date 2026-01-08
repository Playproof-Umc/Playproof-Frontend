import React, { useState, useMemo } from 'react';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { MatchingCard } from '@/features/matching/components/MatchingCard';
import type { MatchingData } from '@/features/matching/types/types';

import { MatchingSearchBar } from '@/features/matching/components/MatchingSearchBar';
import { GameFilter } from '@/features/matching/components/GameFilter';
import { RecommendedSection } from '@/features/matching/components/RecommendedSection';
import { PartyRequestBanner } from '@/features/matching/components/PartyRequestBanner';
import { MatchingWriteModal } from '@/features/matching/components/MatchingWriteModal';

const GAMES = ['리그오브레전드', '발로란트', '오버워치', '배틀그라운드', 'Steam', '기타'];

const MatchingPage = () => {
  // 전체 데이터 저장소
  const [allMatches, setAllMatches] = useState<MatchingData[]>([]);
  
  // 상태 관리
  const [activeGame, setActiveGame] = useState('리그오브레전드');
  const [isProUser, setIsProUser] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // 현재 로그인한 유저 ID (테스트용)
  const currentUserId = 'user-1';

  // --- Handlers ---
  const handleSearchChange = (text: string) => setSearchText(text);
  const handleSearchSubmit = (text: string) => setSearchText(text);

  const handleOpenWriteModal = () => {
    setIsWriteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseWriteModal = () => {
    setIsWriteModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  // [글쓰기 로직] 새 글 등록, 교체, 끌어올리기 처리
  const handleNewPost = (newPost: MatchingData, action: 'new' | 'replace' | 'bump') => {
    setAllMatches((prev) => {
      // 1. 해당 게임의 내 기존 글 찾기
      const myPostsForGame = prev.filter(p => p.game === newPost.game && p.hostUser.id === 'me');

      if (myPostsForGame.length > 0) {
        // 가장 최신 글 찾기
        const latestPost = myPostsForGame.sort((a, b) => b.id - a.id)[0];

        if (action === 'bump') {
           // 끌어올리기: 기존 내용 유지 + 시간/ID 갱신
           const bumpedPost = { ...latestPost, id: Date.now(), time: '방금 전' };
           const others = prev.filter(p => p.id !== latestPost.id);
           return [bumpedPost, ...others];
        } else if (action === 'replace') {
           // 교체하기: 기존 글 삭제 + 새 글 추가
           const others = prev.filter(p => p.game !== newPost.game || p.hostUser.id !== 'me');
           return [newPost, ...others];
        }
        // new
        return [newPost, ...prev];
      }
      // 중복 없음
      return [newPost, ...prev];
    });
  };

  // ─────────────────────────────────────────────────────────────
  // [데이터 필터링 로직]
  // ─────────────────────────────────────────────────────────────
  
  // 1. 현재 탭(activeGame)에 해당하는 글만 1차 필터링
  const matchesByGame = useMemo(() => {
    return allMatches.filter(item => item.game === activeGame);
  }, [allMatches, activeGame]);

  // 2. [인기 매칭] - 현재 게임 내 인기순 (여기선 단순히 slice)
  const popularMatches = useMemo(() => {
    return [...matchesByGame].slice(0, 10);
  }, [matchesByGame]);

  // 3. [전체 매칭] - 검색어 필터링 (2글자 이상일 때만 동작)
  const filteredMatches = useMemo(() => {
    let result = [...matchesByGame];

    if (searchText.length >= 2) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    // 최신순 정렬
    return result.sort((a, b) => b.id - a.id);
  }, [matchesByGame, searchText]);


  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      
      {/* 1. 헤더 */}
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
            <button onClick={() => setIsProUser(!isProUser)} className={`text-xs border px-3 py-1 rounded-full font-bold transition-colors ${isProUser ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{isProUser ? 'Pro ON' : 'Pro OFF'}</button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
               <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
               <span className="font-medium">플레이프루프12...</span>
            </div>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
            <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition-colors" />
           </div>
        </div>
      </header>

      {/* 2. 컨트롤 섹션 (게임필터 + 검색창) */}
      <div className="bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col gap-5">
          <div className="w-full">
             <GameFilter games={GAMES} activeGame={activeGame} onGameSelect={setActiveGame} />
          </div>
          <div className="w-full border-t border-gray-50 pt-5">
             <MatchingSearchBar 
                searchText={searchText} 
                onSearchChange={handleSearchChange} 
                onSearchSubmit={handleSearchSubmit}
                onWriteClick={handleOpenWriteModal}
                activeGame={activeGame}
                userId={currentUserId}
             />
          </div>
        </div>
      </div>

      {/* 3. 메인 컨텐츠 */}
      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-10">
        
        {/* 신청 현황 배너 */}
        <PartyRequestBanner />

        {/* 추천 유저 섹션 (현재 탭 데이터 기준) */}
        <RecommendedSection 
            isProUser={isProUser} 
            recommendations={matchesByGame.slice(0, 3)} 
        />

        {/* 인기 매칭 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">인기 매칭</h2>
            <RefreshCw size={16} className="text-gray-400 cursor-pointer"/>
          </div>
          {popularMatches.length === 0 ? (
            <div className="w-full h-32 bg-gray-50 rounded-xl border border-gray-100 border-dashed flex items-center justify-center text-gray-400 text-sm">
                <p>현재 인기 매칭이 없습니다.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x no-scrollbar">
              {popularMatches.map((item) => (
                <div key={`pop-${item.id}`} className="min-w-[280px] w-[280px] snap-start">
                    <MatchingCard data={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 전체 매칭 섹션 (검색 결과 포함) */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-bold text-lg text-gray-900">
               {searchText.length >= 2 
                 ? `'${searchText}' 검색 결과 (${filteredMatches.length})`
                 : `전체 매칭 (${filteredMatches.length})`
               }
             </h2>
             <RefreshCw size={16} className="text-gray-400 cursor-pointer"/>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-xl text-gray-400 border border-gray-100 border-dashed flex flex-col items-center justify-center gap-3">
                <p className="text-xl font-bold text-gray-300">
                  {searchText.length >= 2 ? '검색 결과가 없습니다.' : '작성된 글이 없습니다.'}
                </p>
                {searchText.length < 2 && <p className="text-sm">우측 상단 '글쓰기' 버튼을 눌러 첫 매칭을 시작해보세요!</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 px-4 md:px-14 lg:px-28 justify-items-center">
                {filteredMatches.map((item) => (
                    <div key={`all-${item.id}`} className="w-full max-w-[280px]">
                        <MatchingCard data={item} />
                    </div>
                ))}
            </div>
          )}
        </section>
      </main>

      {/* 글쓰기 모달 */}
      <MatchingWriteModal 
        isOpen={isWriteModalOpen} 
        onClose={handleCloseWriteModal}
        onUpload={handleNewPost}
        existingPosts={allMatches.filter(p => p.hostUser.id === 'me')} 
      />
    </div>
  );
};

export default MatchingPage;