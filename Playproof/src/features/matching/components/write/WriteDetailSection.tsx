// src/features/matching/components/write/WriteDetailSection.tsx
import { ChevronDown, Mic, MicOff } from 'lucide-react';
import { GAME_CONFIG, MY_AZITS } from '@/features/matching/constants/matchingConfig';

interface WriteDetailSectionProps {
  game: string;
  tier: string;
  azit: string;
  memberCount: number;
  micStatus: 'on' | 'off' | null;
  setTier: (val: string) => void;
  setAzit: (val: string) => void;
  setMemberCount: (val: number) => void;
  setMicStatus: (val: 'on' | 'off' | null) => void;
}

export const WriteDetailSection = ({ 
  game, tier, azit, memberCount, micStatus, 
  setTier, setAzit, setMemberCount, setMicStatus 
}: WriteDetailSectionProps) => {
  const currentConfig = GAME_CONFIG[game] || GAME_CONFIG['기타'];

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">티어</label>
            <div className="relative">
              <select 
                value={tier} 
                onChange={(e) => setTier(e.target.value)} 
                className={`w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer ${!tier ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <option value="" disabled>현재 티어를 선택해주세요.</option>
                {currentConfig.tiers.map(t => (<option key={t} value={t}>{t}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">아지트</label>
            <div className="relative">
              <select value={azit} onChange={(e) => setAzit(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:border-black font-medium cursor-pointer text-gray-900">
                <option value="new">➕ 신규 생성 (기본)</option>
                <optgroup label="내 아지트 목록">
                  {MY_AZITS.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
        </div>
      </div>

      <div className="flex items-end gap-4">
         <div className="flex-1 space-y-2">
            <label className="text-sm font-bold text-gray-900">모집 인원 (1명 이상)</label>
            <div className="flex items-center justify-between p-1 border border-gray-200 rounded-lg bg-gray-50">
              <button onClick={() => setMemberCount(Math.max(0, memberCount - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md font-bold text-lg">-</button>
              <span className={`font-bold ${memberCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{memberCount}</span>
              <button onClick={() => setMemberCount(memberCount + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md font-bold text-lg">+</button>
            </div>
         </div>
         <div className="flex gap-2 pb-1">
             <button onClick={() => setMicStatus(micStatus === 'on' ? null : 'on')} className={`p-3 rounded-lg border ${micStatus === 'on' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}><Mic size={20} /></button>
             <button onClick={() => setMicStatus(micStatus === 'off' ? null : 'off')} className={`p-3 rounded-lg border ${micStatus === 'off' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}><MicOff size={20} /></button>
         </div>
      </div>
    </>
  );
};