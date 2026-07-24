import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authService } from '../../services/developer-api/auth.service';

// Async thunk for Google OAuth Login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      authService.googleLogin();
      return { redirecting: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

// Async thunk for handling Google OAuth Callback
export const handleGoogleCallback = createAsyncThunk(
  'auth/handleGoogleCallback',
  async (_, { rejectWithValue }) => {
    try {
      const result = authService.handleGoogleCallback();
      if (result) {
        const { user, token, refreshToken } = result;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        return { user, accessToken: token, refreshToken };
      }
      return rejectWithValue('No user data received');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to handle callback');
    }
  }
);

// Async thunk for admin login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
      const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

      const config = {
        headers: {
          'x-api-key': API_KEY,
          'x-api-key-version': API_VERSION,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `${API_URL}admin/auth/login`,
        credentials,
        config
      );

      if (response.data.status && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || 'Login failed. Please try again.'
        );
      }
      return rejectWithValue('Network error. Please check your connection.');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
        const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

        const config = {
          headers: {
            'x-api-key': API_KEY,
            'x-api-key-version': API_VERSION,
            'Authorization': `Bearer ${accessToken}`,
          },
        };

        await axios.post(`${API_URL}admin/auth/logout`, {}, config);
      }
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      return true;
    } catch (error) {
      // Force logout even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Async thunk for refreshing token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
        { refreshToken }
      );

      if (response.data.status && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        return { accessToken, refreshToken: newRefreshToken };
      }
      return rejectWithValue('Failed to refresh token');
    } catch (error) {
      // If refresh fails, logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Failed to get user');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggingOut: false,
  error: null,
  loginSuccess: false,
  logoutSuccess: false,
  sessionExpired: false,
  isGoogleRedirect: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },
    
    // Reset login success flag
    resetLoginSuccess: (state) => {
      state.loginSuccess = false;
    },
    
    // Reset logout success flag
    resetLogoutSuccess: (state) => {
      state.logoutSuccess = false;
    },
    
    // Set user from localStorage (for app initialization)
    setUserFromStorage: (state) => {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated');
      
      if (token && user && isAuth === 'true') {
        state.accessToken = token;
        state.refreshToken = localStorage.getItem('refreshToken');
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.sessionExpired = false;
        state.isLoggingOut = false;
        console.log('✅ Auth state restored from localStorage');
        return true;
      } else {
        console.log('❌ No valid session found in localStorage');
        return false;
      }
    },
    
    // Update user profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    
    // Force logout (for session expiry)
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionExpired = true;
      state.isLoggingOut = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
    
    // Reset session expired flag
    resetSessionExpired: (state) => {
      state.sessionExpired = false;
    },
    
    // Set Google redirect flag
    setGoogleRedirect: (state, action) => {
      state.isGoogleRedirect = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Google Login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isGoogleRedirect = true;
        state.isLoggingOut = false;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.isGoogleRedirect = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google login failed';
        state.isGoogleRedirect = false;
        state.isLoggingOut = false;
      })

    // Handle Google Callback
    .addCase(handleGoogleCallback.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isLoggingOut = false;
    })
    .addCase(handleGoogleCallback.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loginSuccess = true;
      state.error = null;
      state.isGoogleRedirect = false;
      state.isLoggingOut = false;
      console.log('✅ Google OAuth login successful');
    })
    .addCase(handleGoogleCallback.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to authenticate';
      state.isGoogleRedirect = false;
      state.isLoggingOut = false;
      console.log('❌ Google OAuth login failed:', action.payload);
    })

    // Admin Login
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.loginSuccess = false;
      state.isLoggingOut = false;
      state.sessionExpired = false;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loginSuccess = true;
      state.error = null;
      state.logoutSuccess = false;
      state.sessionExpired = false;
      state.isLoggingOut = false;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload || 'Login failed';
      state.loginSuccess = false;
      state.isLoggingOut = false;
      state.sessionExpired = false;
    })

    // Logout
    .addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.isLoggingOut = true;
      state.logoutSuccess = false;
      state.error = null;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.loginSuccess = false;
      state.logoutSuccess = true;
      state.isLoggingOut = false;
      state.sessionExpired = false;
      state.isGoogleRedirect = false;
      console.log('✅ Logout successful');
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload || 'Logout failed';
      state.logoutSuccess = true; // Still consider it success since we cleared local storage
      state.isLoggingOut = false;
      state.sessionExpired = false;
      state.isGoogleRedirect = false;
      console.log('⚠️ Logout completed with error:', action.payload);
    })

    // Refresh Token
    .addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
      state.sessionExpired = false;
      state.isLoggingOut = false;
    })
    .addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
      state.error = null;
      state.sessionExpired = false;
      state.isLoggingOut = false;
    })
    .addCase(refreshToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload || 'Session expired';
      state.sessionExpired = true;
      state.isLoggingOut = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    })

    // Get Current User
    .addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.isLoggingOut = false;
    })
    .addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoggingOut = false;
    })
    .addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to get user';
      state.isAuthenticated = false;
      state.isLoggingOut = false;
    });
  },
});

// Export actions
export const { 
  clearErrors, 
  resetLoginSuccess, 
  resetLogoutSuccess,
  setUserFromStorage, 
  updateUser,
  forceLogout,
  resetSessionExpired,
  setGoogleRedirect
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;