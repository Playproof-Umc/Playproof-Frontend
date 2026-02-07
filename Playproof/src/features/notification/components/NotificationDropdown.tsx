// src/features/notification/components/NotificationDropdown.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus, Gamepad2, Calendar, XCircle, Info, Check } from 'lucide-react';
import type { Notification } from '@/features/notification/data/mockNotifications';

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: Notification[];
  onUpdateNotifications: (next: Notification[]) => void;
}

export const NotificationDropdown = ({
  onClose,
  notifications,
  onUpdateNotifications,
}: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'FRIEND'>('ALL');

  // 탭에 따라 리스트 필터링
  const filteredList = notifications.filter(noti => {
    if (activeTab === 'FRIEND') return noti.type === 'FRIEND_REQUEST';
    return noti.type !== 'FRIEND_REQUEST';
  });

  // 아이콘 렌더링
  const getIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST': return <UserPlus size={16} className="text-blue-500" />;
      case 'MATCH_REQUEST': return <Gamepad2 size={16} className="text-purple-500" />;
      case 'MATCH_REJECT': return <XCircle size={16} className="text-red-500" />;
      case 'AZIT_SCHEDULE': return <Calendar size={16} className="text-green-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  // 프로필 클릭 핸들러
  const handleProfileClick = (e: React.MouseEvent, userId?: string) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    if (userId) {
      navigate(`/user/${userId}`); 
      onClose(); 
    }
  };

  const markAsRead = (id: number) => {
    onUpdateNotifications(
      notifications.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti))
    );
  };

  const markAllAsRead = () => {
    onUpdateNotifications(
      notifications
        .filter((noti) => noti.type === "FRIEND_REQUEST")
        .map((noti) => ({ ...noti, isRead: true }))
    );
  };

  const removeNotification = (id: number) => {
    onUpdateNotifications(notifications.filter((noti) => noti.id !== id));
  };

  // 알림 항목 클릭 핸들러
  const handleItemClick = (noti: Notification) => {
    markAsRead(noti.id);
    onClose();

    switch (noti.type) {
      case 'MATCH_REQUEST': 
        // 매칭 요청 -> 매칭 페이지 신청자 목록으로 이동
        navigate('/matching', { state: { openApplicants: true } });
        break;
      case 'FRIEND_REQUEST': 
        // 친구 요청 -> 보낸 사람 프로필 페이지로 이동
        if (noti.sender) navigate(`/user/${noti.sender.id}`);
        break;
      case 'MATCH_REJECT': 
        navigate('/matching'); 
        break;
      case 'AZIT_SCHEDULE': 
        navigate('/azit', { state: { azitId: noti.azitId, scheduleId: noti.scheduleId } }); 
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-default" onClick={onClose} />
      <div 
        className="absolute top-full right-0 mt-3 z-50 w-[380px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 및 탭 */}
        <div className="px-5 pt-4 pb-0 bg-white border-b border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <Bell size={16} className="text-black" /> 알림
            </h2>
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
            >
              <Check size={12} /> 모두 읽음
            </button>
          </div>
          
          {/* 탭 버튼 */}
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('ALL')}
              className={`pb-2 text-xs font-bold transition-colors relative ${activeTab === 'ALL' ? 'text-black' : 'text-gray-400'}`}
            >
              받은 알림
              {activeTab === 'ALL' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('FRIEND')}
              className={`pb-2 text-xs font-bold transition-colors relative ${activeTab === 'FRIEND' ? 'text-black' : 'text-gray-400'}`}
            >
              받은 친구 요청
              {activeTab === 'FRIEND' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />}
            </button>
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2 min-h-[200px]">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 gap-2">
              <Bell size={24} className="opacity-20" />
              <span className="text-xs">새로운 알림이 없습니다.</span>
            </div>
          ) : (
            filteredList.map((noti) => (
              <div 
                key={noti.id} 
                onClick={() => handleItemClick(noti)}
                className={`px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 items-start ${!noti.isRead ? 'bg-blue-50/30' : ''}`}
              >
                {/* 프로필 이미지 */}
                <div 
                  onClick={(e) => handleProfileClick(e, noti.sender?.id)}
                  className="shrink-0 mt-0.5 relative cursor-pointer group"
                >
                   <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden group-hover:border-gray-400 transition-colors">
                     {noti.sender?.avatarUrl ? (
                       <img src={noti.sender.avatarUrl} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="text-gray-400">{getIcon(noti.type)}</div>
                     )}
                   </div>
                   {!noti.isRead && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-[13px] text-gray-800 font-medium leading-snug">
                    <span 
                      onClick={(e) => handleProfileClick(e, noti.sender?.id)}
                      className="font-bold hover:underline cursor-pointer mr-1"
                    >
                      {noti.sender?.nickname}
                    </span>
                    {noti.message.replace(noti.sender?.nickname || '', '')}
                  </p>
                  <span className="text-[11px] text-gray-400 font-medium block">
                    {noti.time}
                  </span>
                  
                  {/* 친구 요청일 경우 수락/거절 버튼 */}
                  {noti.type === 'FRIEND_REQUEST' && (
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(noti.id);
                          removeNotification(noti.id);
                        }}
                        className="px-3 py-1.5 bg-black text-white text-[11px] font-bold rounded-lg hover:bg-gray-800"
                      >
                        수락
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(noti.id);
                          removeNotification(noti.id);
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-gray-200"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
