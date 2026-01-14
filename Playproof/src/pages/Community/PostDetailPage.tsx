import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, MoreVertical, Heart, Eye, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { MOCK_BOARD_POSTS, MOCK_COMMENTS } from "@/data/mockData";

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const [newComment, setNewComment] = React.useState("");

  // URL에서 어느 탭에서 왔는지 확인
  const fromTab = searchParams.get("from") || "하이라이트";

  // Mock 데이터에서 해당 게시글 찾기
  const post = MOCK_BOARD_POSTS.find((p) => p.id === Number(postId));

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleBack = () => {
    // 이전 탭으로 돌아가기
    navigate(`/community?tab=${fromTab}`);
  };

  const handleShare = () => {
    console.log("공유하기");
    // TODO: 공유 기능 구현
  };

  const handleReport = () => {
    console.log("신고하기");
    // TODO: 신고 기능 구현
  };

  const handleMore = () => {
    console.log("더보기");
    // TODO: 수정/삭제 기능
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("댓글 작성:", newComment);
    setNewComment("");
    // TODO: 댓글 작성 API
  };

  const handleLike = () => {
    console.log("좋아요");
    // TODO: 좋아요 API
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        {/* 뒤로가기 */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{fromTab}</span>
        </button>

        {/* 게시글 카드 */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          {/* 헤더 */}
          <div className="border-b border-gray-200 p-6">
            <div className="mb-4 flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleReport}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  title="신고하기"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C10 9.45 10.196 8.97933 10.588 8.588C10.98 8.19667 11.4507 8.00067 12 8C12.2833 8 12.521 7.904 12.713 7.712C12.905 7.52 13.0007 7.28267 13 7C12.9993 6.71733 12.9033 6.48 12.712 6.288C12.5207 6.096 12.2833 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V12C8 12.2833 8.096 12.521 8.288 12.713C8.48 12.905 8.71733 13.0007 9 13C9.28267 12.9993 9.52033 12.9033 9.713 12.712C9.90567 12.5207 10.0013 12.2833 10 12V10ZM4 21C3.45 21 2.97933 20.8043 2.588 20.413C2.19667 20.0217 2.00067 19.5507 2 19V17C2 16.45 2.196 15.9793 2.588 15.588C2.98 15.1967 3.45067 15.0007 4 15H5V10C5 8.05 5.67933 6.396 7.038 5.038C8.39667 3.68 10.0507 3.00067 12 3C13.9493 2.99933 15.6037 3.67867 16.963 5.038C18.3223 6.39733 19.0013 8.05133 19 10V15H20C20.55 15 21.021 15.196 21.413 15.588C21.805 15.98 22.0007 16.4507 22 17V19C22 19.55 21.8043 20.021 21.413 20.413C21.0217 20.805 20.5507 21.0007 20 21H4Z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  onClick={handleMore}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 작성자 정보 및 통계 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-300" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </span>
              </div>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">
                안녕하세요! 오늘은 눈이 와요.
                ~~~~~~~~~~~~~~~~
                혹시 듀오 구하시는 분 있으면 댓글 남겨주세요~! 같이 플레이 ㄱㄱ
              </p>

              {/* 이미지/영상 영역 */}
              {post.thumbnail && (
                <div className="mt-6 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 좋아요 버튼 */}
          <div className="border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleLike}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
          </div>

          {/* 댓글 섹션 */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              댓글 {MOCK_COMMENTS.length}
            </h3>

            {/* 댓글 작성 */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
                <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력해주세요..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    작성하기
                  </button>
                </div>
              </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {MOCK_COMMENTS.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.content}</p>

                    {/* 댓글 액션 */}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <button className="hover:text-gray-700">좋아요</button>
                      {comment.replies > 0 && (
                        <button className="hover:text-gray-700">
                          답글 {comment.replies}개
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}