import React, { useState, useMemo, useEffect } from 'react';
import { X, Mic, MicOff, ChevronDown, Lightbulb, Shield, Sword, Crosshair, Heart, Star, User, Zap, Target, Eye, Flag, Circle } from 'lucide-react';
import type { MatchingData } from '@/features/matching/types/types';

interface MatchingWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: MatchingData, action: 'new' | 'replace' | 'bump') => void;
  existingPosts: MatchingData[];
}

// 게임별 설정 데이터 (기존과 동일, 생략 없이 사용)
const GAME_CONFIG: Record<string, { 
  positions: { id: string; label: string; icon: React.ReactNode }[];
  tiers: string[];
}> = {
  '리그오브레전드': {
    positions: [
      { id: 'top', label: '탑', icon: <Sword size={20} /> },
      { id: 'jungle', label: '정글', icon: <Zap size={20} /> },
      { id: 'mid', label: '미드', icon: <Target size={20} /> },
      { id: 'adc', label: '원딜', icon: <Crosshair size={20} /> },
      { id: 'sup', label: '서폿', icon: <Heart size={20} /> },
    ],
    tiers: ['아이언', '브론즈', '실버', '골드', '플래티넘', '에메랄드', '다이아몬드', '마스터', '그랜드마스터', '챌린저']
  },
  '발로란트': {
    positions: [
      { id: 'duelist', label: '타격대', icon: <Sword size={20} /> },
      { id: 'initiator', label: '척후대', icon: <Zap size={20} /> },
      { id: 'sentinel', label: '감시자', icon: <Eye size={20} /> },
      { id: 'controller', label: '전략가', icon: <Flag size={20} /> },
    ],
    tiers: ['아이언', '브론즈', '실버', '골드', '플래티넘', '다이아몬드', '초월자', '불멸', '레디언트']
  },
  '오버워치': {
    positions: [
      { id: 'tank', label: '탱커', icon: <Shield size={20} /> },
      { id: 'damage', label: '딜러', icon: <Sword size={20} /> },
      { id: 'support', label: '힐러', icon: <Heart size={20} /> },
      { id: 'flex', label: '올라운더', icon: <Star size={20} /> },
    ],
    tiers: ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '마스터', '그랜드마스터', '상위 500위']
  },
  '배틀그라운드': {
    positions: [
      { id: 'newbie', label: '뉴비', icon: <User size={20} /> },
      { id: 'normal', label: '일반', icon: <Circle size={20} /> },
      { id: 'expert', label: '고인물', icon: <Star size={20} /> },
    ],
    tiers: ['브론즈', '실버', '골드', '플래티넘', '크리스탈', '다이아몬드', '마스터', '서바이버']
  },
  'Steam': {
    positions: [
      { id: 'newbie', label: '뉴비', icon: <User size={20} /> },
      { id: 'normal', label: '일반', icon: <Circle size={20} /> },
      { id: 'expert', label: '고인물', icon: <Star size={20} /> },
    ],
    tiers: ['입문', '초보', '중수', '고수', '초고수']
  },
  '기타': {
     positions: [{ id: 'all', label: '전체', icon: <User size={20} /> }],
     tiers: ['레벨 무관']
  }
};

const TAGS = ["협력 유저", "소통 원활", "실력 중심", "즐겜 유저", "하드캐리", "오더가능"];
const MY_AZITS = [{ id: 'azit-1', name: '즐겜러들의 쉼터' }, { id: 'azit-2', name: '빡겜 클랜 본부' }];

