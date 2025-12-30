//src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AzitPage from "./pages/azit/AzitPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 아지트 페이지 라우트 추가 */}
        <Route path="/azit" element={<AzitPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;