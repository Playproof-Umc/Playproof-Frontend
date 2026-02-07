// src/features/matching/hooks/useMatchingDetailLogic.ts

//src/features/matching/hooks/useMatchingDetailLogic.ts
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import { useAuthStore } from '@/store/authStore';

const FALLBACK_USER_ID = 'user-1';
const FALLBACK_USER_NAME = '사용자';

const MOCK_COMMENTS = [
  {
    id: 1,
    userId: 'user-2',
    user: '플루',
    text: '저랑 듀오하실래요~? 친추할게요',
    time: '방금 전',
    replies: [
      {
        id: 11,
        userId: 'user-1',
        user: '엘릭',
        text: '좋아요! 언제 가능하세요?',
        time: '방금 전',
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    userId: 'user-3',
    user: '게이머1',
    text: '저요저요!',
    time: '1분 전',
    replies: [],
  },
];

export const useMatchingDetailLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, selectedPost, closeMatchingDetail } = useMatchingDetail();
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : FALLBACK_USER_ID;
  const currentUserName = authNickname ?? FALLBACK_USER_NAME;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingParentId, setEditingParentId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const prevPathRef = useRef(location.pathname);
  const fromSource = new URLSearchParams(location.search).get('from');

  // 홈에서도 상세 모달 노출
  const allowPaths = ['/matching', '/home', '/mypage'];
  const shouldRender =
    isOpen &&
    selectedPost &&
    (allowPaths.includes(location.pathname) || location.pathname.startsWith('/mypage'));

  useEffect(() => {
    if (isOpen && prevPathRef.current !== location.pathname) {
      closeMatchingDetail();
    }
    prevPathRef.current = location.pathname;
  }, [isOpen, location.pathname, closeMatchingDetail]);

  const handleClose = () => {
    closeMatchingDetail();
    if (fromSource === 'mypage') {
      navigate(-1);
    }
  };

  const handleMoveToProfile = (userId: string | number) => {
    navigate(`/user/${userId}`);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    const newComment = { 
        id: Date.now(), 
        userId: currentUserId, 
        user: currentUserName, 
        text: commentText, 
        time: '방금 전', 
        replies: []
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleReplyToggle = (commentId: number) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
    setReplyText('');
  };

  const handleEditCommentStart = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText(text);
  };

  const handleEditReplyStart = (commentId: number, replyId: number, text: string) => {
    setEditingCommentId(null);
    setEditingReplyId(replyId);
    setEditingParentId(commentId);
    setEditText(text);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText('');
  };

  const handleEditSubmit = () => {
    const nextText = editText.trim();
    if (!nextText) return;

    if (editingCommentId) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId ? { ...comment, text: nextText } : comment
        )
      );
      handleEditCancel();
      return;
    }

    if (editingReplyId && editingParentId) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingParentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === editingReplyId ? { ...reply, text: nextText } : reply
                ),
              }
            : comment
        )
      );
      handleEditCancel();
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) {
      handleEditCancel();
    }
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
          : comment
      )
    );
    if (editingReplyId === replyId) {
      handleEditCancel();
    }
  };

  const handleReplySubmit = (commentId: number) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      userId: currentUserId,
      user: currentUserName,
      text: replyText,
      time: '방금 전',
      parentId: commentId,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
    setReplyText('');
    setReplyingToId(null);
  };

  return {
    state: {
      shouldRender,
      selectedPost,
      isMenuOpen,
      commentText,
      replyText,
      replyingToId,
      comments,
      editingCommentId,
      editingReplyId,
      editingParentId,
      editText,
      currentUserId,
      currentUserName,
    },
    setters: { setIsMenuOpen, setCommentText, setReplyText, setEditText },
    handlers: {
      closeMatchingDetail: handleClose,
      handleMoveToProfile,
      handleCommentSubmit,
      handleReplyToggle,
      handleReplySubmit,
      handleEditCommentStart,
      handleEditReplyStart,
      handleEditCancel,
      handleEditSubmit,
      handleDeleteComment,
      handleDeleteReply,
    }
  };
};
