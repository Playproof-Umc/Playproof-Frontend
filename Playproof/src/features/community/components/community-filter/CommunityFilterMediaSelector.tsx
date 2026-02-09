// src/features/community/components/community-filter/CommunityFilterMediaSelector.tsx

import type { CommunityFilterState } from "@/features/community/components/community-filter/CommunityFilterModal";

type CommunityFilterMediaSelectorProps = {
  mediaType: CommunityFilterState["mediaType"];
  onChange: (value: CommunityFilterState["mediaType"]) => void;
};

export function CommunityFilterMediaSelector({
  mediaType,
  onChange,
}: CommunityFilterMediaSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-900">미디어</label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("photo")}
          className={`h-11 rounded-lg border text-sm font-bold transition-all ${
            mediaType === "photo"
              ? "bg-gray-900 border-gray-900 text-white"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          사진
        </button>
        <button
          type="button"
          onClick={() => onChange("video")}
          className={`h-11 rounded-lg border text-sm font-bold transition-all ${
            mediaType === "video"
              ? "bg-gray-900 border-gray-900 text-white"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          동영상
        </button>
      </div>
    </div>
  );
}
