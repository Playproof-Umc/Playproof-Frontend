// src/features/notification/context/ToastContext.tsx

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, MessageCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastData {
  id?: string; // 채팅방 ID (채팅인 경우)
  sender?: string;
  message: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'EMOTICON' | 'SUCCESS' | 'ERROR' | 'INFO';
  timestamp: number;
}

interface ToastContextType {
  showToast: (data: Omit<ToastData, 'timestamp'>) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback((data: Omit<ToastData, 'timestamp'>) => {
    // 읽음 상태 연동: 채팅인 경우 현재 해당 채팅방에 있다면 알림 노출 X
    if (data.id && location.pathname.includes(`/chat/${data.id}`)) return;

    let displayMessage = data.message;
    if (data.type === 'IMAGE') displayMessage = '📷 [사진을 보냈습니다]';
    if (data.type === 'FILE') displayMessage = '📁 [파일을 보냈습니다]';
    if (data.type === 'EMOTICON') displayMessage = '😊 [이모티콘]';

    setToast({
      ...data,
      message: displayMessage,
      timestamp: Date.now() 
    });

    // 일반 시스템 알림은 3초, 채팅은 5초 유지
    const duration = (data.type === 'SUCCESS' || data.type === 'ERROR' || data.type === 'INFO') ? 3000 : 5000;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);

  }, [location.pathname]);

  const success = useCallback((message: string) => showToast({ message, type: 'SUCCESS' }), [showToast]);
  const error = useCallback((message: string) => showToast({ message, type: 'ERROR' }), [showToast]);
  const info = useCallback((message: string) => showToast({ message, type: 'INFO' }), [showToast]);

  const handleToastClick = () => {
    if (toast?.id) {
      navigate(`/chat/${toast.id}`); 
      hideToast();
    }
  };

  const getToastStyle = () => {
    switch (toast?.type) {
      case 'SUCCESS': return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      case 'ERROR': return 'bg-red-50 border-red-100 text-red-800';
      case 'INFO': return 'bg-blue-50 border-blue-100 text-blue-800';
      default: return 'bg-white border-gray-100 text-gray-900';
    }
  };

  const getToastIcon = () => {
    switch (toast?.type) {
      case 'SUCCESS': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'ERROR': return <AlertCircle className="text-red-500" size={20} />;
      case 'INFO': return <Info className="text-blue-500" size={20} />;
      default: return <MessageCircle className="text-indigo-600" size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      
      {/* 하단 토스트 UI 렌더링 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div 
            onClick={handleToastClick}
            className={`w-[320px] rounded-2xl shadow-2xl border p-4 flex gap-3 items-start pointer-events-auto cursor-pointer hover:opacity-90 transition-all relative group ${getToastStyle()}`}
          >
            {/* 닫기 버튼 */}
            <button 
              onClick={(e) => { e.stopPropagation(); hideToast(); }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-gray-400 hover:text-black border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'TEXT' || toast.type === 'IMAGE' || toast.type === 'FILE' || toast.type === 'EMOTICON' ? 'bg-indigo-100' : ''}`}>
              {getToastIcon()}
            </div>
            
            <div className="flex-1 overflow-hidden pt-0.5">
              {toast.sender && (
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-bold text-gray-500">새 메시지</span>
                </div>
              )}
              {toast.sender && <p className="text-sm font-bold truncate mb-0.5">{toast.sender}</p>}
              <p className={`text-sm font-medium leading-tight ${!toast.sender ? 'mt-1.5' : ''}`}>
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
