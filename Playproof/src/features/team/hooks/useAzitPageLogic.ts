// src/features/team/hooks/useAzitPageLogic.ts

import React from "react";
import { useLocation } from "react-router-dom";

import type { User, Azit } from "@/features/team/types/types"; // Azit 타입 추가 확인
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/authApi";

import { getAzits, updateAzit } from "@/features/team/api/azitApi";
import { getAzitMembers } from "@/features/team/api/azitMemberApi";

import { useAzitSchedules } from "@/features/team/hooks/useAzitSchedules";
import { useAzitFeedback } from "@/features/team/hooks/useAzitFeedback";
import { useAzitMedia } from "@/features/team/hooks/useAzitMedia";
import { useAzitRooms, type ChatMessageUI } from "@/features/team/hooks/useAzitRooms";

import { useAzitSocket, type ApiError, type ChatMessage } from "@/features/team/hooks/useAzitSocket";
import { useAzitVoiceToken } from "@/features/team/hooks/useAzitVoiceToken";
import { useAzitLivekitVoice } from "@/features/team/hooks/useAzitLivekitVoice";

import {
  getChatRoomsByAzit,
  getChatMessages,
  createChatRoomByAzit,
  updateChatRoom,
  deleteChatRoom,
  type ChatMessageResDto,
} from "@/features/team/api/chatApi";

import type { ChatRoomCreateData } from "@/features/team/components/azit/chat/ChatRoomCreateModal";

const FALLBACK_USER_ID = "1";

// DTO를 UI 메시지 형태로 변환하는 헬퍼 함수
function toUiMessage(dto: ChatMessageResDto | ChatMessage): ChatMessageUI {
  const nickname = (dto as any).nickname;
  const userId = (dto as any).userId;

  return {
    id: String((dto as any).id),
    author: nickname ?? (userId != null ? `User ${String(userId)}` : "Unknown"),
    content: (dto as any).content,
    createdAt: (dto as any).createdAt,
  };
}

export function useAzitPageLogic() {
  const location = useLocation();
  const routeState = location.state as { azitId?: number } | null;

  const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState<HTMLElement | null>(null);
  
  // [통합] 목 데이터 제거, 빈 배열로 시작
  const [azits, setAzits] = React.useState<Azit[]>([]);
  const [currentAzitId, setCurrentAzitId] = React.useState<number>(routeState?.azitId ?? 0);
  const [membersByAzit, setMembersByAzit] = React.useState<Record<number, User[]>>({});
  
  const azitIconUrlsRef = React.useRef<string[]>([]);
  
  const { accessToken, userId: authUserId, nickname: authNickname, setAuth } = useAuthStore();
  const isAutoLoggingIn = React.useRef(false);

  const apiBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL as string)?.trim() || "https://myfit.my";
  const currentUserId = authUserId ? String(authUserId) : FALLBACK_USER_ID;

  /** --- 1. 아지트 목록 로드 --- */
  React.useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    (async () => {
      try {
        const data = await getAzits();
        if (!alive) return;
        if (data.length > 0) {
          setAzits(data);
          // 현재 ID가 유효하지 않으면 첫 번째 아지트로 설정
          if (!currentAzitId || !data.some((a) => a.id === currentAzitId)) {
            setCurrentAzitId(data[0].id);
          }
        }
      } catch (err) {
        console.error("아지트 목록 로드 실패:", err);
      }
    })();
    return () => { alive = false; };
  }, [accessToken, currentAzitId]);

  const currentUser = React.useMemo(() => ({
    id: String(authUserId || FALLBACK_USER_ID),
    nickname: authNickname || (accessToken ? "알 수 없음" : "게스트"),
    avatarUrl: "", 
    isOnline: true,
  }), [accessToken, authUserId, authNickname]);

  /** --- 2. 스케줄 훅 통합 --- */
  const {
    schedules,
    handleStatusChange,
    addSchedule,
    markFeedbackDone,
  } = useAzitSchedules(currentUserId, currentUser); // develop 브랜치의 간결한 인자 전달 방식 채택

  // ... (중략: Feedback, Media, Rooms 관련 로직은 두 브랜치 동일하므로 유지)

  /** --- 3. 아지트 멤버 조회 통합 --- */
  React.useEffect(() => {
    if (!accessToken || !currentAzitId) return;
    let alive = true;
    (async () => {
      try {
        const res = await getAzitMembers({ azitId: currentAzitId, page: 1, size: 50 });
        if (!alive) return;
        
        // Elric 브랜치의 멤버 매핑 로직 반영
        const members: User[] = res.members.map((m) => ({
          id: String(m.member_id),
          nickname: m.nickname ?? "Unknown",
          avatarUrl: m.avatar_url ?? "",
          isOnline: true,
        }));
        setMembersByAzit((prev) => ({ ...prev, [currentAzitId]: members }));
      } catch (err) {
        console.error("아지트 멤버 조회 실패:", err);
      }
    })();
    return () => { alive = false; };
  }, [accessToken, currentAzitId]);

  /** --- 4. 아지트 정보 수정 액션 --- */
  const updateAzitName = React.useCallback(async (azitId: number, nextName: string) => {
    const trimmed = nextName.trim();
    if (!trimmed) return;
    try {
      const updated = await updateAzit(azitId, { azit_name: trimmed });
      setAzits((prev) =>
        prev.map((azit) => azit.id === azitId ? { ...azit, name: updated.azit_name } : azit)
      );
    } catch (err) {
      console.error("아지트 이름 수정 실패", err);
    }
  }, []);

  const updateAzitIcon = React.useCallback(async (azitId: number, file: File) => {
    if (!file) return;
    try {
      const updated = await updateAzit(azitId, { azit_icon: file });
      setAzits((prev) =>
        prev.map((azit) => azit.id === azitId ? { ...azit, icon: updated.azit_icon_url ?? azit.icon } : azit)
      );
    } catch (err) {
      console.error("아지트 아이콘 수정 실패", err);
    }
  }, []);

  // 현재 선택된 아지트 객체 계산
  const currentAzit = azits.find((a) => a.id === currentAzitId) || { id: 0, name: "", icon: "", memberCount: 0 };
  const currentMembers = membersByAzit[currentAzitId] ?? [];
  const currentClips = clipsByAzit[currentAzitId] ?? [];

  return {
    state: {
      azits,
      currentAzitId,
      scheduleAnchorEl,
      currentAzit,
      currentMembers,
      currentClips,
      schedules,
      currentUserId,
      currentUser,
      // ... 나머지 state 유지
    },
    actions: {
      setCurrentAzitId,
      setScheduleAnchorEl,
      // ... 나머지 actions 유지
      updateAzitName,
      updateAzitIcon,
    },
  };
}