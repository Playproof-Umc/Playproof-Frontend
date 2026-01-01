//src/pages/azit/panels/LeftPanel.tsx
import React from 'react';
import type { Schedule, Channel } from '@/types';

// Team 기능
import { NextMatchBox } from '@/features/team/components/NextMatchBox';
import { ScheduleList } from '@/features/team/components/ScheduleList';

// Chat 기능
import { VoiceRoomList } from '@/features/chat/components/VoiceRoomList';
import { ChatRoomList } from '@/features/chat/components/ChatRoomList';

interface LeftPanelProps {
  nextMatchDate: Date | null;
  schedules: Schedule[];
  voiceChannels: Channel[];
  chatChannels: Channel[];
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  nextMatchDate, schedules, voiceChannels, chatChannels 
}) => {
  return (
    <aside className="w-[340px] bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 p-5 gap-6">
      
      {/* 1. 카운트다운 (Team) */}
      <NextMatchBox nextMatchDate={nextMatchDate} />

      {/* 2. 일정 리스트 (Team) */}
      <ScheduleList schedules={schedules} />

      {/* 3. 보이스 룸 리스트 (Chat) */}
      <VoiceRoomList voiceChannels={voiceChannels} />

      {/* 4. 채팅 룸 리스트 (Chat) */}
      <ChatRoomList chatChannels={chatChannels} />

    </aside>
  );
};
