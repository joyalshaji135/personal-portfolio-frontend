import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleGoogleCallback, setUserFromStorage } from '../store/slices/authGoogleSlice';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔐 Auth callback page loaded');
      console.log('📍 Location:', location.pathname);
      console.log('🔍 Search params:', location.search);
      
      try {
        // Check if it's an error callback
        if (location.pathname === '/auth/error') {
          console.log('❌ Error callback detected');
          setError('Authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        // Dispatch the callback handler
        const result = await dispatch(handleGoogleCallback()).unwrap();
        console.log('📦 Callback result:', result);
        
        if (result) {
          console.log('✅ Authentication successful!');
          setSuccess(true);
          setLoading(false);
          
          // Redirect to dev doc page after a short delay
          setTimeout(() => {
            console.log('🚀 Redirecting to /dev-doc');
            navigate('/dev-doc', { replace: true });
          }, 1500);
        } else {
          console.log('❌ No user data received');
          setError('Authentication failed. No user data received.');
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Auth callback error:', err);
        setError(err || 'Authentication failed. Please try again.');
        setLoading(false);
      }
    };

    handleCallback();
  }, [dispatch, navigate, location]);

  // If already authenticated, redirect to dev-doc immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ Already authenticated, redirecting to /dev-doc');
      navigate('/dev-doc', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className="text-gray-400 mt-4">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white">Authentication Successful!</h2>
          <p className="text-gray-400 mt-2">Welcome, {user?.name || 'User'}!</p>
          <p className="text-gray-500 text-sm mt-1">Redirecting to dashboard...</p>
          <div className="mt-6 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#27CBCB] rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white">Authentication Failed</h2>
          <p className="text-red-400 mt-2">{error}</p>
          <div className="mt-6 flex flex-col gap-3 justify-center">
            <button
              onClick={() => navigate('/dev-doc')}
              className="px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors font-medium"
            >
              Go to Dev Doc
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;