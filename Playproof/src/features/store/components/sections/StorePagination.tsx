// src/features/store/components/sections/StorePagination.tsx
import { ChevronDown, MoreHorizontal } from 'lucide-react';

export const StorePagination = () => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 text-sm font-medium text-gray-500">
      <div className="flex items-center gap-6">
         <span className="text-black font-bold border-b-2 border-black pb-0.5">1</span>
         <span>10</span>
         <ChevronDown size={12} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-2">
         <button className="w-8 h-8 flex items-center justify-center text-blue-500 font-bold">1</button>
         <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">2</button>
         <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">3</button>
         <span className="w-8 h-8 flex items-center justify-center"><MoreHorizontal size={16}/></span>
         <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">10</button>
         <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">11</button>
         <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">12</button>
      </div>
      
      <button className="text-gray-400 hover:text-gray-600 text-xs ml-4">
         페이지로 가기
      </button>
    </div>
  );
};
