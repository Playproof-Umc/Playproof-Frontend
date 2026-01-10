// src/features/matching/components/MatchingDetailModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { useMatchingDetailLogic } from '@/features/matching/hooks/useMatchingDetailLogic';
import { MatchingPostInfo } from './detail/MatchingPostInfo';
import { MatchingComments } from './detail/MatchingComments';

export const MatchingDetailModal = () => {
  const { state, setters, handlers } = useMatchingDetailLogic();
  const { shouldRender, selectedPost, isMenuOpen, commentText, comments } = state;

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
          commentCount={comments.length}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setters.setIsMenuOpen(!isMenuOpen)}
          onMoveToProfile={handlers.handleMoveToProfile}
        />

        {/* Right Panel: Comments */}
        <MatchingComments 
          comments={comments}
          commentText={commentText}
          onCommentChange={setters.setCommentText}
          onCommentSubmit={handlers.handleCommentSubmit}
          onMoveToProfile={handlers.handleMoveToProfile}
        />
      </div>
    </div>
  );
};