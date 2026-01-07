import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LandingPage from '@/pages/auth/LandingPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from "@/pages/auth/LoginPage"

function App() {
  return (
    <>
    {/*
    <div className="text-3xl font-bold text-blue-500 underline">
        PlayProof 초기 페이지
      </div>
    */}
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gameselect" element={<div>게임 선택 페이지 (TODO)</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


