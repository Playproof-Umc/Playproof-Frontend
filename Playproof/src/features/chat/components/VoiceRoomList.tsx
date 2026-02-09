// src/features/chat/components/VoiceRoomList.tsx

//src/features/chat/components/VoiceRoomList.tsx
import React from 'react';
import { Plus, Users, Volume2 } from 'lucide-react';
import type { Channel } from '@/features/team/types';
import { Card } from '@/components/ui/Card';

interface Props {
  voiceChannels: Channel[];
}

export const VoiceRoomList: React.FC<Props> = ({ voiceChannels }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="font-bold text-base text-gray-900">Voice Room</h3>
        <Plus className="w-5 h-5 text-gray-800 cursor-pointer hover:bg-gray-200 rounded-full p-0.5" />
      </div>
      
      <div className="space-y-3">
        {voiceChannels.map(ch => (
          
          <Card key={ch.id}>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
              <Volume2 className="w-5 h-5 text-gray-800" />
              <span className="text-sm font-bold text-gray-800">{ch.name}</span>
            </div>
            
            {/* 접속 유저 표시 */}
            {ch.connectedUsers && ch.connectedUsers.length > 0 && (
              <div className="pl-3 pb-3 pr-3 flex flex-col gap-2 border-t border-gray-50 pt-2">
                 {ch.connectedUsers.map(u => (
                   <div key={u.id} className="flex items-center gap-2">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} className="w-6 h-6 rounded-full bg-gray-300" alt=""/>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <Users className="w-3 h-3"/>
                        </div>
                      )}
                      <span className="text-sm text-gray-600">{u.nickname}</span>
                   </div>
                 ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};
