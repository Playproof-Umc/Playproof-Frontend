// src/features/matching/components/detail/MatchingComments.tsx
import React, { useRef } from 'react';
import { User, CornerDownRight } from 'lucide-react';

// 댓글 타입 정의
export interface Reply {
  id: number;
  user: string;
  userId: string;
  text: string;
  time: string;
  parentId: number;
}

export interface Comment {
  id: number;
  user: string;
  userId: string;
  text: string;
  time: string;
  replies: Reply[];
}

interface MatchingCommentsProps {
  comments: Comment[];
  totalCount?: number;
  currentUserId: string;
  currentUserName: string;
  commentText: string;
  replyText: string;
  replyingToId: number | null;
  editingCommentId: number | null;
  editingReplyId: number | null;
  editingParentId: number | null;
  editText: string;
  onCommentChange: (text: string) => void;
  onCommentSubmit: () => void;
  onReplyChange: (text: string) => void;
  onReplyToggle: (commentId: number) => void;
  onReplySubmit: (commentId: number) => void;
  onEditTextChange: (text: string) => void;
  onEditCommentStart: (commentId: number, text: string) => void;
  onEditReplyStart: (commentId: number, replyId: number, text: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: number) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
  onMoveToProfile: (userId: string) => void;
}

export const MatchingComments = ({
  comments,
  totalCount,
  currentUserId,
  currentUserName,
  commentText,
  replyText,
  replyingToId,
  editingCommentId,
  editingReplyId,
  editingParentId,
  editText,
  onCommentChange,
  onCommentSubmit,
  onReplyChange,
  onReplyToggle,
  onReplySubmit,
  onEditTextChange,
  onEditCommentStart,
  onEditReplyStart,
  onEditCancel,
  onEditSubmit,
  onDeleteComment,
  onDeleteReply,
  onMoveToProfile,
}: MatchingCommentsProps) => {
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const focusCommentInput = () => {
    requestAnimationFrame(() => {
      commentInputRef.current?.focus();
    });
  };

  const handleCommentSubmit = () => {
    onCommentSubmit();
    focusCommentInput();
  };

  const handleReplySubmit = (commentId: number) => {
    onReplySubmit(commentId);
    focusCommentInput();
  };

  const handleCommentKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleReplyKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, commentId: number) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit(commentId);
    }
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onEditSubmit();
    }
  };

  return (
    <div className="w-[40%] bg-gray-50 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-900">댓글</h3>
        <span className="text-sm font-bold text-gray-500">{totalCount ?? comments.length}</span>
      </div>
      
      {/* Input Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={16} /></div>
          <span className="text-xs font-bold text-gray-900">{currentUserName}</span>
        </div>
        <textarea
          ref={commentInputRef}
          value={commentText} 
          onChange={(e) => onCommentChange(e.target.value)}
          onKeyDown={handleCommentKeyDown}
          placeholder="댓글을 입력해주세요." 
          className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"
        />
        <div className="flex justify-end mt-2">
          <button onClick={handleCommentSubmit} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">작성하기</button>
        </div>
      </div>
      
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div onClick={() => onMoveToProfile(comment.userId)} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"><User size={12} /></div>
                  <span onClick={() => onMoveToProfile(comment.userId)} className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">{comment.user}</span>
                  <span className="text-[10px] text-gray-400">{comment.time}</span>
                  <div className="ml-auto flex items-center gap-2">
                    {comment.userId === currentUserId ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditCommentStart(comment.id, comment.text)}
                          className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteComment(comment.id)}
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
                {editingCommentId === comment.id ? (
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <textarea
                      value={editText}
                      onChange={(event) => onEditTextChange(event.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={onEditCancel}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-700"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={onEditSubmit}
                        className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-colors"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">{comment.text}</p>
                )}
                <button
                  type="button"
                  onClick={() => onReplyToggle(comment.id)}
                  className="block mt-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 ml-1"
                >
                  답글달기
                </button>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="space-y-3 pl-8">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div onClick={() => onMoveToProfile(reply.userId)} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"><User size={12} /></div>
                        <span onClick={() => onMoveToProfile(reply.userId)} className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">{reply.user}</span>
                        <span className="text-[10px] text-gray-400">{reply.time}</span>
                        <div className="ml-auto flex items-center gap-2">
                          {reply.userId === currentUserId ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onEditReplyStart(comment.id, reply.id, reply.text)}
                                className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                              >
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteReply(comment.id, reply.id)}
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
                      {editingReplyId === reply.id && editingParentId === comment.id ? (
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                          <textarea
                            value={editText}
                            onChange={(event) => onEditTextChange(event.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={onEditCancel}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-700"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={onEditSubmit}
                              className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-colors"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">{reply.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {replyingToId === comment.id && (
              <div className="pl-8">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <textarea
                    ref={replyInputRef}
                    value={replyText}
                    onChange={(e) => onReplyChange(e.target.value)}
                    onKeyDown={(event) => handleReplyKeyDown(event, comment.id)}
                    placeholder="답글을 입력해주세요."
                    className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[50px]"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => handleReplySubmit(comment.id)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                    >
                      답글 작성
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
