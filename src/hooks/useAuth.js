import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  loginUser, 
  logoutUser, 
  clearErrors, 
  resetLoginSuccess,
  resetLogoutSuccess,
  updateUser,
  forceLogout,
  resetSessionExpired
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    isLoggingOut,
    error, 
    loginSuccess,
    logoutSuccess,
    sessionExpired,
    accessToken,
    refreshToken 
  } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      if (result) {
        navigate('/admin/dashboard');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (options = { redirect: true }) => {
    try {
      await dispatch(logoutUser()).unwrap();
      if (options.redirect !== false) {
        navigate('/admin/login');
      }
      return true;
    } catch (error) {
      // Even if logout fails, we want to clear state
      if (options.redirect !== false) {
        navigate('/admin/login');
      }
      return false;
    }
  };

  const logoutAndClear = async () => {
    // Force logout with all cleanup
    dispatch(forceLogout());
    navigate('/admin/login');
  };

  // REMOVED: verifySession function

  const clearAuthErrors = () => {
    dispatch(clearErrors());
  };

  const resetLoginSuccessFlag = () => {
    dispatch(resetLoginSuccess());
  };

  const resetLogoutSuccessFlag = () => {
    dispatch(resetLogoutSuccess());
  };

  const resetSessionExpiredFlag = () => {
    dispatch(resetSessionExpired());
  };

  const updateUserProfile = (userData) => {
    dispatch(updateUser(userData));
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoggingOut,
    error,
    loginSuccess,
    logoutSuccess,
    sessionExpired,
    accessToken,
    refreshToken,
    login,
    logout,
    logoutAndClear,
    clearAuthErrors,
    resetLoginSuccessFlag,
    resetLogoutSuccessFlag,
    resetSessionExpiredFlag,
    updateUserProfile,
  };
};