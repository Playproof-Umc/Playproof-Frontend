import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { CommunityTabs } from "@/pages/Community/components/CommunityTabs";
import { CommunitySearchBar } from "@/pages/Community/components/CommunitySearchBar";
import { HighlightFeed } from "@/pages/Community/components/HighlightFeed";
import { BestPostsSection } from "@/pages/Community/components/BestPostsSection";
import { CommunityPostList } from "@/pages/Community/components/CommunityPostList";
import { Pagination } from "@/pages/Community/components/Pagination";
import { HighlightDetailModal } from "@/pages/Community/components/HighlightDetailModal";
import {
  MOCK_HIGHLIGHT_POSTS,
  MOCK_BOARD_POSTS,
  MOCK_COMMENTS,
  type HighlightPost,
  type BoardPost,
} from "@/data/mockData";

type CommunityTab = "하이라이트" | "자유게시판";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 탭 정보 가져오기 (기본값: 하이라이트)
  const tabFromUrl = searchParams.get("tab") as CommunityTab | null;
  const [activeTab, setActiveTab] = React.useState<CommunityTab>(
    tabFromUrl === "자유게시판" ? "자유게시판" : "하이라이트"
  );
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // 모달 상태
  const [selectedPost, setSelectedPost] = React.useState<HighlightPost | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // 탭 변경 시 URL도 업데이트
  const handleTabChange = (tab: CommunityTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

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
  const totalPages = Math.ceil(MOCK_BOARD_POSTS.length / itemsPerPage);

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

        {activeTab === "하이라이트" ? (
          // 하이라이트 탭: 인스타 피드 카드
          <div className="mt-6">
            <HighlightFeed 
              posts={MOCK_HIGHLIGHT_POSTS}
              onPostClick={handleHighlightClick} 
            />
          </div>
        ) : (
          // 자유게시판 탭: 베스트 3개 + 일반 게시글
          <>
            <BestPostsSection 
              posts={MOCK_BOARD_POSTS}
              onPostClick={handleBoardClick} 
            />
            <CommunityPostList 
              posts={MOCK_BOARD_POSTS}
              onPostClick={handleBoardClick} 
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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

function EmptyIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      className="text-zinc-400"
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
