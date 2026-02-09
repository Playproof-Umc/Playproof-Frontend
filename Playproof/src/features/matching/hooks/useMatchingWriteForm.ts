// src/features/matching/hooks/useMatchingWriteForm.ts

//src/features/matching/hooks/useMatchingWriteForm.ts
import { useState, useMemo } from 'react';
import type { MatchingData } from '@/features/matching/types';
import { MY_AZITS } from '@/features/matching/constants/matchingConfig';
import { useAuthStore } from '@/store/authStore';

interface UseMatchingWriteFormProps {
  onUpload: (data: MatchingData, action: 'new' | 'replace' | 'bump') => void;
  onClose: () => void;
  existingPosts: MatchingData[];
}

export const useMatchingWriteForm = ({ onUpload, onClose, existingPosts }: UseMatchingWriteFormProps) => {
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : 'user-1';
  const currentUserName = authNickname ?? '사용자';
  // 폼 상태
  const [game, setGame] = useState('리그오브레전드');
  const [title, setTitle] = useState('');
  const [isProMatch, setIsProMatch] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [tier, setTier] = useState('');
  const [azit, setAzit] = useState('new');
  const [memberCount, setMemberCount] = useState(0);
  const [micStatus, setMicStatus] = useState<'on' | 'off' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // 게임 변경 핸들러 (게임이 바뀌면 포지션/티어 초기화)
  const handleGameChange = (newGame: string) => {
    setGame(newGame);
    setSelectedPositions([]);
    setTier('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setTitle(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else if (selectedTags.length < 3) setSelectedTags([...selectedTags, tag]);
  };

  const handlePositionToggle = (posId: string) => {
    if (selectedPositions.includes(posId)) {
      setSelectedPositions(selectedPositions.filter(id => id !== posId));
    } else {
      setSelectedPositions([...selectedPositions, posId]);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      game && tier && selectedPositions.length > 0 &&
      memberCount >= 1 && selectedTags.length >= 1 && 
      title.trim().length > 0
    );
  }, [game, tier, selectedPositions, memberCount, selectedTags, title]);

  const createPostData = (): MatchingData => {
    const azitName = azit === 'new' 
        ? '신규 생성' 
        : MY_AZITS.find(a => a.id === azit)?.name || '알 수 없는 아지트';

    return {
      id: Date.now(),
      game, title, tier,
      tags: selectedTags,
      azit: azitName,
      position: selectedPositions,
      memo,
      currentMembers: 1, 
      maxMembers: memberCount + 1,
      time: '방금 전', 
      views: 0, likes: 0, comments: 0, tsScore: 50,
      mic: micStatus === "on",
      hostUser: { id: currentUserId, nickname: currentUserName, avatarUrl: '' },
    };
  };

  const resetForm = () => {
    setTitle(''); setSelectedPositions([]); setMemberCount(0); setSelectedTags([]); setMemo('');
  };

  const handleUploadAttempt = () => {
    if (!isFormValid) return;
    const hasDuplicate = existingPosts.some(p => p.game === game);
    if (hasDuplicate) {
      setShowDuplicateModal(true);
    } else { 
      onUpload(createPostData(), 'new'); 
      onClose(); 
      resetForm(); 
    }
  };

  const handleDuplicateAction = (action: 'bump' | 'replace' | 'new') => {
    onUpload(createPostData(), action);
    setShowDuplicateModal(false); 
    onClose(); 
    resetForm();
  };

  return {
    formState: {
      game, title, isProMatch, selectedPositions, tier, azit,
      memberCount, micStatus, selectedTags, memo, showDuplicateModal
    },
    setters: {
      setIsProMatch, setTier, setAzit, setMemberCount, setMicStatus, setMemo, setShowDuplicateModal
    },
    handlers: {
      handleGameChange, 
      handleTitleChange, handleTagToggle, handlePositionToggle,
      handleUploadAttempt, handleDuplicateAction
    },
    isFormValid
  };
};
