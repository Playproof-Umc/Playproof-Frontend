// src/features/team/components/azit/MainPanel.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Send, Paperclip } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import type { ChatMessageUI } from "@/features/team/hooks/useAzitRooms";

type MainPanelProps = {
  roomId: number | null;
  roomName: string;
  messages: ChatMessageUI[];
  onSendMessage: (roomId: number, content: string, files: File[]) => void;
  currentUserName: string;
};

type PreviewItem = {
  url: string;
  type: "image" | "video";
};

export const MainPanel: React.FC<MainPanelProps> = ({
  roomId,
  roomName,
  messages,
  onSendMessage,
  currentUserName,
}) => {
  const [activeMedia, setActiveMedia] = React.useState<{ url: string; type: "image" | "video" } | null>(null);
  const navigate = useNavigate();

  // 입력/첨부는 MainPanel 로컬 상태로 관리
  const [message, setMessage] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewItems, setPreviewItems] = React.useState<PreviewItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const hasContent = message.trim().length > 0 || selectedFiles.length > 0;

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const nextPreviews: PreviewItem[] = files.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewItems((prev) => [...prev, ...nextPreviews]);

    // 동일 파일 재선택 가능하도록 reset
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewItems((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSend = () => {
    if (!hasContent) return;
    if (!roomId) return;

    onSendMessage(roomId, message, selectedFiles);

    // 전송 후 로컬 상태 초기화
    setMessage("");
    setSelectedFiles([]);
    setPreviewItems((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  };

  const handleShareToHighlight = React.useCallback(async () => {
    if (!activeMedia) return;
    if (activeMedia.type === "video") {
      alert("영상 공유는 아직 준비 중이에요.");
      return;
    }
    const response = await fetch(activeMedia.url);
    const blob = await response.blob();
    const ext = blob.type.includes("png") ? "png" : "jpg";
    const file = new File([blob], `highlight-share-${Date.now()}.${ext}`, {
      type: blob.type || "image/jpeg",
    });
    navigate("/community?tab=하이라이트", { state: { shareFiles: [file] } });
  }, [activeMedia, navigate]);

  const safeMessages = messages ?? [];

  return (
    <main className="flex-1 flex flex-col w-full min-w-0 lg:min-w-[400px] h-auto lg:h-full">
      <div className="flex-none h-12 flex items-center gap-2 mb-2 px-1">
        <h2 className="text-lg font-bold text-gray-900">{roomName || "채팅"}</h2>
        <button className="text-gray-400 hover:bg-gray-100 p-0.5 rounded transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        <div className="flex-1 bg-gray-50 p-4 flex flex-col-reverse overflow-y-auto">
          {safeMessages.length === 0 ? (
            <div className="text-center text-gray-400 text-sm my-auto">
              {roomId ? "채팅 기록이 없습니다." : "채팅방을 선택해주세요."}
            </div>
          ) : (
            safeMessages.map((item) => {
              const isMine = item.author === currentUserName;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-2 mb-4 ${isMine ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{item.author}</span>
                    <span>{item.createdAt}</span>
                  </div>

                  {item.content ? (
                    <div
                      className={`rounded-xl px-3 py-2 text-sm shadow-sm w-fit max-w-[75%] ${
                        isMine ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {item.content}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* ✅ 전송 전 프리뷰는 그대로 유지 */}
        {previewItems.length > 0 && (
          <div className="flex-none p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {previewItems.map((item, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-[160px] h-[120px] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden"
                >
                  {item.type === "video" ? (
                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveMedia(item)}
                      className="w-full h-full"
                      aria-label="preview"
                    >
                      <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm z-10"
                    aria-label="remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-t border-gray-100">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="relative flex items-center w-full">
            <button onClick={triggerFileInput} className="absolute left-3 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5 -rotate-45" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (e.nativeEvent.isComposing) return;
                e.preventDefault();
                handleSend();
              }}
              placeholder="메세지를 입력해주세요."
              className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!hasContent || !roomId}
              className={`absolute right-3 transition-colors ${
                hasContent && roomId ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ModalShell
        open={Boolean(activeMedia)}
        onOverlayClick={() => setActiveMedia(null)}
        overlayClassName="fixed inset-0 z-[130] bg-black/60"
        wrapperClassName="fixed inset-0 z-[131] flex items-center justify-center px-6"
        panelClassName="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-base font-bold text-gray-900">미디어 보기</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleShareToHighlight} className="text-sm text-gray-500 hover:text-gray-900">
              공유
            </button>
            <button type="button" onClick={() => setActiveMedia(null)} className="text-sm text-gray-500 hover:text-gray-900">
              닫기
            </button>
          </div>
        </div>
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          {activeMedia?.type === "video" ? (
            <video src={activeMedia.url} className="w-full h-full object-contain" controls autoPlay />
          ) : activeMedia ? (
            <img src={activeMedia.url} alt="media" className="w-full h-full object-contain" />
          ) : null}
        </div>
      </ModalShell>
    </main>
  );
};
