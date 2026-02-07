// src/features/community/components/community-filter/CommunityFilterModal.tsx

import { CommunityFilterHeader } from "@/features/community/components/community-filter/CommunityFilterHeader";
import { CommunityFilterMediaSelector } from "@/features/community/components/community-filter/CommunityFilterMediaSelector";
import { CommunityFilterDateRange } from "@/features/community/components/community-filter/CommunityFilterDateRange";
import { CommunityFilterFooter } from "@/features/community/components/community-filter/CommunityFilterFooter";
import { useCommunityFilterState } from "@/features/community/components/community-filter/useCommunityFilterState";

export type CommunityFilterState = {
  mediaType: "photo" | "video";
  startDate: string;
  endDate: string;
};

type CommunityFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CommunityFilterState) => void;
};

export function CommunityFilterModal({ isOpen, onClose, onApply }: CommunityFilterModalProps) {
  const { state, actions } = useCommunityFilterState({ onApply, onClose });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-default" onClick={onClose} />
      <div
        className="absolute right-0 top-full z-50 mt-3 flex w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <CommunityFilterHeader onClose={onClose} />

        <div className="max-h-[60vh] space-y-6 overflow-y-auto bg-white p-6 scrollbar-hide">
          <CommunityFilterMediaSelector
            mediaType={state.filters.mediaType}
            onChange={(mediaType) => actions.setFilters((prev) => ({ ...prev, mediaType }))}
          />

          <div className="h-px bg-gray-100" />

          <CommunityFilterDateRange
            rangeLabel={state.rangeLabel}
            showCalendar={state.showCalendar}
            onToggleCalendar={() => actions.setShowCalendar((prev) => !prev)}
            range={state.range}
            onRangeChange={(nextRange) => actions.setRange(nextRange)}
          />
        </div>

        <CommunityFilterFooter onReset={actions.handleReset} onApply={actions.handleApply} />
      </div>
    </>
  );
}
