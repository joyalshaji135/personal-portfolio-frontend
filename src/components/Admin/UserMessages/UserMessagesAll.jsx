import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Inbox,
  MessageSquare,
  User,
  Phone
} from 'lucide-react';
import { useUserMessages } from '../../../hooks/useUserMessages';
import { useTheme } from '../../../context/ThemeContext';

const UserMessagesAll = () => {
  const { messages, isLoading, error, getAll, clearError } = useUserMessages();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await getAll();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const filteredData = messages.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(currentItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchData();
            }}
            className="mt-4 px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            User Messages
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage messages from users and visitors
          </p>
        </div>
        <button 
          onClick={fetchData}
          className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2
            ${isDark 
              ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800' 
              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={18} className="text-[#27CBCB]" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</span>
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {messages.length}
            </span>
          </div>
        </div>
        <div className={`rounded-xl p-4 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today</span>
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {messages.filter(m => {
                const today = new Date();
                const msgDate = new Date(m.createdAt);
                return msgDate.toDateString() === today.toDateString();
              }).length}
            </span>
          </div>
        </div>
        <div className={`rounded-xl p-4 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={18} className="text-purple-400" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Unique</span>
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {new Set(messages.map(m => m.email)).size}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`rounded-xl p-4 mb-6 border
        ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
            />
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={() => {
                setSelectedItems([]);
              }}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm flex items-center gap-2"
            >
              Clear Selection ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-[#27CBCB] 
                      focus:ring-[#27CBCB] focus:ring-offset-0"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-gray-200'}`}>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare size={48} className="text-gray-600" />
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No messages found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item._id} className={`transition-colors ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelectItem(item._id)}
                        className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-[#27CBCB] 
                          focus:ring-[#27CBCB] focus:ring-offset-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.name || 'Anonymous'}
                        </p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {item.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div>
                        <p className={`text-sm truncate max-w-[300px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="text-sm">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {formatDate(item.createdAt)}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/user-messages/view/${item._id}`}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                          title="View"
                        >
                          <Eye size={18} className="text-gray-400 hover:text-white" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t 
            ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} messages
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <ChevronLeft size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-lg transition-colors ${
                    currentPage === index + 1
                      ? 'bg-[#27CBCB] text-black'
                      : isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <ChevronRight size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessagesAll;