import React, { useMemo } from "react";
import type { CommunityFilterState } from "@/features/community/components/CommunityFilterModal";

const INITIAL_FILTERS: CommunityFilterState = {
  mediaType: "photo",
  startDate: "",
  endDate: "",
};

type UseCommunityFilterStateArgs = {
  onApply: (filters: CommunityFilterState) => void;
  onClose: () => void;
};

export function useCommunityFilterState({ onApply, onClose }: UseCommunityFilterStateArgs) {
  const [filters, setFilters] = React.useState<CommunityFilterState>(INITIAL_FILTERS);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setRange({});
  };

  const handleApply = () => {
    const startDate = range.from ? range.from.toISOString().slice(0, 10) : "";
    const endDate = range.to ? range.to.toISOString().slice(0, 10) : "";
    onApply({ ...filters, startDate, endDate });
    onClose();
  };

  const rangeLabel = useMemo(() => {
    if (range.from && range.to) {
      return `${range.from.toLocaleDateString("ko-KR")} ~ ${range.to.toLocaleDateString("ko-KR")}`;
    }
    if (range.from) {
      return `${range.from.toLocaleDateString("ko-KR")} 선택됨`;
    }
    return "날자선택";
  }, [range.from, range.to]);

  return {
    state: {
      filters,
      showCalendar,
      range,
      rangeLabel,
    },
    actions: {
      setFilters,
      setShowCalendar,
      setRange,
      handleReset,
      handleApply,
    },
  };
}
