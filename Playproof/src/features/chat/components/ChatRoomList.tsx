// src/features/chat/components/ChatRoomList.tsx

//src/features/chat/components/ChatRoomList.tsx
import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import type { Channel } from '@/features/team/types';
import { Card } from '@/components/ui/Card';

interface Props {
  chatChannels: Channel[];
}

export const ChatRoomList: React.FC<Props> = ({ chatChannels }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">Chat Room</h3>
        <Plus className="w-5 h-5 text-gray-800 cursor-pointer hover:bg-gray-200 rounded-full p-0.5" />
      </div>
      
      <Card>
        <ul className="divide-y divide-gray-100">
          {chatChannels.map(ch => (
            <li key={ch.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
              <MessageSquare className="w-5 h-5 text-gray-800" />
              <span className="text-sm font-bold text-gray-800">{ch.name}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
};
