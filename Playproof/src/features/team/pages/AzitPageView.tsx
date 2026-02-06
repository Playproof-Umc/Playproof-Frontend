// src/features/team/pages/AzitPageView.tsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Settings, Users } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

import { AzitNavigation } from '@/features/team/components/azit/AzitNavigation';
import { LeftPanel } from '@/features/team/components/azit/LeftPanel';
import { MainPanel } from '@/features/team/components/azit/MainPanel';
import { RightPanel } from '@/features/team/components/azit/RightPanel';
import { ScheduleCreateModal } from '@/features/team/components/schedule/ScheduleCreateModal';
import { AzitCreateModal } from '@/features/team/components/azit/AzitCreateModal';

import { useAzitPageLogic } from '@/features/team/hooks/useAzitPageLogic';

export const AzitPageView = () => {
  const navigate = useNavigate();
  const { state, actions } = useAzitPageLogic();
  const [isAzitCreateOpen, setIsAzitCreateOpen] = React.useState(false);
  const {
    currentAzitId,
    scheduleAnchorEl,
    selectedChatRoom,
    voiceRooms,
    textRooms,
    messages,
    currentAzit,
    currentMembers,
    currentClips,
    schedules,
    currentUserId,
    currentUser,
  } = state;

  const handleCreateSchedule = (data: any) => {
    actions.addSchedule(data);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-none z-50 border-b border-gray-100">
        <Navbar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1920px] mx-auto">
        {/* Navigation */}
        <div className="flex-none">
          <AzitNavigation 
            azits={state.azits}
            selectedId={currentAzitId} 
            onSelect={actions.setCurrentAzitId}
            onOpenCreate={() => setIsAzitCreateOpen(true)}
          />
        </div>

        {/* Header */}
        <div className="px-6 pb-2 pt-2 shrink-0">
          <div className="h-[60px] bg-gray-100 rounded-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{currentAzit.name}</h1>
              <div className="flex items-center gap-1 text-gray-500 font-bold mt-0.5">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentAzit.memberCount}</span>
              </div>
            </div>
            <button className="text-gray-400 hover:bg-gray-200 rounded-full p-2 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 px-6 pb-6 gap-8 overflow-hidden">
          <LeftPanel 
            members={currentMembers} 
            schedules={schedules}  // State 전달
            currentUserId={currentUserId}
            onAddSchedule={(target) => actions.setScheduleAnchorEl(target)}
            onStatusChange={actions.handleStatusChange} // 핸들러 전달
            selectedChatRoom={selectedChatRoom}
            onSelectChatRoom={actions.setSelectedChatRoom}
            voiceRooms={voiceRooms}
            onJoinVoiceRoom={(roomId) => actions.joinVoiceRoom(roomId)}
            textRooms={textRooms}
            onCreateChatRoom={actions.addChatRoom}
            onRenameVoiceRoom={actions.renameVoiceRoom}
            onDeleteVoiceRoom={actions.deleteVoiceRoom}
            onRenameChatRoom={actions.renameChatRoom}
            onDeleteChatRoom={actions.deleteChatRoom}
          />
          
          <MainPanel
            key={currentAzitId}
            roomName={selectedChatRoom}
            messages={messages}
            onSendMessage={actions.addChatMessage}
            currentUserName={currentUser.nickname}
          />
          
          <div className="w-[300px] flex flex-col shrink-0 gap-4">
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
    </div>
  );
};
