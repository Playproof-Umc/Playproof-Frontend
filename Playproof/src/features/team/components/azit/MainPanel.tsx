// src/features/team/components/azit/MainPanel.tsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Send, Paperclip } from 'lucide-react';
import { useAzitChat } from '@/features/team/hooks/useAzitChat';
import { ModalShell } from "@/components/ui/ModalShell";

type ChatMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  media?: { url: string; type: "image" | "video" }[];
};

type MainPanelProps = {
  roomName: string;
  messages: ChatMessage[];
  onSendMessage: (roomName: string, content: string, files: File[]) => void;
  currentUserName: string;
};

export const MainPanel: React.FC<MainPanelProps> = ({
  roomName,
  messages,
  onSendMessage,
  currentUserName,
}) => {
  const [activeMedia, setActiveMedia] = React.useState<{ url: string; type: "image" | "video" } | null>(null);
  const navigate = useNavigate();
  const {
    message, setMessage, selectedFiles, previewItems, fileInputRef,
    handleFileSelect, handleRemoveImage, triggerFileInput, sendMessage, hasContent
  } = useAzitChat();

  const handleSend = () => {
    if (!hasContent) return;
    onSendMessage(roomName, message, selectedFiles);
    sendMessage();
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

  return (
    <main className="flex-1 flex flex-col w-full min-w-0 lg:min-w-[400px] h-auto lg:h-full">
      {/* 헤더 */}
      <div className="flex-none h-12 flex items-center gap-2 mb-2 px-1">
        <h2 className="text-lg font-bold text-gray-900">{roomName}</h2>
        <button className="text-gray-400 hover:bg-gray-100 p-0.5 rounded transition-colors">
           <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        {/* 채팅 영역 */}
        <div className="flex-1 bg-gray-50 p-4 flex flex-col-reverse overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-sm my-auto">채팅 기록이 없습니다.</div>
          ) : (
            messages.map((item) => {
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
                  {item.content && (
                    <div
                      className={`rounded-xl px-3 py-2 text-sm shadow-sm w-fit max-w-[75%] ${
                        isMine
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {item.content}
                    </div>
                  )}
                  {item.media && item.media.length > 0 && (
                    <div className={`flex gap-2 flex-wrap ${isMine ? "justify-end" : "justify-start"}`}>
                      {item.media.map((mediaItem, index) =>
                        mediaItem.type === "video" ? (
                          <video
                            key={`${item.id}-media-${index}`}
                            src={mediaItem.url}
                            className="w-[160px] h-[120px] object-cover rounded-lg border border-gray-200"
                            muted
                            playsInline
                          />
                        ) : (
                          <button
                            key={`${item.id}-media-${index}`}
                            type="button"
                            onClick={() => setActiveMedia(mediaItem)}
                            className="w-[160px] h-[120px] rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <img
                              src={mediaItem.url}
                              alt="chat attachment"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 이미지 프리뷰 */}
        {previewItems.length > 0 && (
          <div className="flex-none p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {previewItems.map((item, index) => (
                <div key={index} className="relative shrink-0 w-[160px] h-[120px] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                  )}
                  <button 
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 입력바 */}
        <div className="p-4 bg-white border-t border-gray-100">
           <input 
             type="file" accept="image/*,video/*" multiple
             ref={fileInputRef} onChange={handleFileSelect} className="hidden"
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
               disabled={!hasContent}
               className={`absolute right-3 transition-colors ${hasContent ? 'text-blue-500 hover:text-blue-600' : 'text-gray-300'}`}
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
            <button
              type="button"
              onClick={handleShareToHighlight}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              공유
            </button>
            <button
              type="button"
              onClick={() => setActiveMedia(null)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              닫기
            </button>
          </div>
        </div>
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          {activeMedia?.type === "video" ? (
            <video
              src={activeMedia.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          ) : activeMedia ? (
            <img
              src={activeMedia.url}
              alt="media"
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>
      </ModalShell>
    </main>
  );
};