export const MatchingWriteModal: React.FC<MatchingWriteModalProps> = ({ 
  isOpen, onClose, onUpload, existingPosts 
}) => {
  const [game, setGame] = useState('리그오브레전드');
  const [title, setTitle] = useState('');
  const [isProMatch, setIsProMatch] = useState(false);
  
  // [수정] 포지션 다중 선택을 위해 배열([])로 변경
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  
  const [tier, setTier] = useState('');
  const [azit, setAzit] = useState('new');
  const [memberCount, setMemberCount] = useState(0);
  const [micStatus, setMicStatus] = useState<'on' | 'off' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // 게임 변경 시 초기화
  useEffect(() => {
    setSelectedPositions([]);
    setTier('');
  }, [game]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setTitle(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else if (selectedTags.length < 3) setSelectedTags([...selectedTags, tag]);
  };

  // [수정] 포지션 토글 핸들러 (다중 선택)
  const handlePositionToggle = (posId: string) => {
    if (selectedPositions.includes(posId)) {
      setSelectedPositions(selectedPositions.filter(id => id !== posId));
    } else {
      setSelectedPositions([...selectedPositions, posId]);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      game && 
      tier && 
      selectedPositions.length > 0 && // [수정] 1개 이상 선택 확인
      memberCount >= 1 && 
      selectedTags.length >= 1 && 
      title.trim().length > 0
    );
  }, [game, tier, selectedPositions, memberCount, selectedTags, title]);

  const createPostData = (): MatchingData => {
    const azitName = azit === 'new' 
        ? '신규 생성' 
        : MY_AZITS.find(a => a.id === azit)?.name || '알 수 없는 아지트';

    return {
      id: Date.now(),
      game, 
      title, 
      tier,
      tags: selectedTags,
      azit: azitName,
      position: selectedPositions, // [수정] 배열 저장
      memo: memo,                  // [추가] 메모 내용 저장
      
      currentMembers: 1, 
      maxMembers: memberCount + 1,
      time: '방금 전', 
      views: 0, 
      likes: 0, 
      comments: 0, 
      tsScore: 50,
      hostUser: { id: 'me', nickname: '나(Player)', avatarUrl: '' },
    };
  };

  const handleUploadClick = () => {
    if (!isFormValid) return;
    const hasDuplicate = existingPosts.some(p => p.game === game);
    if (hasDuplicate) setShowDuplicateModal(true);
    else { onUpload(createPostData(), 'new'); onClose(); resetForm(); }
  };

  const handleDuplicateAction = (action: 'bump' | 'replace' | 'new') => {
    onUpload(createPostData(), action);
    setShowDuplicateModal(false); onClose(); resetForm();
  };

  const resetForm = () => {
    setTitle(''); setSelectedPositions([]); setMemberCount(0); setSelectedTags([]); setMemo('');
  };

  if (!isOpen) return null;
  const currentConfig = GAME_CONFIG[game] || GAME_CONFIG['기타'];

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto scrollbar-hide relative flex flex-col">
          
          <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
            <h2 className="text-xl font-bold text-gray-900">매칭 모집 글 작성</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X size={24} /></button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* 게임 선택 (기존 동일) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">게임 선택</label>
              <div className="relative">
                <select value={game} onChange={(e) => setGame(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer">
                  {Object.keys(GAME_CONFIG).map(g => (<option key={g} value={g}>{g}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* 제목 (기존 동일) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-gray-900">제목</label>
                 <div className="flex items-center gap-4 text-sm">
                   <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-black w-4 h-4" checked={!isProMatch} onChange={() => setIsProMatch(false)} /><span className="text-gray-700 font-medium">일반</span></label>
                   <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-black w-4 h-4" checked={isProMatch} onChange={() => setIsProMatch(true)} /><span className="text-gray-700 font-medium">Pro Match</span></label>
                 </div>
              </div>
              <input type="text" placeholder="최대 20글자" value={title} onChange={handleTitleChange} className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black placeholder-gray-400 font-medium"/>
            </div>

            {/* [수정] 모집 포지션 (다중 선택) */}
            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900">모집 포지션 <span className="text-xs text-gray-500 font-medium">(중복 가능)</span></label>
               <div className={`grid gap-2 ${currentConfig.positions.length > 4 ? 'grid-cols-5' : 'grid-cols-4'}`}>
                  {currentConfig.positions.map((pos) => {
                    const isSelected = selectedPositions.includes(pos.id);
                    return (
                      <button 
                        key={pos.id}
                        // [수정] 클릭 시 토글 함수 호출
                        onClick={() => handlePositionToggle(pos.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-gray-900 border-gray-900 text-white' 
                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        <span className="mb-1">{pos.icon}</span>
                        <span className="text-xs font-bold whitespace-nowrap">{pos.label}</span>
                      </button>
                    );
                  })}
               </div>
            </div>

            {/* 티어 & 아지트 (기존 동일) */}
            <div className="space-y-4">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">티어</label>
                  <div className="relative">
                    <select value={tier} onChange={(e) => setTier(e.target.value)} className={`w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer ${!tier ? 'text-gray-400' : 'text-gray-900'}`}>
                      <option value="" disabled>현재 티어를 선택해주세요.</option>
                      {currentConfig.tiers.map(t => (<option key={t} value={t}>{t}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">아지트</label>
                  <div className="relative">
                    <select value={azit} onChange={(e) => setAzit(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer text-gray-900">
                      <option value="new">➕ 신규 생성 (기본)</option>
                      <optgroup label="내 아지트 목록">{MY_AZITS.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}</optgroup>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
              </div>
            </div>

            {/* 인원 & 태그 & 메모 */}
            <div className="flex items-end gap-4">
               <div className="flex-1 space-y-2">
                  <label className="text-sm font-bold text-gray-900">모집 인원 (1명 이상)</label>
                  <div className="flex items-center justify-between p-1 border border-gray-200 rounded-lg bg-gray-50">
                    <button onClick={() => setMemberCount(Math.max(0, memberCount - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md font-bold text-lg">-</button>
                    <span className={`font-bold ${memberCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{memberCount}</span>
                    <button onClick={() => setMemberCount(memberCount + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md font-bold text-lg">+</button>
                  </div>
               </div>
               <div className="flex gap-2 pb-1">
                   <button onClick={() => setMicStatus(micStatus === 'on' ? null : 'on')} className={`p-3 rounded-lg border ${micStatus === 'on' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}><Mic size={20} /></button>
                   <button onClick={() => setMicStatus(micStatus === 'off' ? null : 'off')} className={`p-3 rounded-lg border ${micStatus === 'off' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}><MicOff size={20} /></button>
               </div>
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-2"><label className="text-sm font-bold text-gray-900">모집 태그</label><span className="text-xs text-gray-500 font-medium">(1개 ~ 3개 선택)</span></div>
               <div className="flex flex-wrap gap-2">{TAGS.map((tag) => (<button key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${selectedTags.includes(tag) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>{tag}</button>))}</div>
            </div>
            {/* 메모 (기존 동일) */}
            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900">메모 <span className="font-normal text-gray-400">(선택)</span></label>
               <textarea rows={4} placeholder="상대에게 원하는 조건을 적어보세요." value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black placeholder-gray-400 font-medium resize-none"/>
            </div>

          </div>

          <div className="p-5 border-t border-gray-100 sticky bottom-0 bg-white shrink-0">
            <button onClick={handleUploadClick} disabled={!isFormValid} className={`w-full py-4 rounded-xl text-base font-bold transition-colors ${isFormValid ? 'bg-gray-900 hover:bg-black text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>업로드</button>
          </div>
        </div>
      </div>
      
      {/* 중복 모달 (기존 동일) */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[400px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
             {/* ... 중복 모달 내용 생략 (위와 동일) ... */}
             <button onClick={() => setShowDuplicateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
             <div className="flex flex-col items-center text-center space-y-3 mb-8 mt-2">
               <Lightbulb strokeWidth={1.5} size={32} className="text-gray-900 mb-1" />
               <h3 className="text-base font-bold text-gray-900 leading-snug">[{game}] 매칭글이 이미 등록되어 있습니다.</h3>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleDuplicateAction('bump')} className="w-full p-4 bg-[#1A1F2C] text-white rounded-2xl hover:bg-black transition-colors text-left group shadow-md">
                <div className="font-bold text-[15px] mb-1">기존 게시글 끌어올리기</div>
                <div className="text-[11px] text-gray-300 font-normal leading-relaxed">내용은 그대로, 매칭 글의 최상단으로 이동합니다.</div>
              </button>
              <button onClick={() => handleDuplicateAction('replace')} className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-200">
                <div className="font-bold text-[15px] mb-1">기존 게시글 교체하기</div>
                <div className="text-[11px] text-gray-500 font-normal leading-relaxed">기존 글을 지우고 현재 내용을 게시합니다.</div>
              </button>
              <button onClick={() => handleDuplicateAction('new')} className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-200">
                <div className="font-bold text-[15px] mb-1">새로운 글로 추가</div>
                <div className="text-[11px] text-gray-500 font-normal leading-relaxed">기존 글을 유지하고 새로운 카드를 생성합니다.</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};