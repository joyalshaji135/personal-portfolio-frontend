import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Share2,
  AlertCircle,
  Tag,
  Quote,
  FileText,
  Eye,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { useAbout } from '../../../hooks/useAbout';
import { useTheme } from '../../../context/ThemeContext';

const AboutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAbout, isLoading, error, getById, deleteAbout, clearError, clearCurrent } = useAbout();
  const { isDark } = useTheme();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [miniImageError, setMiniImageError] = useState(false);

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
      console.error('Error fetching about data:', error);
      setLocalError('Failed to load about entry');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this about entry?')) {
      setDeleteLoading(true);
      try {
        await deleteAbout(id);
        navigate('/admin/about');
      } catch (error) {
        console.error('Error deleting about:', error);
        alert('Failed to delete about entry. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMiniImageError = () => {
    setMiniImageError(true);
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border bg-gray-500/10 text-gray-400 border-gray-500/20`}>
          <Clock size={14} />
          No Status
        </span>
      );
    }

    const statusConfig = {
      active: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Active' },
      draft: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Draft' },
      archived: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Archived' }
    };

    // Check if status matches predefined values
    const lowerStatus = status.toLowerCase();
    let config = statusConfig.draft;

    if (lowerStatus.includes('active') || lowerStatus.includes('working') || lowerStatus.includes('available')) {
      config = statusConfig.active;
    } else if (lowerStatus.includes('archived') || lowerStatus.includes('inactive')) {
      config = statusConfig.archived;
    }

    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${config.bg} ${config.color} ${config.border}`}>
        <Icon size={14} />
        {status}
      </span>
    );
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

  // Get file name from URL
  const getFileName = (url) => {
    if (!url) return 'No file';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'No file';
  };

  // Get file extension
  const getFileExtension = (url) => {
    if (!url) return '';
    const fileName = getFileName(url);
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext || '';
  };

  // Check if file is PDF
  const isPDF = (url) => {
    return getFileExtension(url) === 'pdf';
  };

  // Check if file is image
  const isImage = (url) => {
    const ext = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  // Get file icon based on extension
  const getFileIcon = (url) => {
    const ext = getFileExtension(url);
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📑';
    if (['zip', 'rar'].includes(ext)) return '📦';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
    return '📎';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading about entry...
          </p>
        </div>
      </div>
    );
  }

  if (error || localError || !currentAbout) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || localError || 'About entry not found'}</p>
          <button
            onClick={() => {
              clearError();
              navigate('/admin/about');
            }}
            className="mt-4 px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
          >
            Back to About List
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
            onClick={() => navigate('/admin/about')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400 hover:text-white" />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              About Details
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View about section profile
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/about/edit/${currentAbout._id}`}
            className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-2"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
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
        {/* Profile Card */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center border-2 overflow-hidden
                ${isDark ? 'border-[#27CBCB]/20' : 'border-[#27CBCB]/30'}`}
              >
                {currentAbout.avatarUrl && !imageError ? (
                  <img 
                    src={currentAbout.avatarUrl} 
                    alt={currentAbout.name} 
                    className="w-full h-full rounded-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center
                    ${isDark ? 'bg-[#27CBCB]/20' : 'bg-[#27CBCB]/10'}`}
                  >
                    <User size={48} className="text-[#27CBCB]" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentAbout.name || 'N/A'}
                  </h2>
                  <p className="text-[#27CBCB] text-lg">{currentAbout.title || 'N/A'}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Tag size={16} />
                      @{currentAbout.handle || 'N/A'}
                    </span>
                    <span className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={16} />
                      {currentAbout.location || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(currentAbout.status)}
                </div>
              </div>

              {/* Mini Avatar */}
              {currentAbout.miniAvatarUrl && !miniImageError && (
                <div className="flex items-center gap-2 mt-4">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Mini Avatar:
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                    <img 
                      src={currentAbout.miniAvatarUrl} 
                      alt="Mini Avatar" 
                      className="w-full h-full object-cover"
                      onError={handleMiniImageError}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Heading & Highlight */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Heading
          </h3>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentAbout.heading || 'N/A'}
            {currentAbout.headingHighlight && (
              <span className="text-[#27CBCB]"> {currentAbout.headingHighlight}</span>
            )}
          </p>
        </div>

        {/* Intro */}
        {currentAbout.intro && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Introduction
            </h3>
            <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentAbout.intro}
            </p>
          </div>
        )}

        {/* Quote */}
        {currentAbout.quote && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start gap-3">
              <Quote size={24} className="text-[#27CBCB] flex-shrink-0" />
              <p className={`text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentAbout.quote}
              </p>
            </div>
          </div>
        )}

        {/* Interests */}
        {currentAbout.interests && currentAbout.interests.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAbout.interests.map((interest, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm
                  ${isDark 
                    ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume Section - Enhanced Preview */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Resume
          </h3>
          
          {currentAbout.resumeUrl ? (
            <div className="space-y-4">
              {/* Resume Preview Card */}
              <div className={`p-4 rounded-lg border
                ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* File Icon */}
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl
                    ${isDark ? 'bg-[#27CBCB]/10' : 'bg-[#27CBCB]/10'}`}
                  >
                    {getFileIcon(currentAbout.resumeUrl)}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-[150px]">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {getFileName(currentAbout.resumeUrl)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {getFileExtension(currentAbout.resumeUrl).toUpperCase() || 'File'}
                      </span>
                      {isPDF(currentAbout.resumeUrl) && (
                        <span className="text-xs text-red-400">📄 PDF Document</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={currentAbout.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Eye size={16} />
                      View
                    </a>
                    <a
                      href={currentAbout.resumeUrl}
                      download
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm
                        ${isDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </div>
              </div>

              {/* PDF Preview (if PDF) */}
              {isPDF(currentAbout.resumeUrl) && (
                <div className={`p-4 rounded-lg border
                  ${isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      PDF Preview
                    </span>
                    <a
                      href={currentAbout.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors text-sm flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      Open Full Screen
                    </a>
                  </div>
                  <div className={`rounded-lg overflow-hidden border
                    ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <embed
                      src={`${currentAbout.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-96"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                </div>
              )}

              {/* Image Preview (if image file) */}
              {isImage(currentAbout.resumeUrl) && (
                <div className={`p-4 rounded-lg border
                  ${isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Image Preview
                    </span>
                  </div>
                  <div className={`rounded-lg overflow-hidden border
                    ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <img
                      src={currentAbout.resumeUrl}
                      alt="Resume Preview"
                      className="w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              )}

              {/* File URL */}
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="font-medium">File URL:</span>
                <a 
                  href={currentAbout.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`ml-2 hover:text-[#27CBCB] transition-colors truncate inline-block max-w-full`}
                >
                  {currentAbout.resumeUrl}
                </a>
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>No resume uploaded</p>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg
              ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}
            >
              <Calendar size={18} className="text-gray-500" />
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Created</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatDate(currentAbout.createdAt)}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg
              ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}
            >
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Last Updated</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatDate(currentAbout.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to={`/admin/about/edit/${currentAbout._id}`}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg 
              hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit Entry
          </Link>
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
            onClick={() => navigate('/admin/about')}
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

export default AboutView;