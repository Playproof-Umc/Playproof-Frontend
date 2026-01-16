
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// develop 브랜치의 페이지들 (로그인/회원가입)
import LandingPage from '@/pages/auth/LandingPage';
import SignupPage from '@/pages/auth/SignupPage'; 
import LoginPage from "@/pages/auth/LoginPage";
// 회원가입 step2 게임선택
import SignupGameSelectPage from './pages/auth/SingupGameSelectPage';
// 회원가입 step3 게임정보입력
import SignupGameInfo from './pages/auth/SignupGameInfoPage';
// 회원가입 완료 모달 라우트
import AppLayout from './components/layout/AppLayout';

import HomePage from "@/pages/Home/HomePage";
import CommunityPage from "@/pages/Community/CommunityPage";
// feat/azit-init_Elric 브랜치의 페이지 (아지트)
import AzitPage from "./pages/azit/AzitPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* 기존 Auth 관련 라우트 (develop) */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/gameselect" element={<SignupGameSelectPage />} />
        <Route path="/gameinfo" element={<SignupGameInfo />} />

        <Route path="/community" element={<CommunityPage />} />
        {/* 새로 추가한 아지트 라우트 (feat) */}
        <Route path="/azit" element={<AzitPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;