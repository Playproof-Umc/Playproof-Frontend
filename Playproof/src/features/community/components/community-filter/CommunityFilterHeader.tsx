// src/features/community/components/community-filter/CommunityFilterHeader.tsx

import { X } from "lucide-react";

type CommunityFilterHeaderProps = {
  onClose: () => void;
};

export function CommunityFilterHeader({ onClose }: CommunityFilterHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 bg-white px-6 py-4">
      <h2 className="text-[17px] font-bold text-gray-900">커뮤니티 상세 필터</h2>
      <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
        <X size={20} />
      </button>
    </div>
  );
}
