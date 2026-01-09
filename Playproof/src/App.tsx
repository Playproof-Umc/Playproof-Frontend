import HomePage from "./pages/Home/HomePage";
import CommunityPage from "./pages/Community/CommunityPage";

function App() {
  // TODO: 나중에 React Router로 교체
  const currentPath = window.location.pathname;

  if (currentPath === "/community") {
    return <CommunityPage />;
  }

  return <HomePage />;
}

export default App;



