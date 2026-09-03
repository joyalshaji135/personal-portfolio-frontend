import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  UserCircle,
  ChevronRight,
  ChevronDown,
  Home,
  Code,
  BookOpen,
  Sparkles,
  Cpu,
  Zap,
  TrendingUp,
  Layers,
  Plus,
  Search,
  Star,
  Briefcase,
  FolderGit2,
  Mail
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DevDocSidebar = ({ isOpen, isMobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedCategories, setExpandedCategories] = useState({
    'ai-tech': true, // Expanded by default
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Check if a route is active
  const isRouteActive = (path) => {
    return location.pathname.includes(path);
  };

  // Navigation handler
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Main navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dev-doc' },
    { id: 'profile', label: 'Profile', icon: UserCircle, path: '/dev-doc/profile' },
    { id: 'about', label: 'About', icon: BookOpen, path: '/dev-doc/about' },
    { id: 'experience', label: 'Experience', icon: Briefcase, path: '/dev-doc/experience' },
    { id: 'stack', label: 'Stack', icon: Layers, path: '/dev-doc/stack' },
    { id: 'project', label: 'Projects', icon: FolderGit2, path: '/dev-doc/project' },
    { id: 'contact', label: 'Contact', icon: Mail, path: '/dev-doc/contact' },
  ];

  // AI & Tech Updates items
  const aiTechItems = [
    { id: 'ai-tool-list', label: 'AI Tool List', icon: Sparkles, path: '/dev-doc/ai-tools' },
    { id: 'daily-tech-updates', label: 'Daily Technology Updates', icon: Zap, path: '/dev-doc/daily-tech-updates' },
    { id: 'roadmap-planner', label: 'Roadmap Planner', icon: TrendingUp, path: '/dev-doc/roadmap-planner' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => onClose && onClose()}
        />
      )}

      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 
          bg-[#111111] border-r border-gray-800 
          transition-all duration-300 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-80' : 'w-72'}
          ${!isMobile && !isOpen ? 'w-0' : ''}
        `}
      >
        <div className="p-4">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-8 h-8 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#27CBCB]" />
            </div>
            <span className="text-white font-semibold text-sm">Documentation</span>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 px-4 mb-2 font-medium">
              Main
            </p>
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-[#27CBCB]' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 text-[#27CBCB]" />}
                </button>
              );
            })}
          </nav>

          {/* AI & Tech Updates Section */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 px-4 mb-2 font-medium">
              AI & Tech Updates
            </p>
            <nav className="space-y-0.5">
              <div className="space-y-0.5">
                {/* AI & Tech Updates Category Header */}
                <button
                  onClick={() => toggleCategory('ai-tech')}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-[#27CBCB]" />
                  <span className="text-xs font-medium flex-1 text-left">AI & Tech Updates</span>
                  <span className="text-[10px] text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded">
                    {aiTechItems.length}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${expandedCategories['ai-tech'] ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedCategories['ai-tech'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-7 pl-3 border-l border-gray-800/50 space-y-0.5">
                        {aiTechItems.map((item) => {
                          const active = isRouteActive(item.path);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(item.path)}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200
                                ${active 
                                  ? 'bg-[#27CBCB]/10 text-[#27CBCB]' 
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                }`}
                            >
                              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="text-xs truncate">{item.label}</span>
                              {active && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#27CBCB] ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="px-4 py-3 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-500">Documentation Version</p>
              <p className="text-sm text-white font-medium">v2.0.0</p>
            </div>
            <div className="px-4 py-3 bg-gray-800/30 rounded-lg mt-2">
              <p className="text-xs text-gray-500">Total Updates</p>
              <p className="text-sm text-white font-medium">3</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <a 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Portfolio
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Code className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DevDocSidebar;