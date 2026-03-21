import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Hide primary navbar/footer if in Obsidian Admin mode */}
      {!isAdminRoute && <Navbar />}
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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isChatPage && !isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
