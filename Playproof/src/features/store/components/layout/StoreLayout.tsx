// src/features/store/components/layout/StoreLayout.tsx
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비바 */}
      <Navbar />

      {/* 메인 컨텐츠 (사이드바 없이 중앙 정렬) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
