import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail,
  User,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Share2,
  MessageSquare,
  Reply,
  Send
} from 'lucide-react';
import { useUserMessages } from '../../../hooks/useUserMessages';
import { useTheme } from '../../../context/ThemeContext';

const UserMessagesView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentMessage, isLoading, error, getById, clearCurrent, clearError } = useUserMessages();
  const { isDark } = useTheme();
  const [replyMode, setReplyMode] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
    return () => {
      clearCurrent();
    };
  }, [id]);

  const fetchData = async () => {
    try {
      await getById(id);
    } catch (error) {
      console.error('Error fetching message:', error);
      setLocalError('Failed to load message');
    }
  };

  const handleReply = () => {
    setReplyMode(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    // In real implementation, this would send the reply
    alert('Reply sent successfully!');
    setReplyMessage('');
    setReplyMode(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading message...
          </p>
        </div>
      </div>
    );
  }

  if (error || localError || !currentMessage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || localError || 'Message not found'}</p>
          <button
            onClick={() => {
              clearError();
              navigate('/admin/user-messages');
            }}
            className="mt-4 px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/user-messages')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Message Details
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View message from {currentMessage.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center gap-2"
          >
            <Reply size={18} />
            Reply
          </button>
          <button className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
            ${isDark 
              ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Message Header */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${isDark ? 'bg-[#27CBCB]/20' : 'bg-[#27CBCB]/10'}`}
                    >
                      <User size={24} className="text-[#27CBCB]" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentMessage.name || 'Anonymous'}
                      </h2>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentMessage.email || 'No email provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock size={14} className="inline mr-1" />
                    {formatDate(currentMessage.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MessageSquare size={20} className="inline mr-2 text-[#27CBCB]" />
            Message
          </h3>
          <div className={`p-4 rounded-lg border
            ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
          >
            <p className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentMessage.message}
            </p>
          </div>
        </div>

        {/* Reply Section */}
        {replyMode && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800 border-[#27CBCB]/30' : 'bg-white border-gray-200 border-[#27CBCB]/30'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Reply to {currentMessage.name}
            </h3>
            <div className="space-y-4">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="5"
                className={`w-full border rounded-lg px-4 py-3 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder={`Type your reply to ${currentMessage.name}...`}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  className="px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center gap-2"
                >
                  <Send size={18} />
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setReplyMode(false);
                    setReplyMessage('');
                  }}
                  className={`px-6 py-2.5 rounded-lg transition-colors
                    ${isDark 
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <button
            onClick={handleReply}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg 
              hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2"
          >
            <Reply size={18} />
            Reply to Message
          </button>
          <button
            onClick={() => window.print()}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2
              ${isDark 
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => navigate('/admin/user-messages')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg transition-colors
              ${isDark 
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMessagesView;