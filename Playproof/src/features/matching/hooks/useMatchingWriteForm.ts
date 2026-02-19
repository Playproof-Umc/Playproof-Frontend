// src/features/matching/hooks/useMatchingWriteForm.ts

//src/features/matching/hooks/useMatchingWriteForm.ts
import { useEffect, useState, useMemo } from 'react';
import type { MatchingData } from '@/features/matching/types';
import { useAuthStore } from '@/store/authStore';
import { createAzit, getAzits } from '@/features/team/api/azitApi';
import type { Azit } from '@/features/team/types';

interface UseMatchingWriteFormProps {
  onUpload: (data: MatchingData, action: 'new' | 'replace' | 'bump') => void;
  onClose: () => void;
  existingPosts: MatchingData[];
}

export const useMatchingWriteForm = ({ onUpload, onClose, existingPosts }: UseMatchingWriteFormProps) => {
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? String(authUserId) : '1';
  const currentUserName = authNickname ?? '사용자';
  // 폼 상태
  const [game, setGame] = useState('리그오브레전드');
  const [title, setTitle] = useState('');
  const [isProMatch, setIsProMatch] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [tier, setTier] = useState('');
  const [azit, setAzit] = useState('new');
  const [newAzitName, setNewAzitName] = useState('');
  const [azits, setAzits] = useState<Azit[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [micStatus, setMicStatus] = useState<'on' | 'off' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isAzitsLoading, setIsAzitsLoading] = useState(false);

  // 게임 변경 핸들러 (게임이 바뀌면 포지션/티어 초기화)
  const handleGameChange = (newGame: string) => {
    console.log('🎮 게임 변경:', { 이전: game, 새로운: newGame });
    setGame(newGame);
    setSelectedPositions([]);
    setTier('');
    console.log('✅ 게임 변경 완료 - 포지션/티어 초기화됨');
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

  useEffect(() => {
    let alive = true;
    setIsAzitsLoading(true);
    (async () => {
      try {
        const list = await getAzits();
        if (!alive) return;
        setAzits(list);
      } catch (err) {
        if (!alive) return;
        setAzits([]);
      } finally {
        if (alive) setIsAzitsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (azit === 'new') return;
    if (azit) return;
    if (azits.length === 0) return;
    setAzit(String(azits[0].id));
  }, [azit, azits]);

  const isFormValid = useMemo(() => {
    const hasAzit = azit === 'new'
      ? newAzitName.trim().length > 0
      : Boolean(azit);
    return (
      game && tier && selectedPositions.length > 0 &&
      memberCount >= 1 && selectedTags.length >= 1 &&
      title.trim().length > 0 && hasAzit
    );
  }, [game, tier, selectedPositions, memberCount, selectedTags, title, azit, newAzitName]);

  const createPostData = (azitOverride?: Azit): MatchingData => {
    const selectedAzit = azitOverride ?? azits.find((a) => String(a.id) === azit);
    const azitName =
      azit === 'new' ? newAzitName.trim() : selectedAzit?.name ?? '알 수 없는 아지트';

    return {
      id: Date.now(),
      game, title, tier,
      tags: selectedTags,
      azit: azitName,
      azitId: selectedAzit?.id,
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
    setTitle('');
    setSelectedPositions([]);
    setMemberCount(0);
    setSelectedTags([]);
    setMemo('');
    setNewAzitName('');
    setAzit('new');
  };

  const handleUploadAttempt = async () => {
    if (!isFormValid) return;
    const hasDuplicate = existingPosts.some(p => p.game === game);
    if (hasDuplicate) {
      setShowDuplicateModal(true);
    } else { 
      if (azit === 'new') {
        try {
          const created = await createAzit(newAzitName.trim());
          setAzits((prev) => [created, ...prev]);
          setAzit(String(created.id));
          onUpload(createPostData(created), 'new');
        } catch (err) {
          alert('아지트 생성에 실패했습니다.');
          return;
        }
      } else {
        onUpload(createPostData(), 'new');
      }
      onClose(); 
      resetForm(); 
    }
  };

  const handleDuplicateAction = async (action: 'bump' | 'replace' | 'new') => {
    if (azit === 'new') {
      try {
        const created = await createAzit(newAzitName.trim());
        setAzits((prev) => [created, ...prev]);
        setAzit(String(created.id));
        onUpload(createPostData(created), action);
      } catch (err) {
        alert('아지트 생성에 실패했습니다.');
        return;
      }
    } else {
      onUpload(createPostData(), action);
    }
    setShowDuplicateModal(false); 
    onClose(); 
    resetForm();
  };

  return {
    formState: {
      game, title, isProMatch, selectedPositions, tier, azit, newAzitName, azits, isAzitsLoading,
      memberCount, micStatus, selectedTags, memo, showDuplicateModal
    },
    setters: {
      setIsProMatch, setTier, setAzit, setNewAzitName, setMemberCount, setMicStatus, setMemo, setShowDuplicateModal
    },
    handlers: {
      handleGameChange, 
      handleTitleChange, handleTagToggle, handlePositionToggle,
      handleUploadAttempt, handleDuplicateAction
    },
    isFormValid
  };
};
