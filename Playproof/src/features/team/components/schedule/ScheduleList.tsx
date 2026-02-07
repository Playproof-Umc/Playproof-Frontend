// src/features/team/components/schedule/ScheduleList.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { Schedule } from '@/features/team/types';
import { Card } from '@/components/ui/Card';
import { ScheduleItem } from '@/features/team/components/azit/schedule/ScheduleItem';

interface Props {
  schedules: Schedule[];
  currentUserId: string;
}

export const ScheduleList: React.FC<Props> = ({ schedules, currentUserId }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">Schedule</h3>
      </div>

      <Card>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h4 className="font-bold text-sm text-gray-800">정기 매칭 일정</h4>
          <button className="hover:bg-gray-100 p-1 rounded transition">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {schedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </Card>
    </section>
  );
};
