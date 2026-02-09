// src/features/team/components/azit/chat/ChatRoomCreateModal.tsx

import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

export interface ChatRoomCreateData {
  name: string;
  type: "TEXT" | "VOICE";
  isPrivate: boolean;
}

interface ChatRoomCreateModalProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onCreate: (data: ChatRoomCreateData) => void;
}

export const ChatRoomCreateModal = ({ anchorEl, onClose, onCreate }: ChatRoomCreateModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"TEXT" | "VOICE">("TEXT");
  const [isPrivate, setIsPrivate] = useState(false);

  const position = useMemo(() => {
    if (!anchorEl) return { top: 0, left: 0 };
    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    };
  }, [anchorEl]);

  if (!anchorEl) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({ name, type, isPrivate });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-transparent" onClick={onClose} />
      <div
        className="absolute z-[101] w-[400px] bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        style={{ top: position.top, left: position.left }}
      >
        
        {/* 1. 헤더 (돋보기 아이콘 포함) */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">채팅방 생성</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 2. 본문 */}
        <div className="px-6 flex flex-col gap-6 pb-6">
          
          {/* 이름 입력 */}
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-bold text-gray-900">
              채팅방 이름
            </label>
            <Input
              variant="light"
              placeholder="최대 20글자"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-gray-200 focus:border-black rounded-xl"
            />
          </div>

          {/* 유형 선택 (라디오 버튼) */}
          <div className="flex flex-col gap-3">
            <label className="text-[15px] font-bold text-gray-900">
              채팅방 유형
            </label>
            
            <div className="flex flex-col gap-4">
              {/* 텍스트 채팅방 */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input
                    type="radio"
                    name="chatType"
                    className="peer sr-only"
                    checked={type === "TEXT"}
                    onChange={() => setType("TEXT")}
                  />
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    type === "TEXT" 
                      ? "border-[#1533B6]" 
                      : "border-gray-300 group-hover:border-gray-400"
                  )}>
                    {type === "TEXT" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1533B6]" />
                    )}
                  </div>
                </div>
                <div>
                  <div className={cn("text-[15px] font-bold", type === "TEXT" ? "text-gray-900" : "text-gray-500")}>텍스트 채팅방</div>
                  <div className="text-[13px] text-gray-400 mt-0.5">
                    자유롭게 대화를 나눌 수 있는 텍스트 기반 채팅방
                  </div>
                </div>
              </label>

              {/* 음성 채팅방 */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input
                    type="radio"
                    name="chatType"
                    className="peer sr-only"
                    checked={type === "VOICE"}
                    onChange={() => setType("VOICE")}
                  />
                   <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    type === "VOICE" 
                      ? "border-[#1533B6]" 
                      : "border-gray-300 group-hover:border-gray-400"
                  )}>
                    {type === "VOICE" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1533B6]" />
                    )}
                  </div>
                </div>
                <div>
                  <div className={cn("text-[15px] font-bold", type === "VOICE" ? "text-gray-900" : "text-gray-500")}>음성 채팅방</div>
                  <div className="text-[13px] text-gray-400 mt-0.5">
                    실시간으로 목소리를 들으며 소통하는 음성 채팅방
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 비공개 토글 */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[15px] font-bold text-gray-900">비공개 채팅방</span>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                isPrivate ? "bg-[#1533B6]" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  isPrivate ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* 3. 하단 버튼 (검은색) */}
        <div className="p-6 pt-0">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={cn(
              "h-14 rounded-xl text-base font-bold transition-colors",
              name.trim() 
                ? "bg-black hover:bg-gray-900 text-white" 
                : "bg-[#C6C6C6] text-white cursor-not-allowed"
            )}
          >
            업로드
          </Button>
        </div>
      </div>
    </>
  );
};
