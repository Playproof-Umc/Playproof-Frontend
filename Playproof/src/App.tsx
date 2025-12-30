import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LandingPage from '@/pages/LoginSignupPages/LandingPage';
import SignupPage from './pages/LoginSignupPages/SignupPage';
import LoginPage from "@/pages/LoginSignupPages/LoginPage"

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


