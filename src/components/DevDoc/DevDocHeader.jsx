import { useState } from 'react';
import { 
  Menu, 
  X, 
  LogOut, 
  User,
  Search,
  Bell,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DevDocHeader = ({ user, onLogout, onToggleSidebar, isSidebarOpen, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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

          {/* User Info */}
          <div className="flex items-center gap-2 ml-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center">
                <span className="text-black font-medium text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-300 text-sm hidden sm:block">
                {user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
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