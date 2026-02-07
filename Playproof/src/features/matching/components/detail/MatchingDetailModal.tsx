// src/features/matching/components/detail/MatchingDetailModal.tsx
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useMatchingDetailLogic } from '@/features/matching/hooks/useMatchingDetailLogic';
import { MatchingPostInfo } from '@/features/matching/components/detail/MatchingPostInfo';
import { MatchingComments } from '@/features/matching/components/detail/MatchingComments';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';

export const MatchingDetailModal = () => {
  const { state, setters, handlers } = useMatchingDetailLogic();
  const {
    shouldRender,
    selectedPost,
    isMenuOpen,
    commentText,
    replyText,
    replyingToId,
    comments,
    currentUserId,
    currentUserName,
    editingCommentId,
    editingReplyId,
    editingParentId,
    editText,
  } = state;
  const { updateCommentCount } = useMatchingDetail();

  const totalCommentCount = comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0);

  useEffect(() => {
    if (!selectedPost) return;
    updateCommentCount(selectedPost.id, totalCommentCount);
  }, [selectedPost, totalCommentCount, updateCommentCount]);

  if (!shouldRender || !selectedPost) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[1000px] h-[85vh] max-h-[700px] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={handlers.closeMatchingDetail} 
          className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full p-1"
        >
          <X size={24} />
        </button>

        {/* Left Panel: Post Info */}
        <MatchingPostInfo 
          post={selectedPost} 
          commentCount={totalCommentCount}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setters.setIsMenuOpen(!isMenuOpen)}
          onMoveToProfile={handlers.handleMoveToProfile}
        />

        {/* Right Panel: Comments */}
        <MatchingComments 
          comments={comments}
          totalCount={totalCommentCount}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          commentText={commentText}
          replyText={replyText}
          replyingToId={replyingToId}
          editingCommentId={editingCommentId}
          editingReplyId={editingReplyId}
          editingParentId={editingParentId}
          editText={editText}
          onCommentChange={setters.setCommentText}
          onCommentSubmit={handlers.handleCommentSubmit}
          onReplyChange={setters.setReplyText}
          onReplyToggle={handlers.handleReplyToggle}
          onReplySubmit={handlers.handleReplySubmit}
          onEditTextChange={setters.setEditText}
          onEditCommentStart={handlers.handleEditCommentStart}
          onEditReplyStart={handlers.handleEditReplyStart}
          onEditCancel={handlers.handleEditCancel}
          onEditSubmit={handlers.handleEditSubmit}
          onDeleteComment={handlers.handleDeleteComment}
          onDeleteReply={handlers.handleDeleteReply}
          onMoveToProfile={handlers.handleMoveToProfile}
        />
      </div>
    </div>
  );
};
