import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/Button";
import { CommunityTabs, type CommunityTab } from "./components/CommunityTabs";
import { CommunitySearchBar } from "./components/CommunitySearchBar";
import { CommunityPostCard } from "@/features/community/components/CommunityPostCard";
import { CommunityPostList, type Post } from "./components/CommunityPostList";
import { BestPostsSection } from "./components/BestPostsSection";
import { Pagination } from "./components/Pagination";

// Mock 데이터 - 하이라이트용
const MOCK_HIGHLIGHT_POSTS = [
  {
    id: 1,
    author: "레나",
    date: "2시간 전",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
    ],
  },
  {
    id: 2,
    author: "레나",
    date: "4시간 전",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
    ],
  },
  {
    id: 3,
    author: "레나",
    date: "5시간 전",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800",
    ],
  },
  {
    id: 4,
    author: "레나",
    date: "오늘 오전",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [],
  },
  {
    id: 5,
    author: "레나",
    date: "어제",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    ],
  },
  {
    id: 6,
    author: "레나",
    date: "어제",
    title: "",
    content: "개웃긴 꿀잼 하이라이트 볼 사람",
    likes: 200,
    comments: 60,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    ],
  },
];

// Mock 데이터 - 자유게시판용
const MOCK_BOARD_POSTS: Post[] = [
  {
    id: 1,
    author: "레나",
    date: "10분 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200",
  },
  {
    id: 2,
    author: "레나",
    date: "10분 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200",
  },
  {
    id: 3,
    author: "레나",
    date: "1시간 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200",
  },
  {
    id: 4,
    author: "레나",
    date: "10시간 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
  {
    id: 5,
    author: "레나",
    date: "10시간 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
  {
    id: 6,
    author: "레나",
    date: "12시간 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
  {
    id: 7,
    author: "레나",
    date: "10분 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
  {
    id: 8,
    author: "레나",
    date: "10분 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
  {
    id: 9,
    author: "레나",
    date: "10분 전",
    title: "모두 좋아합니다~",
    content: "게시글 내용",
    likes: 123,
    views: 1230,
    comments: 1230,
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = React.useState<CommunityTab>("하이라이트");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPlace, setSelectedPlace] = React.useState("자유게시판");
  const [sortBy, setSortBy] = React.useState("베스트 / 추천");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const handleSearch = () => {
    console.log("검색:", searchQuery);
    // TODO: 검색 로직 구현
  };

  const handleWritePost = () => {
    console.log("글쓰기");
    // TODO: 글쓰기 페이지로 이동 또는 모달 열기
  };

  // 정렬 함수
  const getSortedPosts = (posts: Post[], sortType: string): Post[] => {
    const postsCopy = [...posts];
    
    switch (sortType) {
      case "베스트 / 추천":
        return postsCopy.sort((a, b) => b.likes - a.likes);
      case "최신순":
        // 날짜 문자열 기반 정렬 (실제로는 Date 객체 사용 권장)
        return postsCopy; // Mock 데이터는 이미 최신순
      case "조회순":
        return postsCopy.sort((a, b) => b.views - a.views);
      case "댓글순":
        return postsCopy.sort((a, b) => b.comments - a.comments);
      default:
        return postsCopy;
    }
  };

  // 정렬된 게시글
  const sortedPosts = getSortedPosts(MOCK_BOARD_POSTS, sortBy);
  
  // 베스트 게시글 (상위 3개)
  const bestPosts = sortedPosts.slice(0, 3);
  
  // 일반 게시글 (4번째부터)
  const regularPosts = sortedPosts.slice(3);

  // 자유게시판일 때 페이지네이션 적용
  const totalPages = Math.ceil(regularPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = regularPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Community</h1>
          <p className="mt-2 text-sm text-zinc-600">
            채팅방에서 재밌었던 순간을 공유하고, 다른 플레이어들과 소통해보세요!
          </p>
        </div>



        {/* 탭 */}
        <div className="mb-6">
          <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 검색바 */}
        <div className="mb-6">
          <CommunitySearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onWritePost={handleWritePost}
          />
        </div>

        {/* 자유게시판일 때 정렬 옵션 */}
        {activeTab === "자유게시판" && (
          <div className="mb-4 flex items-center justify-between">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option>베스트 / 추천</option>
              <option>최신순</option>
              <option>조회순</option>
              <option>댓글순</option>
            </select>
          </div>
        )}

        {/* 콘텐츠 영역 - 탭에 따라 다른 레이아웃 */}
        {activeTab === "하이라이트" ? (
          <>
            {/* 게시글 그리드 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_HIGHLIGHT_POSTS.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  author={post.author}
                  date={post.date}
                  title={post.title}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  images={post.images}
                />
              ))}
            </div>

            {/* 빈 상태 (게시글이 없을 때) */}
            {MOCK_HIGHLIGHT_POSTS.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
                  <EmptyIcon />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  게시글이 없습니다
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  첫 번째 글을 작성해보세요!
                </p>
                <Button
                  onClick={handleWritePost}
                  variant="primary"
                  className="mt-6"
                >
                  글쓰기
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 베스트 게시글 섹션 */}
            <BestPostsSection posts={bestPosts} />

            {/* 일반 게시글 리스트 */}
            <CommunityPostList posts={currentPosts} />

            {/* 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            {/* 페이지 표시 설정 */}
            <div className="flex items-center justify-start gap-2 py-4">
              <span className="text-sm text-zinc-600">페이지 표시</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </>
        )}
      </main>
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
