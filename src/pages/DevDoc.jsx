import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  LayoutDashboard,
  Code,
  ChevronRight,
  ChevronDown,
  UserCircle
} from 'lucide-react';
import { setUserFromStorage, logoutUser, googleLogin } from '../store/slices/authGoogleSlice';
import DevDocAuth from '../components/DevDoc/DevDocAuth';
import DevDocRegister from '../components/DevDoc/DevDocRegister';
import DevDocLogin from '../components/DevDoc/DevDocLogin';
import DevDocDashboard from '../components/DevDoc/DevDocDashboard';
import DevDocAbout from '../components/DevDoc/DevDocAbout';
import DevDocExperience from '../components/DevDoc/DevDocExperience';
import DevDocStack from '../components/DevDoc/DevDocStack';
import DevDocProject from '../components/DevDoc/DevDocProject';
import DevDocContact from '../components/DevDoc/DevDocContact';
import ProfileDashboard from '../components/DevDoc/Profile/ProfileDashboard';
import DevDocSidebar from '../components/DevDoc/DevDocSidebar';
import DevDocHeader from '../components/DevDoc/DevDocHeader';
import DevDocFooter from '../components/DevDoc/DevDocFooter';
import Background from '../components/ui/Background';
import AIToolManage from '../components/DevDoc/AIToolList/AIToolManage';
import AIToolCategory from '../components/DevDoc/AIToolList/AIToolCategory';
import AIToolSubCategory from '../components/DevDoc/AIToolList/AIToolSubCategory';
import AITool from '../components/DevDoc/AIToolList/AITool';

// Import AI Tool components


const DevDoc = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading, error, isLoggingOut } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const restored = dispatch(setUserFromStorage());
    console.log('📄 DevDoc - Auth check:', { restored, isAuthenticated, user });
  }, [dispatch]);

  // Update showAuth based on auth state
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowAuth(false);
      console.log('✅ User authenticated:', user.name);
    } else {
      setShowAuth(true);
    }
  }, [isAuthenticated, user]);

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update currentPage based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dev-doc/ai-tools')) {
      setCurrentPage('ai-tools');
    } else if (path.includes('/dev-doc/profile')) {
      setCurrentPage('profile');
    } else if (path === '/dev-doc' || path === '/dev-doc/') {
      setCurrentPage('dashboard');
    } else {
      // For other pages, extract from path
      const page = path.split('/dev-doc/')[1]?.split('/')[0];
      if (page) {
        setCurrentPage(page);
      }
    }
  }, [location]);

  const handleRegister = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem('devDocUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    dispatch(setUserFromStorage());
  };

  const handleLogin = (credentials) => {
    const savedUser = localStorage.getItem('devDocUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === credentials.email) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUserFromStorage());
        return;
      }
    }
    const newUser = {
      id: Date.now().toString(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem('devDocUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    dispatch(setUserFromStorage());
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/dev-doc');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // If not authenticated, show auth page
  if (!isAuthenticated && showAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#27CBCB]/10 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-[#27CBCB]" />
            </div>
            <h1 className="text-3xl font-bold text-white">Developer Documentation</h1>
            <p className="text-gray-400 mt-2">Access the complete technical documentation</p>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <DevDocLogin 
                key="login"
                onLogin={handleLogin}
                onGoogleLogin={handleGoogleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
                isLoading={isLoading}
              />
            ) : (
              <DevDocRegister 
                key="register"
                onRegister={handleRegister}
                onGoogleLogin={handleGoogleLogin}
                onSwitchToLogin={() => setAuthMode('login')}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300">
      <Background />
      
      <DevDocHeader 
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        isLoggingOut={isLoggingOut}
      />

      <div className="flex pt-16">
        <DevDocSidebar 
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={handleCloseSidebar}
        />

        <main className={`flex-1 transition-all duration-300 min-h-[calc(100vh-120px)]
          ${isSidebarOpen && !isMobile ? 'ml-72' : 'ml-0'}
          ${isMobile ? 'ml-0' : ''}
        `}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Main Dashboard */}
                <Route path="/" element={<DevDocDashboard user={user} />} />
                <Route path="/dashboard" element={<DevDocDashboard user={user} />} />
                
                {/* Profile */}
                <Route path="/profile" element={<ProfileDashboard user={user} />} />
                
                {/* Other Pages */}
                <Route path="/about" element={<DevDocAbout user={user} />} />
                <Route path="/experience" element={<DevDocExperience user={user} />} />
                <Route path="/stack" element={<DevDocStack user={user} />} />
                <Route path="/project" element={<DevDocProject user={user} />} />
                <Route path="/contact" element={<DevDocContact user={user} />} />
                
                {/* AI Tool Routes */}
                <Route path="/ai-tools" element={<AIToolManage />} />
                <Route path="/ai-tools/category" element={<AIToolCategory />} />
                <Route path="/ai-tools/category/:id" element={<AIToolCategory />} />
                <Route path="/ai-tools/sub-category" element={<AIToolSubCategory />} />
                <Route path="/ai-tools/sub-category/:id" element={<AIToolSubCategory />} />
                <Route path="/ai-tools/tool" element={<AITool />} />
                <Route path="/ai-tools/tool/:id" element={<AITool />} />
                <Route path="/ai-tools/tool/:id/edit" element={<AITool />} />
                
                {/* Catch all */}
                <Route path="*" element={<DevDocDashboard user={user} />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DevDocFooter />
    </div>
  );
};

export default DevDoc;