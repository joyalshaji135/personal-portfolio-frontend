import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LogOut, 
  User,
  Search,
  Bell,
  BookOpen,
  ChevronDown,
  Settings,
  HelpCircle,
  UserCircle,
  Activity,
  Shield,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DevDocHeader = ({ user, onLogout, onToggleSidebar, isSidebarOpen, isMobile, isLoggingOut }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get user email
  const getEmail = () => {
    return user?.email || 'user@example.com';
  };

  // Get user avatar - Fix Google avatar URL for larger size
  const getAvatar = () => {
    if (!user?.avatar) return null;
    
    let avatarUrl = user.avatar;
    if (avatarUrl.includes('s96-c')) {
      avatarUrl = avatarUrl.replace('s96-c', 's200-c');
    }
    return avatarUrl;
  };

  // Handle avatar load error
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Handle logout with loading state
  const handleLogout = async () => {
    if (logoutLoading) return;
    
    setLogoutLoading(true);
    setIsDropdownOpen(false);
    
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Get avatar component
  const renderAvatar = () => {
    const avatarUrl = getAvatar();
    
    if (avatarUrl && !avatarError) {
      return (
        <img 
          src={avatarUrl} 
          alt={getDisplayName()} 
          className="w-full h-full object-cover"
          onError={handleAvatarError}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    return (
      <span className="text-black font-medium text-sm">
        {getInitials(getDisplayName())}
      </span>
    );
  };

  // Get avatar for dropdown
  const renderDropdownAvatar = () => {
    const avatarUrl = getAvatar();
    
    if (avatarUrl && !avatarError) {
      return (
        <img 
          src={avatarUrl} 
          alt={getDisplayName()} 
          className="w-full h-full object-cover"
          onError={handleAvatarError}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    return (
      <span className="text-black font-medium text-sm">
        {getInitials(getDisplayName())}
      </span>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#111111]/95 backdrop-blur-lg border-b border-gray-800">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Logo */}
          <Link to="/dev-doc" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#27CBCB]" />
            </div>
            <span className="text-white font-semibold hidden sm:block">
              Dev Docs
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={logoutLoading}
            >
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {renderAvatar()}
              </div>
              <span className="text-gray-300 text-sm hidden sm:block">
                {getDisplayName()}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {renderDropdownAvatar()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {getEmail()}
                      </p>
                      {user?.provider && (
                        <p className="text-xs text-[#27CBCB] mt-0.5">
                          {user.provider === 'google' ? 'Connected with Google' : 'Local Account'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800/50 transition-colors text-sm">
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800/50 transition-colors text-sm">
                    <Activity className="w-4 h-4 text-gray-400" />
                    Activity
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800/50 transition-colors text-sm">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800/50 transition-colors text-sm">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    Help & Support
                  </button>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm">
                    <Shield className="w-4 h-4" />
                    Privacy
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {logoutLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 bg-[#111111] border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default DevDocHeader;