//src/features/matching/components/MatchingDetailModal.tsx
import React from 'react';
import { X, MoreHorizontal, User, UserPlus, Home, AlertTriangle, MessageCircle, Heart, Eye, CornerDownRight } from 'lucide-react';
import { useMatchingDetailLogic } from '@/features/matching/hooks/useMatchingDetailLogic';
import { getPositionInfo } from '@/features/matching/utils/matchingUtils';

export const MatchingDetailModal = () => {
  const { state, setters, handlers } = useMatchingDetailLogic();
  const { shouldRender, selectedPost, isMenuOpen, commentText, comments } = state;

  if (!shouldRender || !selectedPost) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[1000px] h-[85vh] max-h-[700px] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        <button onClick={handlers.closeMatchingDetail} className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full p-1"><X size={24} /></button>

        <div className="w-[60%] p-8 flex flex-col h-full overflow-y-auto border-r border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-gray-400">{selectedPost.time}</span>
                <div className="relative">
                    <button onClick={() => setters.setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={24} /></button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><UserPlus size={14} /> 친구추가</button>
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-left"><Home size={14} /> 아지트 초대</button>
                            <button className="w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 text-left"><AlertTriangle size={14} /> 신고하기</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div onClick={() => handlers.handleMoveToProfile(selectedPost.hostUser.id)} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                    {selectedPost.hostUser.avatarUrl ? <img src={selectedPost.hostUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover"/> : <User size={32} />}
                </div>
                <div>
                    <h2 onClick={() => handlers.handleMoveToProfile(selectedPost.hostUser.id)} className="text-xl font-bold text-gray-900 cursor-pointer hover:underline underline-offset-2">{selectedPost.hostUser.nickname}</h2>
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
                <div className="flex items-center"><span className="w-24 text-xs font-bold text-gray-900">모집티어</span><span className="text-sm font-medium text-gray-600">{selectedPost.tier}</span></div>
                <div className="flex items-center"><span className="w-24 text-xs font-bold text-gray-900">아지트</span><span className="text-sm font-medium text-gray-600">{selectedPost.azit}</span></div>
            </div>

            <div className="mb-8">
                <p className="text-xs font-bold text-gray-900 mb-2">이런 사람을 원해요!</p>
                <div className="flex flex-wrap gap-2">
                    {selectedPost.tags?.length > 0 ? selectedPost.tags.map(tag => (<span key={tag} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">{tag}</span>)) : <span className="text-xs text-gray-400">태그 없음</span>}
                </div>
            </div>

            <div className="mt-auto">
                 <p className="text-xs font-bold text-gray-900 mb-2">모집 포지션</p>
                 <div className="flex gap-2 mb-6">
                     {selectedPost.position?.map(posId => {
                        const { label, icon } = getPositionInfo(posId);
                        return (<div key={posId} className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-500 text-[11px] font-bold gap-1.5">{icon}<span>{label}</span></div>);
                     })}
                 </div>
                 <div className="flex items-center gap-4 text-xs font-medium text-gray-400 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1"><Eye size={14} /> <span>{selectedPost.views}</span></div>
                    <div className="flex items-center gap-1"><Heart size={14} /> <span>{selectedPost.likes}</span></div>
                    <div className="flex items-center gap-1"><MessageCircle size={14} /> <span>{comments.length}</span></div>
                 </div>
            </div>
        </div>

        <div className="w-[40%] bg-gray-50 p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4"><h3 className="font-bold text-gray-900">댓글</h3><span className="text-sm font-bold text-gray-500">{comments.length}</span></div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={16} /></div><span className="text-xs font-bold text-gray-900">나(Player)</span></div>
                <textarea value={commentText} onChange={(e) => setters.setCommentText(e.target.value)} placeholder="댓글을 입력해주세요." className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"/>
                <div className="flex justify-end mt-2"><button onClick={handlers.handleCommentSubmit} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">작성하기</button></div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment.id} className={`flex gap-3 ${comment.isReply ? 'pl-8' : ''}`}>
                        {comment.isReply && <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div onClick={() => handlers.handleMoveToProfile(comment.userId)} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"><User size={12} /></div>
                                <span onClick={() => handlers.handleMoveToProfile(comment.userId)} className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">{comment.user}</span>
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