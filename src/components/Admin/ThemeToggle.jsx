import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { value: 'dark', icon: Moon, label: 'Dark Mode' },
    { value: 'light', icon: Sun, label: 'Light Mode' },
    { value: 'system', icon: Monitor, label: 'System Default' }
  ];

  const getCurrentThemeIcon = () => {
    if (theme === 'dark') return Moon;
    if (theme === 'light') return Sun;
    return Monitor;
  };

  const CurrentIcon = getCurrentThemeIcon();

  const handleThemeChange = (newTheme) => {
    // For system theme, we need to detect system preference
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('adminTheme', prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
      // Also store system preference
      localStorage.setItem('adminThemePreference', 'system');
    } else {
      localStorage.setItem('adminTheme', newTheme);
      localStorage.setItem('adminThemePreference', 'manual');
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    // Close dropdown
    setIsOpen(false);
    // Force re-render
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#27CBCB] rounded-full"></span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Theme Settings
            </div>
            <div className="space-y-1">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[#27CBCB]/10 text-[#27CBCB] dark:bg-[#27CBCB]/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#27CBCB]' : ''}`} />
                    <span className="text-sm flex-1 text-left">{option.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 bg-[#27CBCB] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Current: <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{theme}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminTheme');
                  localStorage.removeItem('adminThemePreference');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', prefersDark);
                  setIsOpen(false);
                  window.dispatchEvent(new Event('storage'));
                }}
                className="text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
              >
                Reset to system
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;