// src/features/matching/components/write/MatchingWriteModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import type { MatchingData } from '@/features/matching/types';
import { useMatchingWriteForm } from '@/features/matching/hooks/useMatchingWriteForm';
import { WriteGameSection } from '@/features/matching/components/write/WriteGameSection';
import { WritePositionSection } from '@/features/matching/components/write/WritePositionSection';
import { WriteDetailSection } from '@/features/matching/components/write/WriteDetailSection';
import { WriteTagSection } from '@/features/matching/components/write/WriteTagSection';
import { DuplicateModal } from '@/features/matching/components/write/DuplicateModal';

interface MatchingWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: MatchingData, action: 'new' | 'replace' | 'bump') => void;
  existingPosts: MatchingData[];
  initialGame?: string;
}

export const MatchingWriteModal: React.FC<MatchingWriteModalProps> = ({ 
  isOpen, onClose, onUpload, existingPosts, initialGame
}) => {
  const { formState, setters, handlers, isFormValid } = useMatchingWriteForm({ 
    onUpload, onClose, existingPosts 
  });

  const { 
    game, title, isProMatch, selectedPositions, tier, azit, 
    memberCount, micStatus, selectedTags, memo, showDuplicateModal 
  } = formState;

  React.useEffect(() => {
    if (!isOpen || !initialGame) return;
    if (initialGame !== game) {
      handlers.handleGameChange(initialGame);
    }
  }, [game, handlers, initialGame, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto scrollbar-hide relative flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
            <h2 className="text-xl font-bold text-gray-900">매칭 모집 글 작성</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X size={24} /></button>
          </div>

          {/* Body: 분리된 섹션들 조립 */}
          <div className="p-6 space-y-6 flex-1">
            <WriteGameSection 
              game={game} title={title} isProMatch={isProMatch}
              onGameChange={handlers.handleGameChange}
              onTitleChange={handlers.handleTitleChange}
              onProMatchChange={setters.setIsProMatch}
            />

            <WritePositionSection 
              game={game} 
              selectedPositions={selectedPositions}
              onPositionToggle={handlers.handlePositionToggle}
            />

            <WriteDetailSection 
              game={game} tier={tier} azit={azit}
              memberCount={memberCount} micStatus={micStatus}
              setTier={setters.setTier} setAzit={setters.setAzit}
              setMemberCount={setters.setMemberCount} setMicStatus={setters.setMicStatus}
            />

            <WriteTagSection 
              selectedTags={selectedTags} memo={memo}
              onTagToggle={handlers.handleTagToggle} setMemo={setters.setMemo}
            />
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 sticky bottom-0 bg-white shrink-0">
            <button 
              onClick={handlers.handleUploadAttempt} 
              disabled={!isFormValid} 
              className={`w-full py-4 rounded-xl text-base font-bold transition-colors ${
                isFormValid 
                  ? 'bg-gray-900 hover:bg-black text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              업로드
            </button>
          </div>
        </div>
      </div>
      
      {showDuplicateModal && (
        <DuplicateModal 
          game={game}
          onClose={() => setters.setShowDuplicateModal(false)}
          onAction={handlers.handleDuplicateAction}
        />
      )}
    </>
  );
};
