import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, Chrome } from 'lucide-react';
import { useState } from 'react';

const DevDocLogin = ({ onLogin, onGoogleLogin, onSwitchToRegister, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onLogin({ email: formData.email, password: formData.password });
    }
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
          disabled={isLoading}
          className="w-full py-2.5 bg-[#27CBCB] text-black font-semibold rounded-lg hover:bg-[#27CBCB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

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