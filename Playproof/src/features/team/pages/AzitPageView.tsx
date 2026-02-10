// src/features/team/pages/AzitPageView.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

import { AzitNavigation } from "@/features/team/components/azit/AzitNavigation";
import { LeftPanel } from "@/features/team/components/azit/LeftPanel";
import { MainPanel } from "@/features/team/components/azit/MainPanel";
import { RightPanel } from "@/features/team/components/azit/RightPanel";
import { ScheduleCreateModal } from "@/features/team/components/schedule/ScheduleCreateModal";
import type { ScheduleCreatePayload } from "@/features/team/hooks/useScheduleCreateState";
import { AzitCreateModal } from "@/features/team/components/azit/AzitCreateModal";
import { FeedbackModal } from "@/features/team/components/feedback/FeedbackModal";

import { useAzitPageLogic } from "@/features/team/hooks/useAzitPageLogic";

export const AzitPageView = () => {
  const navigate = useNavigate();
  const { state, actions } = useAzitPageLogic();
  
  const [isAzitCreateOpen, setIsAzitCreateOpen] = React.useState(false);

  const {
    currentAzitId,
    scheduleAnchorEl,

    // chat
    chatRooms,
    selectedChatRoomId,
    selectedChatRoomName,
    messages,

    // voice mock
    voiceRooms,

    currentAzit,
    currentMembers,
    currentClips,
    schedules,
    currentUserId,
    currentUser,

    feedbackModal,

    socketConnected,
  } = state;

  const handleCreateSchedule = (data: ScheduleCreatePayload) => {
    actions.addSchedule(data);
  };

  const handleBackClick = () => {
    const pending = actions.getPendingFeedbacks().find((item) => item.azitId === currentAzitId);
    if (pending) {
      actions.openFeedbackModal(pending.scheduleId, true);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-none z-50 border-b border-gray-100">
        <Navbar />
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto lg:overflow-hidden w-full max-w-[1920px] mx-auto">
        <div className="flex-none">
          <AzitNavigation
            azits={state.azits}
            selectedId={currentAzitId}
            onSelect={actions.setCurrentAzitId}
            onOpenCreate={() => setIsAzitCreateOpen(true)}
          />
        </div>

        <div className="px-4 sm:px-6 pb-2 pt-2 shrink-0">
          <div className="min-h-[60px] bg-gray-100 rounded-xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackClick}
                className="text-gray-500 hover:text-gray-900"
                aria-label="돌아가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {currentAzit.name}
              </h1>

              <div className="flex items-center gap-1 text-gray-500 font-bold mt-0.5">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentAzit.memberCount}</span>
              </div>

              <span
                className={[
                  "ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  socketConnected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700",
                ].join(" ")}
              >
                {socketConnected ? "Socket 연결됨" : "Socket 미연결"}
              </span>
            </div>

            <button className="text-gray-400 hover:bg-gray-200 rounded-full p-2 transition-colors self-end sm:self-auto">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row px-4 sm:px-6 pb-6 gap-6 lg:gap-8 overflow-visible lg:overflow-hidden">
          <LeftPanel
            members={currentMembers}
            schedules={schedules}
            currentUserId={currentUserId}
            onAddSchedule={(target) => actions.setScheduleAnchorEl(target)}
            onStatusChange={actions.handleStatusChange}
            onFeedback={(scheduleId) => actions.openFeedbackModal(scheduleId)}
            selectedChatRoomId={selectedChatRoomId}
            onSelectChatRoom={actions.setSelectedChatRoom}
            voiceRooms={voiceRooms}
            onJoinVoiceRoom={(voiceRoomId) => {
              actions.joinVoiceRoom(voiceRoomId);
            }}
            onToggleMyMic={(voiceRoomId) => {
              actions.toggleMyMic(voiceRoomId);
            }}
            textRooms={chatRooms}
            // ✅ 수정: actions.onCreateChatRoom을 그대로 전달 (PageLogic에서 처리)
            onCreateChatRoom={actions.onCreateChatRoom}
            onRenameVoiceRoom={() => {}}
            onDeleteVoiceRoom={() => {}}
            onRenameChatRoom={() => {}}
            onDeleteChatRoom={() => {}}
          />

          <MainPanel
            key={currentAzitId}
            roomId={selectedChatRoomId}
            roomName={selectedChatRoomName}
            messages={messages}
            onSendMessage={actions.onSendMessage}
            currentUserName={currentUser.nickname}
          />

          <div className="w-full lg:w-[300px] flex flex-col shrink-0 gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-gray-900">하이라이트</h2>
              <button
                className="text-xs text-gray-500 underline font-medium"
                onClick={() => navigate("/community?tab=하이라이트")}
              >
                전체보기
              </button>
            </div>
            <RightPanel clips={currentClips} />
          </div>
        </div>
      </div>

      <ScheduleCreateModal
        anchorEl={scheduleAnchorEl}
        onClose={() => actions.setScheduleAnchorEl(null)}
        onCreate={handleCreateSchedule}
      />

      <AzitCreateModal
        open={isAzitCreateOpen}
        onClose={() => setIsAzitCreateOpen(false)}
        onCreate={({ name, iconUrl }) => {
          actions.addAzit(name, iconUrl);
          setIsAzitCreateOpen(false);
        }}
      />

      <FeedbackModal
        open={feedbackModal.open}
        required={feedbackModal.required}
        targetName={feedbackModal.targetName ?? "상대방"}
        targetMeta={feedbackModal.targetMeta}
        avatarUrl={feedbackModal.avatarUrl}
        onClose={actions.closeFeedbackModal}
        onSubmit={() => {
          if (!feedbackModal.scheduleId) return;
          actions.submitFeedback(feedbackModal.scheduleId);
        }}
      />
    </div>
  );
};