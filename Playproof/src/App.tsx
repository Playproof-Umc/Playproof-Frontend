// src/App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Lazy Load Pages
const LandingPage = lazy(() => import('@/pages/auth/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const SignupGameSelectPage = lazy(() => import('@/pages/auth/SignupGameSelectPage'));
const SignupGameInfoPage = lazy(() => import('@/pages/auth/SignupGameInfoPage'));
const SignupUsernamePage = lazy(() => import('@/pages/auth/SignupUsernamePage'));
const FindPasswordPage = lazy(() => import('@/pages/auth/FindPasswordPage'));
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const MatchingPage = lazy(() => import('@/pages/matching/MatchingPage'));
const AzitPage = lazy(() => import('@/pages/azit/AzitPage'));
const MyPageMain = lazy(() => import('@/pages/mypage/MyPageMain'));
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));

const CommunityPage = lazy(() => import('@/pages/Community/CommunityPage'));
const GameDataPage = lazy(() => import('@/pages/mypage/GameData'));
const PostDetailPage = lazy(() => import('@/pages/Community/PostDetailPage'));
const StorePage = lazy(() => import('@/pages/store/StorePage'));

// Context Providers
import { UserProfileProvider } from '@/features/profile/context/UserProfileContext';
import { MatchingDetailProvider } from '@/features/matching/context/MatchingDetailContext';
import { ToastProvider } from '@/features/notification/context/ToastContext';

// Global Modals (모달은 미리 로드해두거나 필요 시 분리 가능, 여기선 유지)
import { UserProfileModal } from '@/features/profile/components';
import { MatchingDetailModal } from '@/features/matching/components';

// 로딩 중 보여줄 컴포넌트 (간단한 스피너나 텍스트)
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <div className="text-gray-400 text-sm font-bold">Loading...</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
                <Route path="/signup/username" element={<SignupUsernamePage />} />
                <Route path="/find-password" element={<FindPasswordPage />} />
                
                {/* Game Select */}
                <Route path="/gameselect" element={<SignupGameSelectPage />} />
                <Route path="/gameinfo" element={<SignupGameInfoPage />} />

                {/* Feature Routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/azit" element={<AzitPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                
                {/* Community Routes */}
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/:postId" element={<PostDetailPage />} />
                
                {/* 유저 프로필 페이지 */}
                <Route path="/user/:userId" element={<UserProfilePage />} />
                
                {/* 마이페이지 */}
                <Route path="/mypage/*" element={<MyPageMain />} />
                <Route path="/mypage/gamedata" element={<GameDataPage />} />

                {/* 스토어 */}
                <Route path="/store" element={<StorePage />} />
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

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.search]);
  return null;
};

export default App;
