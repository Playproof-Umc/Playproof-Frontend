// src/features/community/components/community-search/CommunityFilterButton.tsx

import { SlidersHorizontal } from "lucide-react";
import { CommunityFilterModal, type CommunityFilterState } from "@/features/community/components/community-filter/CommunityFilterModal";

type CommunityFilterButtonProps = {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onApply?: (filters: CommunityFilterState) => void;
};

export function CommunityFilterButton({
  isOpen,
  onToggle,
  onClose,
  onApply,
}: CommunityFilterButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`rounded-lg border p-3 transition-colors bg-white ${
          isOpen
            ? "border-black text-black bg-gray-50"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <SlidersHorizontal size={18} />
      </button>
      <CommunityFilterModal
        isOpen={!!isOpen}
        onClose={onClose ?? (() => undefined)}
        onApply={(filters) => onApply?.(filters)}
      />
    </div>
  );
}
