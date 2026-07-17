import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
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

// Async thunk for logout with API call
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout API to invalidate token on server
      if (refreshToken) {
        try {
          const config = {
            headers: {
              'x-api-key': API_KEY,
              'x-api-key-version': API_VERSION,
              'Content-Type': 'application/json',
            },
          };

          await axios.post(
            `${API_URL}admin/auth/logout`,
            { refreshToken },
            config
          );
        } catch (error) {
          // Even if API fails, we still want to clear local session
          console.warn('Logout API call failed:', error);
        }
      }
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      // Force logout even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
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
        return rejectWithValue('No refresh token available');
      }

      const config = {
        headers: {
          'x-api-key': API_KEY,
          'x-api-key-version': API_VERSION,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `${API_URL}admin/auth/refresh-token`,
        { refreshToken },
        config
      );

      if (response.data.status && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        return response.data.data;
      } else {
        return rejectWithValue('Failed to refresh token');
      }
    } catch (error) {
      // If refresh fails, logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

// REMOVED: checkSession async thunk - endpoint doesn't exist

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
      
      if (token && user) {
        state.accessToken = token;
        state.refreshToken = localStorage.getItem('refreshToken');
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.sessionExpired = false;
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    // Reset session expired flag
    resetSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload || 'Logout failed';
        state.logoutSuccess = true;
        state.isLoggingOut = false;
        state.sessionExpired = false;
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.sessionExpired = false;
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
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload || 'Session expired';
        state.sessionExpired = true;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      });
  },
});

export const { 
  clearErrors, 
  resetLoginSuccess, 
  resetLogoutSuccess,
  setUserFromStorage, 
  updateUser,
  forceLogout,
  resetSessionExpired
} = authSlice.actions;

export default authSlice.reducer;