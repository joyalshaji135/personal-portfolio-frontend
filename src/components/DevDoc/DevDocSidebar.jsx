import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  FolderGit2,
  Mail,
  ChevronRight,
  Home,
  Code,
  BookOpen
} from 'lucide-react';

const DevDocSidebar = ({ currentPage, onPageChange, isOpen, isMobile }) => {
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
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => onPageChange(currentPage)} // Close sidebar on click outside
        />
      )}

      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 
          bg-[#111111] border-r border-gray-800 
          transition-all duration-300 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-72' : 'w-64'}
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

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-[#27CBCB]/10 text-[#27CBCB] border border-[#27CBCB]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-[#27CBCB]' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 text-[#27CBCB]" />}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="px-4 py-3 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-500">Documentation Version</p>
              <p className="text-sm text-white font-medium">v1.0.0</p>
            </div>
            <div className="px-4 py-3 bg-gray-800/30 rounded-lg mt-2">
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm text-white font-medium">Today</p>
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