// src/features/store/components/ProductCard.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white flex flex-col group cursor-pointer">
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img 
          src={product.imageSrc} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.tags.map(tag => (
              <span key={tag} className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
            {product.title}
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-gray-500">P</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Button 
            className="w-full h-9 text-sm font-bold bg-gray-900 hover:bg-gray-800 text-white"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 방지
              alert(`${product.title} 구매!`);
            }}
          >
            구매하기
          </Button>
        </div>
      </div>
    </Card>
  );
};
