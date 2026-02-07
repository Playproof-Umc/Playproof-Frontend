// src/features/matching/components/write/WriteTagSection.tsx
import { TAGS } from '@/features/matching/constants/matchingConfig';

interface WriteTagSectionProps {
  selectedTags: string[];
  memo: string;
  onTagToggle: (tag: string) => void;
  setMemo: (val: string) => void;
}

export const WriteTagSection = ({ selectedTags, memo, onTagToggle, setMemo }: WriteTagSectionProps) => {
  return (
    <>
      <div className="space-y-2">
         <div className="flex items-center gap-2">
           <label className="text-sm font-bold text-gray-900">모집 태그</label>
           <span className="text-xs text-gray-500 font-medium">(1개 ~ 3개 선택)</span>
         </div>
         <div className="flex flex-wrap gap-2">
           {TAGS.map((tag) => (
             <button 
               key={tag} 
               onClick={() => onTagToggle(tag)} 
               className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                 selectedTags.includes(tag) 
                   ? 'bg-gray-900 border-gray-900 text-white' 
                   : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
               }`}
             >
               {tag}
             </button>
           ))}
         </div>
      </div>

      <div className="space-y-2">
         <label className="text-sm font-bold text-gray-900">메모 <span className="font-normal text-gray-400">(선택)</span></label>
         <textarea 
           rows={4} 
           placeholder="상대에게 원하는 조건을 적어보세요." 
           value={memo} 
           onChange={(e) => setMemo(e.target.value)} 
           className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black placeholder-gray-400 font-medium resize-none"
         />
      </div>
    </>
  );
};