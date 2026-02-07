// src/features/team/components/azit/NextMatchBox.tsx

//src/features/team/components/azit/NextMatchBox.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';

interface Props {
  nextMatchDate: Date | null;
}

export const NextMatchBox: React.FC<Props> = ({ nextMatchDate }) => {
  const [timeLeft, setTimeLeft] = useState("00 : 00 : 00");

  useEffect(() => {
    // 일정이 없으면 중단
    if (!nextMatchDate) return;

    // 타이머 함수 정의
    const updateTimer = () => {
      const now = new Date();
      const diff = nextMatchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00 : 00 : 00");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 00:00:00 포맷 맞추기
        setTimeLeft(
          `${h} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`
        );
      }
    };

    // 즉시 1번 실행 (화면 깜빡임 방지) 후 1초마다 반복
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    // 청소 (Clean-up)
    return () => clearInterval(timer);
  }, [nextMatchDate]);

  return (
    <section>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">Next match</h3>
      </div>
      <Card className="p-6 text-center">
        <div className="text-gray-500 text-sm font-medium mb-2">일정 시작까지</div>
        <div className="text-4xl font-bold font-mono text-gray-900 tracking-tight">
          {timeLeft}
        </div>
      </Card>
    </section>
  );
};
