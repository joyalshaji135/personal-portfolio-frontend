import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export const useSessionTimer = (timeoutMinutes = 30) => {
  const { logout } = useAuth();
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Set new timer
    timerRef.current = setTimeout(() => {
      // Auto logout after timeout
      logout({ redirect: true });
      // Show notification
      alert('Your session has expired due to inactivity.');
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      // Cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);
};