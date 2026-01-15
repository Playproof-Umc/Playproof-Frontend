// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy Load Pages
const LandingPage = lazy(() => import('@/pages/auth/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const HomePage = lazy(() => import('@/pages/Home/HomePage')); 
const MatchingPage = lazy(() => import('@/pages/matching/MatchingPage'));
const AzitPage = lazy(() => import('@/pages/azit/AzitPage'));
const MyPageMain = lazy(() => import('@/pages/mypage/MyPageMain'));
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));
const CommunityPage = lazy(() => import('@/pages/Community/CommunityPage'));
const StorePage = lazy(() => import('@/pages/store/StorePage'));

// Context Providers
import { UserProfileProvider } from '@/features/profile/context/UserProfileContext';
import { MatchingDetailProvider } from '@/features/matching/context/MatchingDetailContext';
import { ToastProvider } from '@/features/notification/context/ToastContext';

// Global Modals
import { UserProfileModal } from '@/features/profile/components/UserProfileModal';
import { MatchingDetailModal } from '@/features/matching/components/MatchingDetailModal';

// 로딩 중 보여줄 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <div className="text-gray-400 text-sm font-bold">Loading...</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UserProfileProvider>
          <MatchingDetailProvider>
            
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Game Select */}
                <Route path="/gameselect" element={<div>게임 선택 페이지 (TODO)</div>} />

                {/* Feature Routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/azit" element={<AzitPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/community" element={<CommunityPage />} />
                
                {/* ✨ 스토어 라우트 추가 */}
                <Route path="/store" element={<StorePage />} />
                
                {/* 유저 프로필 페이지 */}
                <Route path="/user/:userId" element={<UserProfilePage />} />
                
                {/* 마이페이지 */}
                <Route path="/mypage/*" element={<MyPageMain />} />
              </Routes>
            </Suspense>

            {/* 전역 모달 */}
            <UserProfileModal />
            <MatchingDetailModal />

          </MatchingDetailProvider>
        </UserProfileProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;