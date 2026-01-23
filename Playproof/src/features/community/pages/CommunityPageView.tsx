import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { CommunityTabs, CommunitySearchBar, HighlightFeed, BestPostsSection, CommunityPostList, Pagination, HighlightDetailModal } from '@/features/community/components';
import { MOCK_COMMENTS } from "@/features/community/data/mockCommunityData";
import type { CommunityTab, HighlightPost, BoardPost } from "@/features/community/types";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { getBoardPosts, getHighlights, getBestPosts } from "@/features/community/api/communityApi";

export const CommunityPageView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [boardPosts, setBoardPosts] = React.useState<BoardPost[]>([]);
  const [highlights, setHighlights] = React.useState<HighlightPost[]>([]);
  const [bestPosts, setBestPosts] = React.useState<BoardPost[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const [selectedPost, setSelectedPost] = React.useState<HighlightPost | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const currentTab = searchParams.get("tab");
  const activeTab: CommunityTab =
    currentTab === COMMUNITY_PAGE_LABELS.freeTab
      ? COMMUNITY_PAGE_LABELS.freeTab
      : COMMUNITY_PAGE_LABELS.highlightTab;

  const handleTabChange = (tab: CommunityTab) => {
    setSearchParams({ tab });
    setCurrentPage(1);
  };

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "하이라이트") {
          const [highlightData, bestData] = await Promise.all([
            getHighlights(currentPage),
            getBestPosts(),
          ]);
          setHighlights(highlightData);
          setBestPosts(bestData);
        } else {
          const [boardData, bestData] = await Promise.all([
            getBoardPosts(currentPage),
            getBestPosts(),
          ]);
          setBoardPosts(boardData);
          setBestPosts(bestData);
        }
      } catch (error) {
        console.error("Failed to load community data:", error);
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

  const handleHighlightClick = (post: HighlightPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleBoardClick = (post: BoardPost) => {
    navigate(`/community/${post.id}?from=자유게시판`);
  };

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
        <h1 className="text-3xl font-bold text-zinc-900">
          {COMMUNITY_PAGE_LABELS.title}
        </h1>
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
              <div className="mt-6">
                <HighlightFeed posts={highlights} onPostClick={handleHighlightClick} />
              </div>
            ) : (
              <>
                <BestPostsSection posts={bestPosts} onPostClick={handleBoardClick} />
                <CommunityPostList posts={boardPosts} onPostClick={handleBoardClick} />
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
};
