import React, { useState } from "react";
import { Plus, Volume2, Mic, MicOff, MessageSquare } from "lucide-react";
import type { User, Schedule } from "@/features/team/types/types";
import { ScheduleItem } from "@/features/team/components/azit/schedule/ScheduleItem";
import { ChatRoomCreateModal } from "./chat/ChatRoomCreateModal";
import type { ChatRoomCreateData } from "./chat/ChatRoomCreateModal";
import type { VoiceRoom, VoiceRoomMember, ChatRoomSummary } from "@/features/team/hooks/useAzitRooms";

interface LeftPanelProps {
  members: User[];
  schedules?: Schedule[];
  currentUserId: string;

  onAddSchedule?: (target: HTMLElement) => void;
  onStatusChange?: (scheduleId: string, newStatus: "JOIN" | "DECLINE") => void;
  onFeedback?: (scheduleId: string) => void;

  selectedChatRoomId: number | null;
  onSelectChatRoom: (roomId: number) => void;

  voiceRooms: VoiceRoom[];
  onJoinVoiceRoom: (roomId: string) => void;
  onToggleMyMic: (roomId: string) => void;

  textRooms: ChatRoomSummary[];
  
  onCreateChatRoom: (data: ChatRoomCreateData) => void; // ✅ 객체로 받기

  onRenameVoiceRoom: (roomId: string, nextName: string) => void;
  onDeleteVoiceRoom: (roomId: string) => void;

  onRenameChatRoom: (roomId: number, nextName: string) => void;
  onDeleteChatRoom: (roomId: number) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  members = [],
  schedules = [],
  currentUserId,
  onAddSchedule,
  onStatusChange,
  onFeedback,

  selectedChatRoomId,
  onSelectChatRoom,

  voiceRooms = [],
  onJoinVoiceRoom,
  onToggleMyMic,

  textRooms = [],
  onCreateChatRoom,
}) => {
  const [chatCreateAnchorEl, setChatCreateAnchorEl] = useState<HTMLElement | null>(null);

  // ✅ 데이터를 그대로 상위로 전달
  const handleCreateChatRoom = (data: ChatRoomCreateData) => {
    onCreateChatRoom(data);
    setChatCreateAnchorEl(null);
  };

  const isMe = (u: User) => String(u.id) === String(currentUserId);
  const isMeInRoom = (roomUsers: VoiceRoomMember[]) =>
    roomUsers?.some((m) => isMe(m.user)) ?? false;

  return (
    <aside className="w-full lg:w-[340px] flex flex-col gap-6 pr-0 lg:pr-2 overflow-visible lg:overflow-y-auto pb-10 shrink-0 custom-scrollbar">
      {/* 스케줄 */}
      <section>
        <div className="flex justify-between items-center mb-3 px-1 relative">
          <h2 className="text-lg font-bold text-gray-900">스케줄</h2>
          <button
            onClick={(e) =>
              onAddSchedule && e.currentTarget.parentElement && onAddSchedule(e.currentTarget.parentElement)
            }
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="mb-2 px-1">
          <span className="font-bold text-gray-800 text-sm">정기 매칭 일정</span>
        </div>

        <div className="flex flex-col gap-4">
          {schedules.length > 0 ? (
            schedules.map((sch) => (
              <ScheduleItem
                key={sch.id}
                schedule={sch}
                currentUserId={currentUserId}
                onStatusChange={onStatusChange}
                onFeedback={onFeedback}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
              등록된 일정이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 채팅 */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">채팅</h2>
          <button
            type="button"
            onClick={(e) => setChatCreateAnchorEl(e.currentTarget.parentElement ?? e.currentTarget)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500">음성 채팅</div>
          </div>

          {voiceRooms.map((room, index) => {
            const joined = isMeInRoom(room.users);
            return (
              <div
                key={room.id}
                className={
                  index === 0 ? "border-b border-gray-50" : "bg-gray-50/50 pb-3 border-b border-gray-100"
                }
              >
                <div className="w-full px-4 py-2 flex items-center gap-3 h-12">
                  <button
                    type="button"
                    onClick={() => onJoinVoiceRoom(room.id)}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Volume2 className={`w-4 h-4 ${joined ? "text-gray-900" : "text-gray-500"}`} />
                    <span className={`text-sm font-bold truncate ${joined ? "text-gray-900" : "text-gray-600"}`}>
                      {room.name}
                    </span>
                  </button>
                </div>

                <div className="pl-11 pr-4 space-y-2 pb-3">
                  {room.users?.length === 0 ? (
                    <div className="text-xs text-gray-400">참여자가 없습니다.</div>
                  ) : (
                    room.users.map((member) => {
                      const mine = isMe(member.user);
                      return (
                        <div key={String(member.user.id)} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-300" />
                          <span className="text-sm text-gray-600 font-medium">{member.user.nickname}</span>

                          <div className="ml-auto flex items-center">
                            {mine ? (
                              <button
                                type="button"
                                onClick={() => onToggleMyMic(room.id)}
                                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                              >
                                {member.micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                              </button>
                            ) : member.micOn ? (
                              <Mic className="w-4 h-4 text-gray-400" />
                            ) : (
                              <MicOff className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500">일반 채팅</div>
          </div>

          {textRooms.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-400">채팅방이 없습니다.</div>
          ) : (
            textRooms.map((room) => {
              const isSelected = selectedChatRoomId === room.id;

              return (
                <div
                  key={room.id}
                  className={`px-4 py-2 flex items-center gap-3 w-full h-12 transition-colors ${
                    isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                  <button
                    type="button"
                    onClick={() => onSelectChatRoom(room.id)}
                    className={`text-sm font-bold truncate text-left flex-1 ${
                      isSelected ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    {room.roomName}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 3. 멤버 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">멤버</h2>
          <button className="hover:bg-gray-100 rounded-full p-1">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="space-y-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 overflow-hidden">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                {member.isOnline ? (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">
                  {member.nickname || "Member"}
                </div>
                <div className="text-[11px] text-gray-400 font-medium truncate">
                  {member.statusMessage || "상태메세지"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ChatRoomCreateModal
        anchorEl={chatCreateAnchorEl}
        onClose={() => setChatCreateAnchorEl(null)}
        onCreate={handleCreateChatRoom}
      />
    </aside>
  );
};
