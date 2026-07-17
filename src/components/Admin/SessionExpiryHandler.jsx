import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetSessionExpired, forceLogout } from '../../store/slices/authSlice';

const SessionExpiryHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionExpired, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (sessionExpired && isAuthenticated) {
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-semibold">Session Expired</p>
            <p class="text-sm opacity-90 mt-1">Your session has expired. You will be redirected to login.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      // Remove notification after 4 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 4000);

      // Reset session expired flag and logout
      setTimeout(() => {
        dispatch(resetSessionExpired());
        dispatch(forceLogout());
        navigate('/admin/login', { state: { expired: true } });
      }, 2000);
    }
  }, [sessionExpired, isAuthenticated, dispatch, navigate]);

  return null;
};

export default SessionExpiryHandler;