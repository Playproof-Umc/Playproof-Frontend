// src/features/matching/components/MatchingDetailModal.tsx
import { X } from 'lucide-react';
import { useMatchingDetailLogic } from '@/features/matching/hooks/useMatchingDetailLogic';
import { MatchingPostInfo } from '@/features/matching/components/detail/MatchingPostInfo';
import { PartyComments } from '@/features/matching/components/PartyComments';
import { useAuthStore } from '@/store/authStore';

export const MatchingDetailModal = () => {
  const { state, setters, handlers } = useMatchingDetailLogic();
  const { shouldRender, selectedPost, isMenuOpen } = state;
  const userId = useAuthStore(state => state.userId);

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
          commentCount={0}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setters.setIsMenuOpen(!isMenuOpen)}
          onMoveToProfile={handlers.handleMoveToProfile}
        />

        {/* Right Panel: Comments with API */}
        <div className="w-[40%] bg-gray-50 flex flex-col h-full overflow-hidden">
          <PartyComments 
            partyId={selectedPost.id}
            currentUserId={userId ?? undefined}
          />
        </div>
      </div>
    </div>
  );
};