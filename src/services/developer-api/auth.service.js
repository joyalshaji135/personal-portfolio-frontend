import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

// Create axios instance with headers
const apiClient = axiosInstance || axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'x-api-key-version': API_VERSION,
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Google OAuth Login
  googleLogin: () => {
    console.log('🚀 Redirecting to Google OAuth:', `${API_URL}developer/auth/google`);
    window.location.href = `${API_URL}developer/auth/google`;
  },

  // Handle OAuth Callback
  handleGoogleCallback: () => {
    console.log('🔐 Handling Google callback');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const userParam = params.get('user');
    
    console.log('📋 Callback params:', { 
      token: token ? '✅ Present' : '❌ Missing', 
      refreshToken: refreshToken ? '✅ Present' : '❌ Missing', 
      userParam: userParam ? '✅ Present' : '❌ Missing' 
    });

    if (token && refreshToken && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log('👤 User data received:', { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          provider: user.provider 
        });
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('💾 Auth data saved to localStorage');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return { user, token, refreshToken };
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        return null;
      }
    }
    
    console.log('❌ Missing required callback parameters');
    return null;
  },

  // Send OTP for Login
  sendOTP: async (email) => {
    try {
      const response = await apiClient.post('/developer/auth/send-otp', { email });
      return response.data;
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error.response?.data || error;
    }
  },

  // Verify OTP and Login
  verifyOTP: async (email, otp) => {
    try {
      const response = await apiClient.post('/developer/auth/verify-otp', { email, otp });
      
      if (response.data.status && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error.response?.data || error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await apiClient.post('/developer/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      console.error('Resend OTP Error:', error);
      throw error.response?.data || error;
    }
  },

  // Register User
  register: async (userData) => {
    try {
      const response = await apiClient.post('/developer/auth/register', userData);
      
      if (response.data.status && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Register Error:', error);
      throw error.response?.data || error;
    }
  },

  // Login with Password
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/developer/auth/login', credentials);
      
      if (response.data.status && response.data.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error.response?.data || error;
    }
  },

  // Refresh Token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/developer/auth/refresh-token', {
      refreshToken
    });

    if (response.data.status) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data.data;
    }
    throw new Error('Failed to refresh token');
  },

  // Logout
  logout: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await apiClient.post('/developer/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      console.log('👋 User logged out');
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token');
    }

    const response = await apiClient.get('/developer/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    const isAuth = !!(token && user);
    console.log('🔐 Auth check:', isAuth ? '✅ Authenticated' : '❌ Not authenticated');
    return isAuth;
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};