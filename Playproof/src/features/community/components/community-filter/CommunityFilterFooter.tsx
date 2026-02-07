// src/features/community/components/community-filter/CommunityFilterFooter.tsx

import { RotateCcw } from "lucide-react";

type CommunityFilterFooterProps = {
  onReset: () => void;
  onApply: () => void;
};

export function CommunityFilterFooter({ onReset, onApply }: CommunityFilterFooterProps) {
  return (
    <div className="flex gap-3 border-t border-gray-50 bg-gray-50/50 p-5">
      <button
        onClick={onReset}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-black"
        title="초기화"
      >
        <RotateCcw size={18} />
      </button>
      <button
        onClick={onApply}
        className="h-12 flex-1 rounded-xl bg-[#1A1F2C] text-sm font-bold text-white shadow-lg shadow-gray-200 transition-colors hover:bg-black"
      >
        필터 적용하기
      </button>
    </div>
  );
}
