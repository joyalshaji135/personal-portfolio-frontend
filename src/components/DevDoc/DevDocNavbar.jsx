import { useState } from 'react';
import { motion } from 'framer-motion';
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
  LayoutDashboard,
  Code
} from 'lucide-react';

const DevDocNavbar = ({ user, onLogout, currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'stack', label: 'Stack', icon: Layers },
    { id: 'project', label: 'Projects', icon: FolderGit2 },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (id) => currentPage === id;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#111111]/90 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#27CBCB]" />
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              Dev Docs
            </span>
            <span className="text-gray-500 text-sm hidden lg:block">
              v1.0.0
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm
                  ${isActive(item.id) 
                    ? 'bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center">
                <span className="text-black font-medium text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-300">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-gray-800 bg-[#111111] px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.id) 
                    ? 'bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-800 mt-2 pt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center">
                <span className="text-black font-medium text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-300 text-sm">{user?.name || 'User'}</span>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default DevDocNavbar;