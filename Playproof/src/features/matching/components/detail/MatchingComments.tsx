// src/features/matching/components/detail/MatchingComments.tsx
import React from 'react';
import { User, CornerDownRight } from 'lucide-react';

// 댓글 타입 정의
export interface Comment {
  id: number;
  user: string;
  userId: string;
  text: string;
  time: string;
  isReply?: boolean;
}

interface MatchingCommentsProps {
  comments: Comment[];
  commentText: string;
  onCommentChange: (text: string) => void;
  onCommentSubmit: () => void;
  onMoveToProfile: (userId: string) => void;
}

export const MatchingComments = ({ comments, commentText, onCommentChange, onCommentSubmit, onMoveToProfile }: MatchingCommentsProps) => {
  return (
    <div className="w-[40%] bg-gray-50 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-900">댓글</h3>
        <span className="text-sm font-bold text-gray-500">{comments.length}</span>
      </div>
      
      {/* Input Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={16} /></div>
          <span className="text-xs font-bold text-gray-900">나(Player)</span>
        </div>
        <textarea 
          value={commentText} 
          onChange={(e) => onCommentChange(e.target.value)} 
          placeholder="댓글을 입력해주세요." 
          className="w-full text-xs font-medium text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"
        />
        <div className="flex justify-end mt-2">
          <button onClick={onCommentSubmit} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">작성하기</button>
        </div>
      </div>
      
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className={`flex gap-3 ${comment.isReply ? 'pl-8' : ''}`}>
            {comment.isReply && <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div onClick={() => onMoveToProfile(comment.userId)} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"><User size={12} /></div>
                <span onClick={() => onMoveToProfile(comment.userId)} className="text-xs font-bold text-gray-900 cursor-pointer hover:underline">{comment.user}</span>
                <span className="text-[10px] text-gray-400">{comment.time}</span>
              </div>
              <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 inline-block">{comment.text}</p>
              <button className="block mt-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 ml-1">답글달기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};