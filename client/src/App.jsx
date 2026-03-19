import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavigationArrows from './components/NavigationArrows';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PostRequest from './pages/PostRequest';
import RequestsList from './pages/RequestsList';
import RequestDetails from './pages/RequestDetails';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import ChatPage from './pages/ChatPage';
import PlannerPackages from './pages/PlannerPackages';
import QuickHire from './pages/QuickHire';
import ServiceHistory from './pages/ServiceHistory';

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Navbar />
      <NavigationArrows />
      <AuthModal />
      <main className="flex-grow w-full relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-request" element={<PostRequest />} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/planner-package" element={<PlannerPackages />} />
          <Route path="/quick-hire" element={<QuickHire />} />
          <Route path="/service-history" element={<ServiceHistory />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default App;
