import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { usePartyComments } from '@/features/matching/hooks/usePartyComments';
import type { PartyComment } from '@/services/partyApi';

interface PartyCommentsProps {
  partyId: number;
  currentUserId?: number;
}

export const PartyComments = ({ partyId, currentUserId }: PartyCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const {
    comments,
    meta,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePartyComments(partyId);

  // 댓글 작성
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    createComment(
      {
        content: newComment.trim(),
        parentId: replyTo,
      },
      {
        onSuccess: () => {
          setNewComment('');
          setReplyTo(null);
        },
      }
    );
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment: PartyComment) => {
    setEditingId(comment.commentId);
    setEditContent(comment.content);
  };

  // 댓글 수정 제출
  const handleSubmitEdit = (commentId: number) => {
    if (!editContent.trim()) return;

    updateComment(
      {
        commentId,
        data: { content: editContent.trim() },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditContent('');
        },
      }
    );
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteComment(commentId);
    }
  };

  // 답글 작성 시작
  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
  };

  // 댓글 렌더링 (재귀적으로 답글 포함)
  const renderComment = (comment: PartyComment, depth: number = 0) => {
    const isEditing = editingId === comment.commentId;
    const isOwner = currentUserId === comment.userId;

    return (
      <div
        key={comment.commentId}
        className={`flex gap-3 ${depth > 0 ? 'ml-12 mt-3' : 'mt-4'}`}
      >
        {/* 아바타 */}
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
        
        <div className="flex-1">
          {/* 작성자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {comment.nickname}
              </span>
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
            </div>
            {isOwner && !isEditing && (
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 댓글 내용 또는 수정 폼 */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleSubmitEdit(comment.commentId)}
                  disabled={isUpdating}
                  className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
                >
                  {isUpdating ? '수정 중...' : '수정'}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditContent('');
                  }}
                  className="rounded-full bg-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
              
              {/* 액션 버튼 */}
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <button
                  onClick={() => handleReply(comment.commentId)}
                  className="hover:text-gray-700"
                >
                  답글
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="hover:text-gray-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      disabled={isDeleting}
                      className="hover:text-red-600"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* 답글 목록 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-gray-500">댓글을 불러오는 중...</div>;
  }

  return (
    <div className="border-t border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        댓글 {meta?.totalComments ?? 0}
      </h3>

      {/* 댓글 작성 폼 */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmitComment(); }} className="mb-6">
        {replyTo && (
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
            <span>답글 작성 중</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-red-600 hover:underline"
            >
              취소
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
          
          {/* 입력 필드 */}
          <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={isCreating || !newComment.trim()}
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              {isCreating ? '작성 중...' : '등록'}
            </button>
          </div>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div>
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            첫 번째 댓글을 작성해보세요!
          </p>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>

      {/* 페이지네이션 정보 */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-6 text-center text-xs text-gray-500">
          {meta.currentPage} / {meta.totalPages} 페이지
        </div>
      )}
    </div>
  );
};
