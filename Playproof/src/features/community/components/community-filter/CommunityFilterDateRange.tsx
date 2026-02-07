// src/features/community/components/community-filter/CommunityFilterDateRange.tsx

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CommunityFilterDateRangeProps = {
  rangeLabel: string;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
};

export function CommunityFilterDateRange({
  rangeLabel,
  showCalendar,
  onToggleCalendar,
  range,
  onRangeChange,
}: CommunityFilterDateRangeProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-900">업로드날자</label>
      <button
        type="button"
        onClick={onToggleCalendar}
        className="h-11 w-full rounded-lg border border-gray-200 text-sm font-bold text-gray-600 transition-colors hover:border-gray-300"
      >
        {rangeLabel}
      </button>
      {showCalendar && (
        <div className="rounded-xl border border-gray-200 p-3">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={onRangeChange}
            numberOfMonths={1}
            captionLayout="dropdown"
          />
        </div>
      )}
    </div>
  );
}
