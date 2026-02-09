// src/features/matching/components/write/DuplicateModal.tsx
import { X, Lightbulb } from 'lucide-react';

interface DuplicateModalProps {
  game: string;
  onClose: () => void;
  onAction: (action: 'new' | 'replace' | 'bump') => void;
}

export const DuplicateModal = ({ game, onClose, onAction }: DuplicateModalProps) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center space-y-3 mb-8 mt-2">
          <Lightbulb strokeWidth={1.5} size={32} className="text-gray-900 mb-1" />
          <h3 className="text-base font-bold text-gray-900 leading-snug">[{game}] 매칭글이 이미 등록되어 있습니다.</h3>
        </div>
        <div className="space-y-3">
          <button onClick={() => onAction('bump')} className="w-full p-4 bg-[#1A1F2C] text-white rounded-2xl hover:bg-black transition-colors text-left group shadow-md">
            <div className="font-bold text-[15px] mb-1">기존 게시글 끌어올리기</div>
            <div className="text-[11px] text-gray-300 font-normal leading-relaxed">내용은 그대로, 매칭 글의 최상단으로 이동합니다.</div>
          </button>
          <button onClick={() => onAction('replace')} className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-200">
            <div className="font-bold text-[15px] mb-1">기존 게시글 교체하기</div>
            <div className="text-[11px] text-gray-500 font-normal leading-relaxed">기존 글을 지우고 현재 내용을 게시합니다.</div>
          </button>
          <button onClick={() => onAction('new')} className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-200">
            <div className="font-bold text-[15px] mb-1">새로운 글로 추가</div>
            <div className="text-[11px] text-gray-500 font-normal leading-relaxed">기존 글을 유지하고 새로운 카드를 생성합니다.</div>
          </button>
        </div>
      </div>
    </div>
  );
};