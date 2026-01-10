
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// develop 브랜치의 페이지들 (로그인/회원가입)
import LandingPage from '@/pages/auth/LandingPage';
import SignupPage from '@/pages/auth/SignupPage'; 
import LoginPage from "@/pages/auth/LoginPage";

import HomePage from "@/pages/Home/HomePage";
import CommunityPage from "@/pages/Community/CommunityPage";
// feat/azit-init_Elric 브랜치의 페이지 (아지트)
import AzitPage from "./pages/azit/AzitPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기존 Auth 관련 라우트 (develop) */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/gameselect" element={<div>게임 선택 페이지 (TODO)</div>} />
        <Route path="/community" element={<CommunityPage />} />
        {/* 새로 추가한 아지트 라우트 (feat) */}
        <Route path="/azit" element={<AzitPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;