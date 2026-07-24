import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
        
        // Clean URL params
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

  // Logout
  logout: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await axiosInstance.post(`${API_URL}developer/auth/logout`, {}, {
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