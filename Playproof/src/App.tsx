import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages (기존 및 신규)
import LandingPage from '@/pages/auth/LandingPage';
import SignupPage from '@/pages/auth/SignupPage'; 
import LoginPage from "@/pages/auth/LoginPage";
import AzitPage from "./pages/azit/AzitPage";
import MatchingPage from "@/pages/matching/MatchingPage";
import UserProfilePage from "@/pages/profile/UserProfilePage"; // [추가] 유저 상세 페이지

// Context Providers
import { UserProfileProvider } from '@/features/profile/context/UserProfileContext';
import { MatchingDetailProvider } from '@/features/matching/context/MatchingDetailContext';

// Global Modals
import { UserProfileModal } from '@/features/profile/components/UserProfileModal';
import { MatchingDetailModal } from '@/features/matching/components/MatchingDetailModal';

function App() {
  return (
    <BrowserRouter>
      {/* 1. 유저 프로필 관련 Provider */}
      <UserProfileProvider>
        {/* 2. 매칭 글 상세 보기 관련 Provider */}
        <MatchingDetailProvider>
          
          <Routes>
            {/* Auth Routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Game Select */}
            <Route path="/gameselect" element={<div>게임 선택 페이지 (TODO)</div>} />

            {/* Feature Routes */}
            <Route path="/azit" element={<AzitPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            
            {/* [추가] 유저 프로필 페이지 (클릭 시 이동할 타겟) */}
            <Route path="/user/:userId" element={<UserProfilePage />} />
          </Routes>

          {/* 3. 전역 모달 컴포넌트 배치 (Routes 밖) */}
          <UserProfileModal />
          <MatchingDetailModal />

        </MatchingDetailProvider>
      </UserProfileProvider>
    </BrowserRouter>
  );
}

export default App;