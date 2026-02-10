// src/features/community/components/highlight-detail/HighlightCommentItem.tsx

// 날짜를 '10분전', '1일전' 등으로 변환하는 함수
function formatRelativeTime(dateString: string): string {
  if (!dateString || isNaN(Date.parse(dateString))) return '';
  const date = new Date(dateString);
  const now = new Date();
  const rawDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diff = Math.max(0, rawDiff);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}
import React from "react";
import { CornerDownRight } from "lucide-react";

import type { CommunityComment } from "@/features/community/types/types";

export interface HighlightCommentItemProps {
  comment: CommunityComment;
  currentUserName: string;
  replyingToId: number | null;
  replyText: string;
  onReplyTextChange: (value: string) => void;
  onReplyKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>, commentId: number) => void;
  onReplySubmit: (commentId: number) => void;
  onReplyToggle: (commentId: number) => void;
  replyInputRef: React.RefObject<HTMLTextAreaElement>;
  editingCommentId: number | null;
  editingReplyId: number | null;
  editingParentId: number | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onEditKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onEditStart: (commentId: number, content: string) => void;
  onReplyEditStart: (commentId: number, replyId: number, content: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: number) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
  editInputRef: React.RefObject<HTMLTextAreaElement>;
  onMoveToProfile: (event: React.MouseEvent, userId: string) => void;
  profileUserId: string;
}

export function HighlightCommentItem({
  comment,
  currentUserName,
  replyingToId,
  replyText,
  onReplyTextChange,
  onReplyKeyDown,
  onReplySubmit,
  onReplyToggle,
  replyInputRef,
  editingCommentId,
  editingReplyId,
  editingParentId,
  editText,
  onEditTextChange,
  onEditKeyDown,
  onEditStart,
  onReplyEditStart,
  onEditCancel,
  onEditSubmit,
  onDeleteComment,
  onDeleteReply,
  editInputRef,
  onMoveToProfile,
  profileUserId,
}: HighlightCommentItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div
          onClick={(event) => onMoveToProfile(event, profileUserId)}
          className="h-8 w-8 flex-shrink-0 cursor-pointer rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              onClick={(event) => onMoveToProfile(event, profileUserId)}
              className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline"
            >
              {comment.user && comment.user.nickname ? comment.user.nickname : '알 수 없음'}
            </span>
            <span className="text-xs text-gray-500">
              {comment.createdAt ? formatRelativeTime(comment.createdAt) : ''}
            </span>
            <div className="ml-auto flex items-center gap-2 text-[10px] font-semibold text-gray-400">
              {comment.user?.nickname === currentUserName ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEditStart(Number(comment.id), comment.content)}
                    className="hover:text-gray-600"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteComment(Number(comment.id))}
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
                  className="rounded-full bg-[var(--color-primary-800)] px-3 py-1 text-[10px] font-semibold text-white hover:bg-[var(--color-primary-700)]"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <button
              type="button"
              className="hover:text-gray-700"
              onClick={() => onReplyToggle(Number(comment.id))}
            >
              답글달기
            </button>
          </div>
        </div>
      </div>

      {(comment.replies?.length ?? 0) > 0 && (
        <div className="space-y-3 pl-6">
          {(comment.replies ?? []).map((reply, index) => (
            <div key={reply.id ?? `reply-${comment.id}-${index}`} className="flex gap-3">
              <CornerDownRight className="mt-2 h-4 w-4 text-gray-300" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    onClick={(event) => onMoveToProfile(event, profileUserId)}
                    className="cursor-pointer text-xs font-semibold text-gray-900 hover:underline"
                  >
                    {reply.user && reply.user.nickname ? reply.user.nickname : '알 수 없음'}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {reply.createdAt ? formatRelativeTime(reply.createdAt) : ''}
                  </span>
                  <div className="ml-auto flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                    {reply.user?.nickname === currentUserName ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onReplyEditStart(Number(comment.id), Number(reply.id), reply.content)}
                          className="hover:text-gray-600"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteReply(Number(comment.id), Number(reply.id))}
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
                        className="rounded-full bg-[var(--color-primary-800)] px-3 py-1 text-[10px] font-semibold text-white hover:bg-[var(--color-primary-700)]"
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
              onChange={(event) => onReplyTextChange(event.target.value)}
              onKeyDown={(event) => onReplyKeyDown(event, Number(comment.id))}
              placeholder="답글을 입력해주세요."
              rows={2}
              className="w-full resize-none text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onReplySubmit(Number(comment.id))}
                disabled={!replyText.trim()}
                className="rounded-lg bg-[var(--color-primary-800)] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-700)]"
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
