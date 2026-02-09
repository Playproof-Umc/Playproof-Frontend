// src/features/team/components/azit/LeftPanel.tsx

import React, { useState } from 'react';
import { Plus, Volume2, Mic, MessageSquare, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Schedule } from "@/features/team/types";
import type { User } from "@/types";
import { ScheduleItem } from '@/features/team/components/azit/schedule/ScheduleItem';
// ✅ 모달 Import
import { ChatRoomCreateModal } from './chat/ChatRoomCreateModal';
import type { ChatRoomCreateData } from './chat/ChatRoomCreateModal';

interface LeftPanelProps {
  members: User[];
  schedules?: Schedule[];
  currentUserId: string;
  onAddSchedule?: (target: HTMLElement) => void;
  onStatusChange?: (scheduleId: string, newStatus: 'JOIN' | 'DECLINE') => void;
  onFeedback?: (scheduleId: string) => void;
  selectedChatRoom: string;
  onSelectChatRoom: (roomName: string) => void;
  voiceRooms: { id: string; name: string; users: User[] }[];
  onJoinVoiceRoom: (roomId: string) => void;
  textRooms: string[];
  onCreateChatRoom: (name: string, type: "TEXT" | "VOICE") => void;
  onRenameVoiceRoom: (roomId: string, nextName: string) => void;
  onDeleteVoiceRoom: (roomId: string) => void;
  onRenameChatRoom: (roomName: string, nextName: string) => void;
  onDeleteChatRoom: (roomName: string) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  members, 
  schedules = [], 
  currentUserId,
  onAddSchedule,
  onStatusChange,
  onFeedback,
  selectedChatRoom,
  onSelectChatRoom,
  voiceRooms,
  onJoinVoiceRoom,
  textRooms,
  onCreateChatRoom,
  onRenameVoiceRoom,
  onDeleteVoiceRoom,
  onRenameChatRoom,
  onDeleteChatRoom
}) => {
  // ✅ 모달 상태 관리
  const [chatCreateAnchorEl, setChatCreateAnchorEl] = useState<HTMLElement | null>(null);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingVoiceId, setEditingVoiceId] = useState<string | null>(null);
  const [editingVoiceName, setEditingVoiceName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("삭제 확인");
  const [confirmDescription, setConfirmDescription] = useState("");
  const confirmActionRef = React.useRef<() => void>(() => {});

  // ✅ 채팅방 생성 핸들러 (API 호출 로직 추가할 곳)
  const handleCreateChatRoom = (data: ChatRoomCreateData) => {
    console.log("생성할 채팅방 데이터:", data);
    // TODO: API 호출 예시 -> createChatRoomMutation.mutate(data);
    onCreateChatRoom(data.name, data.type);
  };

  const startEditingRoom = (roomName: string) => {
    setEditingRoom(roomName);
    setEditingName(roomName);
  };

  const cancelEditingRoom = () => {
    setEditingRoom(null);
    setEditingName("");
  };

  const submitEditingRoom = () => {
    if (!editingRoom) return;
    onRenameChatRoom(editingRoom, editingName);
    cancelEditingRoom();
  };

  const startEditingVoice = (roomId: string, roomName: string) => {
    setEditingVoiceId(roomId);
    setEditingVoiceName(roomName);
  };

  const cancelEditingVoice = () => {
    setEditingVoiceId(null);
    setEditingVoiceName("");
  };

  const submitEditingVoice = () => {
    if (!editingVoiceId) return;
    onRenameVoiceRoom(editingVoiceId, editingVoiceName);
    cancelEditingVoice();
  };

  const openConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    confirmActionRef.current = onConfirm;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    confirmActionRef.current();
    setConfirmOpen(false);
  };


  return (
    <aside className="w-full lg:w-[340px] flex flex-col gap-6 pr-0 lg:pr-2 overflow-visible lg:overflow-y-auto pb-10 shrink-0 custom-scrollbar">
      
      {/* 1. 스케줄 섹션 (건드리지 않음) */}
      <section>
        <div className="flex justify-between items-center mb-3 px-1 relative">
          <h2 className="text-lg font-bold text-gray-900">스케줄</h2>
          <button 
            onClick={(e) => onAddSchedule && e.currentTarget.parentElement && onAddSchedule(e.currentTarget.parentElement)}
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

      {/* 2. 채팅 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">채팅</h2>
          <button
            type="button"
            onClick={(e) =>
              setChatCreateAnchorEl(
                e.currentTarget.parentElement ?? e.currentTarget
              )
            }
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500">음성 채팅</div>
          </div>
          {voiceRooms.map((room, index) => (
            <div
              key={room.id}
              className={index === 0 ? "border-b border-gray-50" : "bg-gray-50/50 pb-3 border-b border-gray-100"}
            >
              <div className="w-full px-4 py-2 flex items-center gap-3 h-12">
                <button
                  type="button"
                  onClick={() => onJoinVoiceRoom(room.id)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Volume2 className={`w-4 h-4 ${index === 0 ? "text-gray-500" : "text-gray-900"}`} />
                  {editingVoiceId === room.id ? (
                    <input
                      value={editingVoiceName}
                      onChange={(e) => setEditingVoiceName(e.target.value)}
                      className="h-8 px-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-gray-400 w-full"
                      maxLength={20}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          submitEditingVoice();
                        }
                        if (e.key === "Escape") {
                          cancelEditingVoice();
                        }
                      }}
                    />
                  ) : (
                    <span className={`text-sm font-bold truncate ${index === 0 ? "text-gray-600" : "text-gray-900"}`}>
                      {room.name}
                    </span>
                  )}
                </button>
                {editingVoiceId === room.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={submitEditingVoice}
                      className="p-1 rounded-md hover:bg-blue-100 text-blue-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditingVoice}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditingVoice(room.id, room.name)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openConfirm(
                          "음성 채팅방 삭제",
                          `"${room.name}" 음성 채팅방을 삭제할까요?`,
                          () => onDeleteVoiceRoom(room.id)
                        )
                      }
                      disabled={voiceRooms.length <= 1}
                      className={`p-1 rounded-md ${
                        voiceRooms.length <= 1
                          ? "text-gray-200 cursor-not-allowed"
                          : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="pl-11 pr-4 space-y-2 pb-3">
                {room.users.length === 0 ? (
                  <div className="text-xs text-gray-400">참여자가 없습니다.</div>
                ) : (
                  room.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-600 font-medium">{user.nickname}</span>
                      {String(user.id) === String(currentUserId) && (
                        <Mic className="w-3 h-3 text-red-400 ml-auto" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500">일반 채팅</div>
          </div>
          {textRooms.map((room) => {
            const isSelected = selectedChatRoom === room;
            const isEditing = editingRoom === room;
            return (
              <div
                key={room}
                className={`px-4 py-2 flex items-center gap-3 w-full h-12 transition-colors ${
                  isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-600"
                } ${room === "자유 대화" ? "border-b border-gray-50" : ""}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare
                    className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`}
                  />
                  {isEditing ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-8 px-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-gray-400 w-full"
                      maxLength={20}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          submitEditingRoom();
                        }
                        if (e.key === "Escape") {
                          cancelEditingRoom();
                        }
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectChatRoom(room)}
                      className={`text-sm font-bold truncate text-left flex-1 ${
                        isSelected ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {room}
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={submitEditingRoom}
                      className="p-1 rounded-md hover:bg-blue-100 text-blue-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditingRoom}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditingRoom(room)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openConfirm(
                          "채팅방 삭제",
                          `"${room}" 채팅방을 삭제할까요?`,
                          () => onDeleteChatRoom(room)
                        )
                      }
                      disabled={textRooms.length <= 1}
                      className={`p-1 rounded-md ${
                        textRooms.length <= 1
                          ? "text-gray-200 cursor-not-allowed"
                          : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 멤버 섹션 (기존 유지) */}
      <section>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-lg font-bold text-gray-900">멤버</h2>
          <button className="hover:bg-gray-100 rounded-full p-1"><Plus className="w-4 h-4 text-gray-400" /></button>
        </div>
        <div className="space-y-1">
          {members.slice(0, 3).map((member, i) => (
             <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
               <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div>
                 <div className="font-bold text-sm text-gray-900">{member.nickname || 'Member'}</div>
                 <div className="text-[11px] text-gray-400 font-medium">상태메세지</div>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* ✅ 모달 컴포넌트 렌더링 (Portal 사용으로 위치 상관 없음) */}
      <ChatRoomCreateModal 
        anchorEl={chatCreateAnchorEl}
        onClose={() => setChatCreateAnchorEl(null)}
        onCreate={handleCreateChatRoom}
      />

      {confirmOpen && (
        <>
          <div className="fixed inset-0 z-[110] bg-black/30" onClick={() => setConfirmOpen(false)} />
          <div className="fixed inset-0 z-[111] flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900">{confirmTitle}</h3>
              <p className="text-sm text-gray-500 mt-2">{confirmDescription}</p>
              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 h-10 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => setConfirmOpen(false)}
                >
                  취소
                </button>
                <button
                  className="flex-1 h-10 rounded-xl bg-[var(--color-primary-800)] text-white font-semibold hover:bg-[var(--color-primary-700)] transition-colors"
                  onClick={handleConfirm}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </aside>
  );
};
