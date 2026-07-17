import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit2, 
  User, 
  Code2, 
  Briefcase,
  Mail,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Bell,
  GraduationCap,
  Shield,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { isDark } = useTheme();
  const location = useLocation();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto expand menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const menuMap = {
      '/admin/role': 'profile',
      '/admin/portfolio': 'profile',
      '/admin/category': 'project',
      '/admin/project': 'project',
      '/admin/education': 'qualification',
      '/admin/experience': 'qualification',
    };

    for (const [path, menu] of Object.entries(menuMap)) {
      if (currentPath.startsWith(path)) {
        setExpandedMenus(prev => ({ ...prev, [menu]: true }));
        break;
      }
    }
  }, [location.pathname]);

  // Navigation structure with dropdowns
  const navStructure = [
    { 
      path: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      isDropdown: false
    },
    { 
      path: '/admin/about', 
      icon: User, 
      label: 'About',
      isDropdown: false
    },
    { 
      path: '/admin/contact', 
      icon: Mail, 
      label: 'Contact',
      isDropdown: false
    },
    { 
      path: '/admin/stack', 
      icon: Code2, 
      label: 'Stack',
      isDropdown: false
    },
    { 
      key: 'profile',
      icon: Users, 
      label: 'Profile',
      isDropdown: true,
      children: [
        { path: '/admin/role', icon: Shield, label: 'Role' },
        { path: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' }
      ]
    },
    { 
      key: 'project',
      icon: FolderGit2, 
      label: 'Project',
      isDropdown: true,
      children: [
        { path: '/admin/category', icon: FolderTree, label: 'Category' },
        { path: '/admin/project', icon: Layers, label: 'Project' }
      ]
    },
    { 
      key: 'qualification',
      icon: GraduationCap, 
      label: 'Qualification',
      isDropdown: true,
      children: [
        { path: '/admin/education', icon: Award, label: 'Education' },
        { path: '/admin/experience', icon: Briefcase, label: 'Experience' }
      ]
    },
    { path: '/admin/user-messages', icon: MessageSquare, label: 'User Messages' }
  ];

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isChildActive = (children) => {
    return children?.some(child => isPathActive(child.path));
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300
      ${isDark ? 'bg-[#0A0A0A] text-gray-300' : 'bg-gray-50 text-gray-800'}`}
    >
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full transition-all duration-300 z-50 overflow-y-auto
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}
          border-r
          ${isMobile 
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72` 
            : `${isSidebarOpen ? 'w-64' : 'w-20'}`
          }`}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between p-4 border-b 
          ${isDark ? 'border-gray-800 bg-[#111111]' : 'border-gray-200 bg-white'}
          sticky top-0 z-10`}
        >
          <div className={`flex items-center gap-2 ${!isSidebarOpen && !isMobile && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#27CBCB] font-bold text-xl">A</span>
            </div>
            {(isSidebarOpen || isMobile) && (
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Admin
              </span>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className={`p-1 rounded-lg transition-colors
              ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {isMobile ? (
              <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            ) : (
              isSidebarOpen ? 
                <ChevronLeft size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} /> : 
                <ChevronRight size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navStructure.map((item) => {
            if (!item.isDropdown) {
              // Regular menu item (no dropdown)
              const isActive = isPathActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? `bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20 
                         ${isDark ? '' : 'shadow-sm'}`
                      : `${isDark ? 'hover:bg-gray-800/50 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`
                    } ${!isSidebarOpen && !isMobile && 'justify-center px-2'}`}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  {(isSidebarOpen || isMobile) && <span>{item.label}</span>}
                </Link>
              );
            }

            // Dropdown menu item
            const isExpanded = expandedMenus[item.key];
            const hasActiveChild = isChildActive(item.children);
            const isOpen = isExpanded || hasActiveChild;

            return (
              <div key={item.key} className="space-y-1">
                {/* Dropdown Header */}
                <button
                  onClick={() => {
                    if (isSidebarOpen || isMobile) {
                      toggleMenu(item.key);
                    } else {
                      // If sidebar is collapsed, expand it
                      if (!isSidebarOpen && !isMobile) {
                        setIsSidebarOpen(true);
                      }
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${hasActiveChild 
                      ? `bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20`
                      : `${isDark ? 'hover:bg-gray-800/50 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`
                    } ${!isSidebarOpen && !isMobile && 'justify-center px-2'}`}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  {(isSidebarOpen || isMobile) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </>
                  )}
                </button>

                {/* Dropdown Children */}
                {(isSidebarOpen || isMobile) && isOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700/30 pl-2">
                    {item.children.map((child) => {
                      const isChildActive = isPathActive(child.path);
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => isMobile && setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                            ${isChildActive 
                              ? `bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20`
                              : `${isDark ? 'hover:bg-gray-800/50 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`
                            }`}
                        >
                          <child.icon size={16} className="min-w-[16px]" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t 
          ${isDark ? 'border-gray-800 bg-[#111111]' : 'border-gray-200 bg-white'}`}
        >
          <div className={`flex items-center gap-3 mb-3 ${!isSidebarOpen && !isMobile && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Admin User
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  admin@portfolio.com
                </p>
              </div>
            )}
          </div>
          
          {/* Logout Button - Sidebar */}
          <LogoutButton 
            variant="default" 
            className={`w-full justify-center ${!isSidebarOpen && !isMobile && 'justify-center'}`}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen
        ${isMobile 
          ? 'ml-0' 
          : isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <div className={`sticky top-0 z-30 px-4 py-3 border-b
          ${isDark 
            ? 'bg-[#111111]/80 backdrop-blur-lg border-gray-800' 
            : 'bg-white/80 backdrop-blur-lg border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors
                  ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <Menu size={24} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            )}
            
            <div className="flex items-center gap-3 ml-auto">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Notifications */}
              <button className={`p-2 rounded-lg transition-colors relative
                ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <Bell size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Logout Button - Top Bar */}
              <LogoutButton variant="icon" />

              {/* User Avatar - Mobile */}
              {isMobile && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;