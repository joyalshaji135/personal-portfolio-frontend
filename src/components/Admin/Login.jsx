import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isDark] = useState(true); // Or get from theme context
  
  const { login, isLoading, error, loginSuccess, clearAuthErrors, resetLoginSuccessFlag } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthErrors();
      resetLoginSuccessFlag();
    };
  }, [clearAuthErrors, resetLoginSuccessFlag]);

  // Handle successful login
  useEffect(() => {
    if (loginSuccess) {
      resetLoginSuccessFlag();
      navigate(from, { replace: true });
    }
  }, [loginSuccess, navigate, from, resetLoginSuccessFlag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearAuthErrors();

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(credentials);
    } catch (err) {
      // Error is handled by the auth slice
      console.log('Login error:', err);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (localError) setLocalError('');
    if (error) clearAuthErrors();
  };

  // Display error message
  const displayError = localError || error;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300
      ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}
    >
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#27CBCB]/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-[#27CBCB]" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Login Form */}
        <div className={`rounded-2xl p-8 border transition-colors
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {displayError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{displayError}</span>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-3 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="joyaldefaultadmin@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-12 py-3 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-[#27CBCB] 
                    focus:ring-[#27CBCB] focus:ring-offset-0"
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#27CBCB] text-black font-semibold py-3 px-4 rounded-lg 
                hover:bg-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Demo Credentials:</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Email: joyaldefaultadmin@gmail.com
              </p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Password: joyalDefault@dmin
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;