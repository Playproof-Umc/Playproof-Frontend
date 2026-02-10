import { useState, useRef } from 'react';
import { User, CornerDownRight, Loader2, X } from 'lucide-react';
import { usePartyComments } from '@/features/matching/hooks/usePartyComments';

interface PartyCommentsProps {
  partyId: number;
  currentUserId?: number;
  currentUserName?: string;
}

export const PartyComments = ({ partyId, currentUserId, currentUserName = '나' }: PartyCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingParentId, setEditingParentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

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
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const content = newComment.trim();
    setNewComment(''); // 즉시 초기화

    createComment({
      content,
      parentId: null,
    });
  };

  // 답글 작성
  const handleReplySubmit = (parentId: number) => {
    if (!replyContent.trim()) return;

    const content = replyContent.trim();
    setReplyContent(''); // 즉시 초기화
    setReplyTo(null); // 답글 폼 닫기

    createComment({
      content,
      parentId,
    });
  };

  // 댓글 수정 시작
  const handleEditCommentStart = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditContent(content);
  };

  // 답글 수정 시작
  const handleEditReplyStart = (parentId: number, replyId: number, content: string) => {
    setEditingCommentId(null);
    setEditingReplyId(replyId);
    setEditingParentId(parentId);
    setEditContent(content);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditContent('');
  };

  // 수정 제출
  const handleEditSubmit = () => {
    if (!editContent.trim()) return;

    const commentId = editingCommentId || editingReplyId;
    if (!commentId) return;

    updateComment(
      {
        commentId,
        data: { content: editContent.trim() },
      },
      {
        onSuccess: () => {
          handleEditCancel();
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

  // 답글 삭제
  const handleDeleteReply = (replyId: number) => {
    if (window.confirm('답글을 삭제하시겠습니까?')) {
      deleteComment(replyId);
    }
  };

  // 키보드 이벤트 핸들러
  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, parentId: number) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit(parentId);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
  };


  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-gray-900">댓글</h3>
          <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-16 w-full bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-900">댓글</h3>
        <span className="text-sm font-bold text-gray-500">{meta?.totalComments ?? 0}</span>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <User size={16} />
          </div>
          <span className="text-xs font-bold text-gray-900">{currentUserName}</span>
        </div>
        <textarea
          ref={commentInputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleCommentKeyDown}
          placeholder="댓글을 입력해주세요."
          className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"
        />
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleCommentSubmit}
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
      </div>

      {/* 댓글 목록 */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {comments.length === 0 && !isCreating ? (
          <p className="text-center py-8 text-sm text-gray-400">
            첫 번째 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors">
                      <User size={12} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">
                      {comment.nickname}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      {comment.userId === currentUserId ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditCommentStart(comment.commentId, comment.content)}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.commentId)}
                            disabled={isDeleting}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alert('신고 기능 준비중')}
                          className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                        >
                          신고
                        </button>
                      )}
                    </div>
                  </div>
                  {editingCommentId === comment.commentId ? (
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-700"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleEditSubmit}
                          disabled={isUpdating}
                          className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300"
                        >
                          {isUpdating ? '수정 중...' : '저장'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">
                      {comment.content}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setReplyTo(comment.commentId)}
                    className="block mt-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 ml-1"
                  >
                    답글달기
                  </button>
                </div>
              </div>

              {/* 답글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-3 pl-8">
                  {comment.replies.map((reply) => (
                    <div key={reply.commentId} className="flex gap-3">
                      <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors">
                            <User size={12} />
                          </div>
                          <span className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">
                            {reply.nickname}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                          <div className="ml-auto flex items-center gap-2">
                            {reply.userId === currentUserId ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditReplyStart(comment.commentId, reply.commentId, reply.content)}
                                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReply(reply.commentId)}
                                  disabled={isDeleting}
                                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                                >
                                  삭제
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => alert('신고 기능 준비중')}
                                className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                              >
                                신고
                              </button>
                            )}
                          </div>
                        </div>
                        {editingReplyId === reply.commentId && editingParentId === comment.commentId ? (
                          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={handleEditCancel}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-700"
                              >
                                취소
                              </button>
                              <button
                                type="button"
                                onClick={handleEditSubmit}
                                disabled={isUpdating}
                                className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300"
                              >
                                {isUpdating ? '수정 중...' : '저장'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">
                            {reply.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 답글 작성 폼 */}
              {replyTo === comment.commentId && (
                <div className="pl-8">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-500">{comment.nickname}님에게 답글 작성 중</span>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(null);
                          setReplyContent('');
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <textarea
                      ref={replyInputRef}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => handleReplyKeyDown(e, comment.commentId)}
                      placeholder="답글을 입력해주세요."
                      className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(comment.commentId)}
                        disabled={isCreating}
                        className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300"
                      >
                        {isCreating ? '작성 중...' : '답글 작성'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
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
