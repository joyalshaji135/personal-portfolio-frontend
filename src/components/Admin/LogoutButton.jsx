import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Loader, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LogoutButton = ({ variant = 'default', className = '' }) => {
  const { logout, isLoggingOut, user } = useAuth();
  const { isDark } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setError('');
    try {
      await logout({ redirect: false });
      // Navigate after successful logout
      window.location.href = '/admin/login';
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  const handleLogoutClick = () => {
    if (variant === 'icon') {
      setShowConfirm(true);
    } else {
      setShowConfirm(true);
    }
  };

  const confirmLogout = async () => {
    await handleLogout();
  };

  const cancelLogout = () => {
    setShowConfirm(false);
    setError('');
  };

  // Icon variant
  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className={`p-2 rounded-lg transition-colors ${className}
            ${isDark 
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          title="Logout"
        >
          {isLoggingOut ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
        </button>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={cancelLogout}
            />
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              z-50 w-96 max-w-[90vw] rounded-xl p-6 border shadow-xl
              ${isDark 
                ? 'bg-[#111111] border-gray-800' 
                : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center
                  ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
                >
                  <LogOut size={28} className="text-red-500" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Confirm Logout
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.name ? `Are you sure you want to logout ${user.name}?` : 'Are you sure you want to logout?'}
                </p>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={cancelLogout}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors
                      ${isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                      hover:bg-red-600 transition-colors disabled:opacity-50 
                      flex items-center justify-center gap-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <>
      <button
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${isDark 
            ? 'hover:bg-red-500/10 text-gray-300 hover:text-red-400' 
            : 'hover:bg-red-50 text-gray-700 hover:text-red-500'
          } ${className}`}
      >
        {isLoggingOut ? (
          <>
            <Loader size={18} className="animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            <LogOut size={18} />
            Logout
          </>
        )}
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={cancelLogout}
          />
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            z-50 w-96 max-w-[90vw] rounded-xl p-6 border shadow-xl
            ${isDark 
              ? 'bg-[#111111] border-gray-800' 
              : 'bg-white border-gray-200'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center
                ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
              >
                <LogOut size={28} className="text-red-500" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Confirm Logout
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {user?.name ? `Are you sure you want to logout ${user.name}?` : 'Are you sure you want to logout?'}
              </p>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors
                    ${isDark 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                    hover:bg-red-600 transition-colors disabled:opacity-50 
                    flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LogoutButton;