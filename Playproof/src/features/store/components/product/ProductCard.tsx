// src/features/store/components/product/ProductCard.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Product } from '@/features/store/types';

interface ProductCardProps {
  product: Product;
  userPoint?: number;    // 유저 현재 금액(원)
  isLoggedIn?: boolean;  // 로그인 여부
  userMembershipLevel?: string; // 유저 멤버십 등급
}

export const ProductCard = ({ 
  product, 
  userPoint = 0, 
  isLoggedIn = false,
  userMembershipLevel = 'NORMAL' 
}: ProductCardProps) => {

  // 구매하기 버튼 로직
  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 비로그인 체크
    if (!isLoggedIn) {
      if (confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
        // navigate('/login'); // 실제 코드에서는 주석 해제
        alert('로그인 페이지 이동');
      }
      return;
    }

    
    if (product.isOwned) {
      alert('이미 보유 중인 상품이에요.');
      return;
    }

    // 멤버십 체크
    if (product.requiredMembership && userMembershipLevel !== 'VIP') {
      if (confirm('멤버십 전용 상품이에요.\n멤버십 안내 페이지로 이동하시겠습니까?')) {
        alert('멤버십 안내 페이지 이동');
      }
      return;
    }

    // 금액 부족 체크
    if (userPoint < product.price) {
      if (confirm('금액이 부족해요.\n충전 페이지로 이동하시겠습니까?')) {
        alert('충전 페이지 이동');
      }
      return;
    }

    // 정상 결제 시도
    if (confirm(`${product.title} 상품을 구매하시겠습니까?\n₩${product.price.toLocaleString()}가 차감됩니다.`)) {
      // TODO: 서버 결제 API 호출
      // if (success) ...
      // else: 6-f. 서버 오류
      // alert('구매에 실패했어요. 다시 시도해 주세요.');
      
      alert('구매가 완료되었습니다!');
    }
  };

  return (
    <Card className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
         <img 
            src={product.imageSrc} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" 
         />
      </div>

      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">아이템</span>
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-lg font-bold text-gray-900">₩{product.price.toLocaleString()}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <button 
            className={`flex-1 h-10 text-sm font-bold rounded transition-colors ${
              product.isOwned 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#2C2C34] text-white hover:bg-black'
            }`}
            onClick={handlePurchase}
          >
            {product.isOwned ? '보유중' : '구매하기'}
          </button>
          
          <button 
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
            onClick={(e) => { e.stopPropagation(); alert('장바구니 담기'); }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
