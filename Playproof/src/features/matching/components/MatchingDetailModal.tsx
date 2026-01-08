import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // [추가] useLocation
import { X, MoreHorizontal, User, UserPlus, Home, AlertTriangle, MessageCircle, Heart, Eye, CornerDownRight, Sword, Zap, Target, Crosshair, Shield, Star, Flag, Circle } from 'lucide-react';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';

const MOCK_COMMENTS = [
  { id: 1, userId: 'user-2', user: '플루', text: '저랑 듀오하실래요~? 친추할게요', time: '방금 전', isReply: false },
  { id: 2, userId: 'user-3', user: '게이머1', text: '저요저요!', time: '1분 전', isReply: false },
];

export const MatchingDetailModal = () => {
  const navigate = useNavigate();
  const location = useLocation(); // [추가] 현재 위치 확인용
  const { isOpen, selectedPost, closeMatchingDetail } = useMatchingDetail();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  // [중요 로직] 
  // 1. 모달이 닫혀있거나 데이터가 없으면 렌더링 X
  // 2. [추가] 현재 페이지가 '/matching'이 아니면(예: 프로필 페이지), 모달을 닫지는 않지만 화면엔 안 그림 (숨김 처리)
  if (!isOpen || !selectedPost) return null;
  if (location.pathname !== '/matching') return null;

  // [수정] 프로필 페이지로 이동 핸들러
  const handleMoveToProfile = (userId: string | number) => {
    // closeMatchingDetail(); // <--- [제거] 이걸 지워야 데이터가 유지됨
    navigate(`/user/${userId}`); // 페이지만 이동 (Context 상태는 open 유지)
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    const newComment = { 
        id: Date.now(), 
        userId: 'me', 
        user: '나(Player)', 
        text: commentText, 
        time: '방금 전', 
        isReply: false 
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  // 포지션 렌더링 헬퍼
  const renderPositions = (posIds: string[]) => {
    if (!posIds || posIds.length === 0) return <span className="text-xs text-gray-400">선택된 포지션 없음</span>;
    
    const POS_MAP: Record<string, { label: string, icon: React.ReactNode }> = {
      'top': { label: '탑', icon: <Sword size={16} /> },
      'jungle': { label: '정글', icon: <Zap size={16} /> },
      'mid': { label: '미드', icon: <Target size={16} /> },
      'adc': { label: '원딜', icon: <Crosshair size={16} /> },
      'sup': { label: '서폿', icon: <Heart size={16} /> },
      'duelist': { label: '타격대', icon: <Sword size={16} /> },
      'initiator': { label: '척후대', icon: <Zap size={16} /> },
      'sentinel': { label: '감시자', icon: <Eye size={16} /> },
      'controller': { label: '전략가', icon: <Flag size={16} /> },
      'tank': { label: '탱커', icon: <Shield size={16} /> },
      'damage': { label: '딜러', icon: <Sword size={16} /> },
      'support': { label: '힐러', icon: <Heart size={16} /> },
      'flex': { label: '올라운더', icon: <Star size={16} /> },
      'newbie': { label: '뉴비', icon: <User size={16} /> },
      'normal': { label: '일반', icon: <Circle size={16} /> },
      'expert': { label: '고인물', icon: <Star size={16} /> },
    };

    return posIds.map(posId => {
      const info = POS_MAP[posId] || { label: posId, icon: <User size={16} /> };
      return (
        <div key={posId} className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-500 text-[11px] font-bold gap-1.5">
          {info.icon}
          <span>{info.label}</span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[1000px] h-[85vh] max-h-[700px] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* 닫기 버튼 */}
        <button onClick={closeMatchingDetail} className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full p-1">
            <X size={24} />
        </button>

        {/* 좌측 상세 */}
        <div className="w-[60%] p-8 flex flex-col h-full overflow-y-auto border-r border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-gray-400">{selectedPost.time}</span>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={24} /></button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><UserPlus size={14} /> 친구추가</button>
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><Home size={14} /> 아지트 초대</button>
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 text-left"><AlertTriangle size={14} /> 신고하기</button>
                        </div>
                    )}
                </div>
            </div>

            {/* 작성자 프로필 */}
            <div className="flex items-center gap-4 mb-8">
                <div 
                    onClick={() => handleMoveToProfile(selectedPost.hostUser.id)}
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                    {selectedPost.hostUser.avatarUrl ? (
                        <img src={selectedPost.hostUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover"/>
                    ) : (
                        <User size={32} />
                    )}
                </div>
                <div>
                    <h2 
                        onClick={() => handleMoveToProfile(selectedPost.hostUser.id)}
                        className="text-xl font-bold text-gray-900 cursor-pointer hover:underline underline-offset-2"
                    >
                        {selectedPost.hostUser.nickname}
                    </h2>
                    <p className="text-xs font-medium text-gray-500 mt-1">TS {selectedPost.tsScore}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedPost.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                   {selectedPost.memo || "작성된 내용이 없습니다."}
                </p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center">
                    <span className="w-24 text-xs font-bold text-gray-900">모집티어</span>
                    <span className="text-sm font-medium text-gray-600">{selectedPost.tier}</span>
                </div>
                <div className="flex items-center">
                    <span className="w-24 text-xs font-bold text-gray-900">아지트</span>
                    <span className="text-sm font-medium text-gray-600">{selectedPost.azit}</span>
                </div>
            </div>

            <div className="mb-8">
                <p className="text-xs font-bold text-gray-900 mb-2">이런 사람을 원해요!</p>
                <div className="flex flex-wrap gap-2">
                    {selectedPost.tags && selectedPost.tags.length > 0 ? (
                        selectedPost.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">{tag}</span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">선택된 태그 없음</span>
                    )}
                </div>
            </div>

            <div className="mt-auto">
                 <p className="text-xs font-bold text-gray-900 mb-2">모집 포지션</p>
                 <div className="flex gap-2 mb-6">
                     {renderPositions(selectedPost.position)}
                 </div>
                 <div className="flex items-center gap-4 text-xs font-medium text-gray-400 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1"><Eye size={14} /> <span>{selectedPost.views}</span></div>
                    <div className="flex items-center gap-1"><Heart size={14} /> <span>{selectedPost.likes}</span></div>
                    <div className="flex items-center gap-1"><MessageCircle size={14} /> <span>{comments.length}</span></div>
                 </div>
            </div>
        </div>

        {/* 우측 댓글 */}
        <div className="w-[40%] bg-gray-50 p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4"><h3 className="font-bold text-gray-900">댓글</h3><span className="text-sm font-bold text-gray-500">{comments.length}</span></div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={16} /></div>
                    <span className="text-xs font-bold text-gray-900">나(Player)</span>
                </div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="댓글을 입력해주세요." className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"/>
                <div className="flex justify-end mt-2"><button onClick={handleCommentSubmit} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">작성하기</button></div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment.id} className={`flex gap-3 ${comment.isReply ? 'pl-8' : ''}`}>
                        {comment.isReply && <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />}
                        <div className="flex-1">
                            {/* 댓글 작성자 프로필 클릭 */}
                            <div className="flex items-center gap-2 mb-1">
                                <div 
                                    onClick={() => handleMoveToProfile(comment.userId)}
                                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"
                                >
                                    <User size={12} />
                                </div>
                                <span 
                                    onClick={() => handleMoveToProfile(comment.userId)}
                                    className="text-xs font-bold text-gray-900 cursor-pointer hover:underline"
                                >
                                    {comment.user}
                                </span>
                                <span className="text-[10px] text-gray-400">{comment.time}</span>
                            </div>
                            <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">{comment.text}</p>
                            <button className="block mt-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 ml-1">답글달기</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};