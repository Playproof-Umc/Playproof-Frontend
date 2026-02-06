import React from "react";
import { useLocation } from "react-router-dom";
import {
  MOCK_MY_AZITS,
  mockClipsByAzit,
  mockMembersByAzit,
  mockSchedulesByAzit,
} from "@/features/team/data/mockTeamData";
import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";

const FALLBACK_USER_ID = "1";

export function useAzitPageLogic() {
  const location = useLocation();
  const state = location.state as { azitId?: number } | null;
  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  const currentUserId = FALLBACK_USER_ID;

  const {
    currentAzitId,
    setCurrentAzitId,
    schedules,
    handleStatusChange,
  } = useAzitSchedules(currentUserId, mockSchedulesByAzit, mockMembersByAzit);

  React.useEffect(() => {
    if (state?.azitId) {
      setCurrentAzitId(state.azitId);
    }
  }, [state?.azitId, setCurrentAzitId]);

  const currentAzit =
    MOCK_MY_AZITS.find((azit) => azit.id === currentAzitId) ?? MOCK_MY_AZITS[0];
  const currentMembers =
    mockMembersByAzit[currentAzitId] ?? mockMembersByAzit[1];
  const currentClips = mockClipsByAzit[currentAzitId] ?? mockClipsByAzit[1];

  return {
    state: {
      azits: MOCK_MY_AZITS,
      currentAzitId,
      scheduleAnchorEl,
      currentAzit,
      currentMembers,
      currentClips,
      schedules,
      currentUserId,
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,
      handleStatusChange,
    },
  };
}
