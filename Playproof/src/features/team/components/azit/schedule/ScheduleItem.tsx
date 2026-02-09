// src/features/team/components/azit/schedule/ScheduleItem.tsx

import React, { useEffect, useState } from 'react';
import { Users, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Schedule } from '@/features/team/types';
import { getScheduleActionState } from '@/features/team/utils/scheduleAction';

type ScheduleItemProps = {
  schedule: Schedule;
  currentUserId: string;
  onStatusChange?: (id: string, status: 'JOIN' | 'DECLINE') => void;
  onFeedback?: (scheduleId: string) => void;
};

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  schedule,
  currentUserId,
  onStatusChange,
  onFeedback,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = schedule.fullDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('00 : 00 : 00');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')} : ${m
        .toString()
        .padStart(2, '0')} : ${s.toString().padStart(2, '0')}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  const formatTime = (d?: Date) =>
    d
      ? d.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';

  const actionState = getScheduleActionState(schedule, currentUserId);
  const { status, joinedParticipants, joinedCount } = actionState;

  const renderActionButtons = () => {
    switch (status) {
      case 'FEEDBACK_DONE':
        return (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
          >
            완료됨
          </button>
        );
      case 'RECRUITMENT_FAILED':
        return (
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Users className="w-4 h-4" /> 추가 게이머 찾기
          </button>
        );
      case 'TIME_OVER':
        return (
          <button
            onClick={() => onFeedback?.(schedule.id)}
            className="w-full bg-blue-100 text-blue-600 py-3 rounded-xl text-sm font-bold hover:bg-blue-200 transition-colors"
          >
            피드백 남기기
          </button>
        );
      case 'CREATOR':
        return (
          <button className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-xl text-sm font-bold cursor-default">
            모집중
          </button>
        );
      case 'JOINED':
        return (
          <button className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-xl text-sm font-bold cursor-default">
            신청 완료
          </button>
        );
      case 'DECLINED':
        return (
          <button className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-xl text-sm font-bold cursor-default">
            거절함
          </button>
        );
      case 'PENDING':
      default:
        return (
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onStatusChange?.(schedule.id, 'DECLINE')}
              className="flex-1 bg-white border border-blue-600 text-blue-600 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              불참
            </button>
            <button
              onClick={() => onStatusChange?.(schedule.id, 'JOIN')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              참여
            </button>
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-xl bg-white mb-4 last:mb-0">
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl w-[52px] h-[52px] shrink-0">
            <span className="text-[11px] text-gray-500 font-medium uppercase leading-none mb-0.5">
              {schedule.fullDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="text-xl font-bold text-gray-900 leading-none">
              {schedule.fullDate.getDate()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-gray-900 leading-none">
                {formatTime(schedule.fullDate)}
              </span>
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600 font-medium truncate">
              {schedule.title}
            </div>
            <div className="flex -space-x-1.5 mt-2">
              {joinedParticipants.slice(0, 4).map((p, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  {p.user?.avatarUrl ? (
                    <img src={p.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center ml-1">
                <span className="text-xs font-bold text-green-500">
                  {joinedCount}/{schedule.maxMembers}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl py-3 text-center mb-3">
          <div className="text-[11px] text-gray-500 mb-0.5">매칭완료까지</div>
          <div className="text-2xl font-black text-gray-900 tabular-nums tracking-tight">
            {timeLeft || '00 : 00 : 00'}
          </div>
        </div>

        {renderActionButtons()}
      </div>
    </Card>
  );
};
