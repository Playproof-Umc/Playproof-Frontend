import { useState } from 'react';
import { MoreVertical, Loader2 } from 'lucide-react';
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
    return (
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-gray-900">댓글</h3>
          <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* 스켈레톤 UI */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-900">댓글</h3>
        <span className="text-sm font-bold text-gray-500">{meta?.totalComments ?? 0}</span>
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmitComment(); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
          <span className="text-xs font-bold text-gray-900">나</span>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력해주세요.'}
          className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isCreating || !newComment.trim()}
            className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                작성 중...
              </>
            ) : (
              '작성하기'
            )}
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {isCreating && comments.length === 0 && (
          <div className="flex gap-3 opacity-50 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          </div>
        )}
        
        {comments.length === 0 && !isCreating ? (
          <p className="text-center py-8 text-sm text-gray-400">
            첫 번째 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>

      {/* 페이지네이션 정보 */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 text-center text-xs text-gray-500">
          {meta.currentPage} / {meta.totalPages} 페이지
        </div>
      )}
    </div>
  );
};
