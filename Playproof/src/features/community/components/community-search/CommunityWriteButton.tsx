// src/features/community/components/community-search/CommunityWriteButton.tsx

import { Edit } from "lucide-react";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

type CommunityWriteButtonProps = {
  onClick?: () => void;
};

export function CommunityWriteButton({ onClick }: CommunityWriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[var(--color-primary-800)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-700)]"
    >
      <Edit size={14} />
      <span className="hidden sm:inline">{COMMUNITY_SECTION_LABELS.write}</span>
    </button>
  );
}
