import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  Briefcase, 
  Layers, 
  FolderGit2, 
  Mail,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  LayoutDashboard,
  Code,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import DevDocAuth from '../components/DevDoc/DevDocAuth';
import DevDocRegister from '../components/DevDoc/DevDocRegister';
import DevDocLogin from '../components/DevDoc/DevDocLogin';
import DevDocDashboard from '../components/DevDoc/DevDocDashboard';
import DevDocAbout from '../components/DevDoc/DevDocAbout';
import DevDocExperience from '../components/DevDoc/DevDocExperience';
import DevDocStack from '../components/DevDoc/DevDocStack';
import DevDocProject from '../components/DevDoc/DevDocProject';
import DevDocContact from '../components/DevDoc/DevDocContact';
import DevDocSidebar from '../components/DevDoc/DevDocSidebar';
import DevDocHeader from '../components/DevDoc/DevDocHeader';
import DevDocFooter from '../components/DevDoc/DevDocFooter';
import Background from '../components/ui/Background';

const DevDoc = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('devDocUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setShowAuth(false);
    }

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

  const handleRegister = (userData) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('devDocUser', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      setShowAuth(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = (credentials) => {
    setIsLoading(true);
    setTimeout(() => {
      const savedUser = localStorage.getItem('devDocUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === credentials.email) {
          setUser(userData);
          setIsAuthenticated(true);
          setShowAuth(false);
          setIsLoading(false);
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
      setUser(newUser);
      setIsAuthenticated(true);
      setShowAuth(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('devDocUser');
    setUser(null);
    setIsAuthenticated(false);
    setShowAuth(true);
    setCurrentPage('dashboard');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                onSwitchToRegister={() => setAuthMode('register')}
                isLoading={isLoading}
              />
            ) : (
              <DevDocRegister 
                key="register"
                onRegister={handleRegister}
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
      
      {/* Header */}
      <DevDocHeader 
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
      />

      {/* Sidebar + Main Content */}
      <div className="flex pt-16">
        <DevDocSidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={isSidebarOpen}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 min-h-[calc(100vh-120px)]
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}
          ${isMobile ? 'ml-0' : ''}
        `}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {currentPage === 'dashboard' && <DevDocDashboard key="dashboard" user={user} />}
              {currentPage === 'about' && <DevDocAbout key="about" />}
              {currentPage === 'experience' && <DevDocExperience key="experience" />}
              {currentPage === 'stack' && <DevDocStack key="stack" />}
              {currentPage === 'project' && <DevDocProject key="project" />}
              {currentPage === 'contact' && <DevDocContact key="contact" />}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <DevDocFooter />
    </div>
  );
};

export default DevDoc;