import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, Chrome, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../../services/developer-api/auth.service';

const DevDocLogin = ({ onLogin, onGoogleLogin, onSwitchToRegister, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [otpData, setOtpData] = useState({
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setOtpError('');
    setOtpSuccess('');
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpData(prev => ({ ...prev, [name]: value }));
    setOtpError('');
    setOtpSuccess('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOTP = async () => {
    const email = formData.email || otpData.email;
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Invalid email format' });
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const response = await authService.sendOTP(email);
      if (response.status) {
        setOtpSent(true);
        setOtpSuccess('OTP sent to your email!');
        setResendCountdown(60);
        setOtpData(prev => ({ ...prev, email }));
        startCountdown();
      } else {
        setOtpError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError(error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpData.otp || otpData.otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoginLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const response = await authService.verifyOTP(otpData.email, otpData.otp);
      if (response.status) {
        setOtpSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onLogin({ email: otpData.email, password: '' });
        }, 1500);
      } else {
        setOtpError(response.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError(error.message || 'Failed to verify OTP');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;

    try {
      const response = await authService.resendOTP(otpData.email);
      if (response.status) {
        setOtpSuccess('New OTP sent!');
        setResendCountdown(60);
        startCountdown();
      } else {
        setOtpError(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setOtpError(error.message || 'Failed to resend OTP');
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoginLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const response = await authService.login(formData);
      if (response.status) {
        setOtpSuccess('Login successful!');
        setTimeout(() => {
          onLogin(formData);
        }, 1000);
      } else {
        setOtpError(response.message || 'Login failed');
      }
    } catch (error) {
      setOtpError(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const toggleOtpMode = () => {
    setOtpMode(!otpMode);
    setOtpSent(false);
    setOtpError('');
    setOtpSuccess('');
    setOtpData({ email: '', otp: '' });
    setFormData({ ...formData, password: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#111111] border border-gray-800 rounded-2xl p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400">Sign in to access documentation</p>
        </div>
      </div>

      {otpMode ? (
        // OTP Login Mode
        <div className="space-y-4">
          {!otpSent ? (
            // Send OTP Form
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={otpData.email}
                  onChange={handleOtpChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              {otpError && <p className="text-red-400 text-xs mt-1">{otpError}</p>}
              {otpSuccess && <p className="text-green-400 text-xs mt-1">{otpSuccess}</p>}
              
              <button
                onClick={handleSendOTP}
                disabled={otpLoading}
                className="w-full mt-3 py-2.5 bg-[#27CBCB] text-black font-semibold rounded-lg hover:bg-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </button>
            </div>
          ) : (
            // Verify OTP Form
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>OTP sent to <span className="text-white">{otpData.email}</span></span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                  maxLength="6"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                  placeholder="000000"
                />
              </div>
              
              {otpError && <p className="text-red-400 text-xs">{otpError}</p>}
              {otpSuccess && <p className="text-green-400 text-xs">{otpSuccess}</p>}
              
              <button
                onClick={handleVerifyOTP}
                disabled={loginLoading}
                className="w-full mt-3 py-2.5 bg-[#27CBCB] text-black font-semibold rounded-lg hover:bg-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Verify & Login
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handleResendOTP}
                  disabled={resendCountdown > 0}
                  className="text-sm text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                </button>
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtpError('');
                    setOtpSuccess('');
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={toggleOtpMode}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to password login
            </button>
          </div>
        </div>
      ) : (
        // Password Login Mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-900/50 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2.5 bg-[#27CBCB] text-black font-semibold rounded-lg hover:bg-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loginLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleOtpMode}
              className="text-sm text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
            >
              Login with OTP instead
            </button>
          </div>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#111111] text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        <Chrome className="w-5 h-5 text-[#27CBCB]" />
        <span className="text-gray-300">Sign in with Google</span>
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-sm text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
        >
          Don't have an account? Register
        </button>
      </div>
    </motion.div>
  );
};

export default DevDocLogin;