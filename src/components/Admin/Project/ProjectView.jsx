import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FolderGit2,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Share2,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Tag,
  Layers,
  Lightbulb,
  Code,
  Star,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useProject } from '../../../hooks/useProject';
import { useTheme } from '../../../context/ThemeContext';

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, isLoading, error, getById, deleteProject, clearError, clearCurrent } = useProject();
  const { isDark } = useTheme();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [imageError, setImageError] = useState(false);

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
      console.error('Error fetching project:', error);
      setLocalError('Failed to load project');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setDeleteLoading(true);
      try {
        await deleteProject(id);
        navigate('/admin/project');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
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
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error || localError || !currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || localError || 'Project not found'}</p>
          <button
            onClick={() => {
              clearError();
              navigate('/admin/project');
            }}
            className="mt-4 px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
          >
            Back to Project List
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
            onClick={() => navigate('/admin/project')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Project Details
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View project information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/project/edit/${currentProject._id}`}
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
        {/* Project Header */}
        <div className={`rounded-xl overflow-hidden border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          {/* Image */}
          <div className={`relative h-64 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {currentProject.projectImage && !imageError ? (
              <img 
                src={currentProject.projectImage} 
                alt={currentProject.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={64} className="text-gray-500" />
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t ${currentProject.accent || 'from-[#27CBCB]/40'} to-transparent`} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-white">{currentProject.title}</h2>
              <p className="text-white/80 text-lg">{currentProject.subtitle}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm
                ${isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                <Tag size={14} className="inline mr-1" />
                {currentProject.category?.name || 'N/A'}
              </span>
              {currentProject.github && (
                <a
                  href={currentProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors flex items-center gap-1"
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}
              {currentProject.live && (
                <a
                  href={currentProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {currentProject.description && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Description
            </h3>
            <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentProject.description}
            </p>
          </div>
        )}

        {/* Detailed Description */}
        {currentProject.detailedDescription && currentProject.detailedDescription.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Detailed Description
            </h3>
            <ul className="space-y-2">
              {currentProject.detailedDescription.map((item, index) => (
                <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle size={16} className="text-[#27CBCB] mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlights */}
        {currentProject.highlights && currentProject.highlights.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.highlights.map((item, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                  ${isDark 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-blue-100 text-blue-600 border border-blue-200'
                  }`}
                >
                  <Star size={14} className="text-yellow-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        {currentProject.tech && currentProject.tech.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.tech.map((item, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                  ${isDark 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-purple-100 text-purple-600 border border-purple-200'
                  }`}
                >
                  <Code size={14} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {currentProject.features && currentProject.features.length > 0 && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.features.map((item, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                  ${isDark 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-green-100 text-green-600 border border-green-200'
                  }`}
                >
                  <Zap size={14} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Challenge & Solution */}
        {(currentProject.challenge || currentProject.solution) && (
          <div className={`rounded-xl p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Challenge & Solution
            </h3>
            <div className="space-y-4">
              {currentProject.challenge && (
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Lightbulb size={14} className="inline mr-1" />
                    Challenge
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentProject.challenge}
                  </p>
                </div>
              )}
              {currentProject.solution && (
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Zap size={14} className="inline mr-1" />
                    Solution
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentProject.solution}
                  </p>
                </div>
              )}
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
                  {formatDate(currentProject.createdAt)}
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
                  {formatDate(currentProject.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to={`/admin/project/edit/${currentProject._id}`}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg 
              hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit Project
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
            onClick={() => navigate('/admin/project')}
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

export default ProjectView;