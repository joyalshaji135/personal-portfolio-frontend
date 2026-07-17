import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail,
  MessageSquare,
  Link as LinkIcon,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { useContact } from '../../../hooks/useContact';
import { useTheme } from '../../../context/ThemeContext';

const ContactView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentContact, isLoading, error, getById, deleteContact, clearError, clearCurrent } = useContact();
  const { isDark } = useTheme();
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      console.error('Error fetching contact:', error);
      setLocalError('Failed to load contact');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact entry?')) {
      setDeleteLoading(true);
      try {
        await deleteContact(id);
        navigate('/admin/contact');
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const getSocialIcon = (iconName) => {
    switch(iconName?.toLowerCase()) {
      case 'github': return <Github size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'linkedin': return <Linkedin size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'twitter': return <Twitter size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'youtube': return <Youtube size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'instagram': return <Instagram size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'facebook': return <Facebook size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      case 'website': return <Globe size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
      default: return <LinkIcon size={24} className="text-gray-400 group-hover:text-white transition-colors" />;
    }
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
            Loading contact...
          </p>
        </div>
      </div>
    );
  }

  if (error || localError || !currentContact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || localError || 'Contact not found'}</p>
          <button
            onClick={() => {
              clearError();
              navigate('/admin/contact');
            }}
            className="mt-4 px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
          >
            Back to Contact List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/contact')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Details
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View contact information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/contact/edit/${currentContact._id}`}
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
        {/* Contact Header */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center
              ${isDark ? 'bg-[#27CBCB]/20' : 'bg-[#27CBCB]/10'}`}
            >
              <Mail size={40} className="text-[#27CBCB]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentContact.heading || 'N/A'}
                  </h2>
                  {currentContact.description && (
                    <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {currentContact.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {currentContact.socials && currentContact.socials.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <LinkIcon size={20} className="inline mr-2 text-[#27CBCB]" />
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentContact.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-4 rounded-lg border transition-all
                    ${isDark 
                      ? 'border-gray-700 hover:border-[#27CBCB] hover:bg-gray-800/50' 
                      : 'border-gray-200 hover:border-[#27CBCB] hover:bg-gray-50'
                    }`}
                >
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    {getSocialIcon(social.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {social.name}
                    </p>
                    {social.description && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {social.description}
                      </p>
                    )}
                    <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {social.url}
                    </p>
                  </div>
                  <ExternalLink size={18} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} group-hover:text-[#27CBCB] transition-colors`} />
                </a>
              ))}
            </div>
          </div>
        )}

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
                  {formatDate(currentContact.createdAt)}
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
                  {formatDate(currentContact.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to={`/admin/contact/edit/${currentContact._id}`}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg 
              hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit Contact
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
            onClick={() => navigate('/admin/contact')}
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

export default ContactView;