// src/features/notification/context/ToastContext.tsx

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, MessageCircle } from 'lucide-react';

interface ToastData {
  id: string; // 채팅방 ID (중복 체크용)
  sender: string;
  message: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'EMOTICON';
  timestamp: number;
}

interface ToastContextType {
  showToast: (data: Omit<ToastData, 'timestamp'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback((data: Omit<ToastData, 'timestamp'>) => {
    //  읽음 상태 연동: 현재 해당 채팅방에 있다면 알림 노출 X
    if (location.pathname.includes(`/chat/${data.id}`)) return;

    //  메시지 타입별 텍스트 변환
    let displayMessage = data.message;
    if (data.type === 'IMAGE') displayMessage = '📷 [사진을 보냈습니다]';
    if (data.type === 'FILE') displayMessage = '📁 [파일을 보냈습니다]';
    if (data.type === 'EMOTICON') displayMessage = '😊 [이모티콘]';

    //  연속 메시지 수신 
    setToast({
      id: data.id,
      sender: data.sender,
      message: displayMessage,
      type: data.type,
      timestamp: Date.now() 
    });

    // 5초 후 자동 삭제
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);

  }, [location.pathname]);

  const handleToastClick = () => {
    if (toast) {
      navigate(`/chat/${toast.id}`); 
      hideToast();
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* 하단 토스트 UI 렌더링 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div 
            onClick={handleToastClick}
            className="w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors relative group"
          >
            {/* 닫기 버튼 */}
            <button 
              onClick={(e) => { e.stopPropagation(); hideToast(); }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-gray-400 hover:text-black border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>

            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 text-indigo-600">
              <MessageCircle size={20} />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-bold text-gray-500">새 메시지</span>
                <span className="text-[10px] text-gray-400">방금 전</span>
              </div>
              <p className="text-sm font-bold text-gray-900 truncate">
                {toast.sender}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};