// src/features/store/components/layout/StoreLayout.tsx
import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  return (
    <AppLayout>
      <div className="py-8">
        <main className="w-full">
          {children}
        </main>
      </div>
    </AppLayout>
  );
};
