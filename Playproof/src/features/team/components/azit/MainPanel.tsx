// src/features/team/components/azit/MainPanel.tsx
import React from 'react';
import { Plus, Trash2, Send, Paperclip } from 'lucide-react';
import { useAzitChat } from '@/features/team/hooks/useAzitChat'; 

export const MainPanel: React.FC = () => {
  const {
    message, setMessage, previewUrls, fileInputRef,
    handleFileSelect, handleRemoveImage, triggerFileInput, sendMessage, hasContent
  } = useAzitChat();

  return (
    <main className="flex-1 flex flex-col min-w-[400px] h-full">
      {/* 헤더 */}
      <div className="flex-none h-12 flex items-center gap-2 mb-2 px-1">
        <h2 className="text-lg font-bold text-gray-900">팀 채팅</h2>
        <button className="text-gray-400 hover:bg-gray-100 p-0.5 rounded transition-colors">
           <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        {/* 채팅 영역 */}
        <div className="flex-1 bg-gray-50 p-4 flex flex-col-reverse overflow-y-auto">
          {/* 메시지 리스트 컴포넌트가 있다면 여기에 위치 */}
          <div className="text-center text-gray-400 text-sm my-auto">채팅 기록이 없습니다.</div>
        </div>

        {/* 이미지 프리뷰 */}
        {previewUrls.length > 0 && (
          <div className="flex-none p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative shrink-0 w-[160px] h-[120px] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
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
             type="file" accept="image/*" multiple
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
               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
               placeholder="메세지를 입력해주세요."
               className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-gray-400"
             />
             <button 
               onClick={sendMessage}
               disabled={!hasContent}
               className={`absolute right-3 transition-colors ${hasContent ? 'text-blue-500 hover:text-blue-600' : 'text-gray-300'}`}
             >
               <Send className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </main>
  );
};