import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { CommunityTabs } from "@/features/community/components/CommunityTabs";
import { CommunitySearchBar } from "@/features/community/components/CommunitySearchBar";
import { HighlightFeed } from "@/features/community/components/HighlightFeed";
import { BestPostsSection } from "@/features/community/components/BestPostsSection";
import { CommunityPostList } from "@/features/community/components/CommunityPostList";
import { Pagination } from "@/features/community/components/Pagination";
import { HighlightDetailModal } from "@/features/community/components/HighlightDetailModal";
import { MOCK_COMMENTS } from "@/data/mockData";
import type { CommunityTab, HighlightPost, BoardPost } from "@/features/community/types/community.types";
import { getBoardPosts, getHighlights, getBestPosts } from "@/features/community/api/communityApi";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [boardPosts, setBoardPosts] = React.useState<BoardPost[]>([]);
  const [highlights, setHighlights] = React.useState<HighlightPost[]>([]);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // 모달 상태
  const [selectedPost, setSelectedPost] = React.useState<HighlightPost | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // URL이 단일 진실 공급원(Single Source of Truth)
  const currentTab = searchParams.get("tab");
  const activeTab: CommunityTab = currentTab === "자유게시판" ? "자유게시판" : "하이라이트";

  // 탭 변경 시 URL만 업데이트 (activeTab은 URL에서 파생됨)
  const handleTabChange = (tab: CommunityTab) => {
    setSearchParams({ tab });
    setCurrentPage(1); // 탭 변경 시 페이지 초기화
  };

  // 데이터 로딩
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "하이라이트") {
          const [highlightData, bestData] = await Promise.all([
            getHighlights(currentPage),
            getBestPosts()
          ]);
          setHighlights(highlightData);
          setBestPosts(bestData);
        } else {
          const [boardData, bestData] = await Promise.all([
            getBoardPosts(currentPage),
            getBestPosts()
          ]);
          setBoardPosts(boardData);
          setBestPosts(bestData);
        }
      } catch (error) {
        console.error('Failed to load community data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, currentPage]);

  const handleSearch = () => {
    console.log("검색:", searchQuery);
  };

  const handleWritePost = () => {
    console.log("글쓰기");
  };

  // 하이라이트 클릭 핸들러
  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // 자유게시판 클릭 핸들러 - 현재 탭 정보 포함
  const handleBoardClick = (post: BoardPost) => {
    navigate(`/community/${post.id}?from=자유게시판`);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(boardPosts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Community</h1>
        </div>

        <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="mt-6">
          <CommunitySearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onWritePost={handleWritePost}
          />
        </div>

        {loading ? (
          <div className="text-center py-10 text-zinc-500">로딩 중...</div>
        ) : (
          <>
            {activeTab === "하이라이트" ? (
              // 하이라이트 탭: 인스타 피드 카드
              <div className="mt-6">
                <HighlightFeed 
                  posts={highlights}
                  onPostClick={handleHighlightClick} 
                />
              </div>
            ) : (
              // 자유게시판 탭: 베스트 3개 + 일반 게시글
              <>
                <BestPostsSection 
                  posts={bestPosts}
                  onPostClick={handleBoardClick} 
                />
                <CommunityPostList 
                  posts={boardPosts}
                  onPostClick={handleBoardClick} 
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* 하이라이트 상세보기 모달 */}
      {selectedPost && (
        <HighlightDetailModal
          post={selectedPost}
          comments={MOCK_COMMENTS}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
