// src/features/community/components/detail/comments/PostDetailCommentItem.tsx

import React from "react";
import { CornerDownRight } from "lucide-react";
import type { Comment } from "@/features/community/types";

type PostDetailCommentItemProps = {
  comment: Comment;
  currentUserName: string;
  replyingToId: string | null;
  replyText: string;
  onReplyChange: (value: string) => void;
  onReplyToggle: (commentId: string) => void;
  onReplySubmit: (commentId: string) => void;
  onReplyKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    commentId: string
  ) => void;
  replyInputRef: React.RefObject<HTMLTextAreaElement>;
  editingCommentId: string | null;
  editingReplyId: string | null;
  editingParentId: string | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onEditKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onEditCommentStart: (commentId: string, content: string) => void;
  onEditReplyStart: (commentId: string, replyId: string, content: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  editInputRef: React.RefObject<HTMLTextAreaElement>;
};

export function PostDetailCommentItem({
  comment,
  currentUserName,
  replyingToId,
  replyText,
  onReplyChange,
  onReplyToggle,
  onReplySubmit,
  onReplyKeyDown,
  replyInputRef,
  editingCommentId,
  editingReplyId,
  editingParentId,
  editText,
  onEditTextChange,
  onEditKeyDown,
  onEditCommentStart,
  onEditReplyStart,
  onEditCancel,
  onEditSubmit,
  onDeleteComment,
  onDeleteReply,
  editInputRef,
}: PostDetailCommentItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
              <span className="text-xs text-gray-500">{comment.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
              {comment.author === currentUserName ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEditCommentStart(comment.id, comment.content)}
                    className="hover:text-gray-600"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment.id)}
                    className="hover:text-gray-600"
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => alert("신고 기능 준비중")}
                  className="hover:text-gray-600"
                >
                  신고
                </button>
              )}
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3">
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={(event) => onEditTextChange(event.target.value)}
                onKeyDown={onEditKeyDown}
                rows={2}
                className="w-full resize-none text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onEditCancel}
                  className="rounded-full px-3 py-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onEditSubmit}
                  className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white hover:bg-gray-800"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <button className="hover:text-gray-700">좋아요</button>
            <button
              type="button"
              className="hover:text-gray-700"
              onClick={() => onReplyToggle(comment.id)}
            >
              답글달기
            </button>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="space-y-3 pl-6">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <CornerDownRight className="mt-2 h-4 w-4 text-gray-300" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">{reply.author}</span>
                  <span className="text-[10px] text-gray-500">{reply.date}</span>
                  <div className="ml-auto flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                    {reply.author === currentUserName ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditReplyStart(comment.id, reply.id, reply.content)}
                          className="hover:text-gray-600"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteReply(comment.id, reply.id)}
                          className="hover:text-gray-600"
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert("신고 기능 준비중")}
                        className="hover:text-gray-600"
                      >
                        신고
                      </button>
                    )}
                  </div>
                </div>
                {editingReplyId === reply.id && editingParentId === comment.id ? (
                  <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3">
                    <textarea
                      ref={editInputRef}
                      value={editText}
                      onChange={(event) => onEditTextChange(event.target.value)}
                      onKeyDown={onEditKeyDown}
                      rows={2}
                      className="w-full resize-none text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onEditCancel}
                        className="rounded-full px-3 py-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={onEditSubmit}
                        className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white hover:bg-gray-800"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-gray-700">{reply.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingToId === comment.id && (
        <div className="pl-6">
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="mb-2 text-xs font-semibold text-gray-700">{currentUserName}</div>
            <textarea
              ref={replyInputRef}
              value={replyText}
              onChange={(event) => onReplyChange(event.target.value)}
              onKeyDown={(event) => onReplyKeyDown(event, comment.id)}
              placeholder="답글을 입력해주세요."
              rows={2}
              className="w-full resize-none text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onReplySubmit(comment.id)}
                disabled={!replyText.trim()}
                className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800"
              >
                답글 작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
