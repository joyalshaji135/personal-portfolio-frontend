import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Briefcase, 
  User,
  Tag,
  FileText,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { usePortfolio } from '../../../hooks/usePortfolio';
import { useRole } from '../../../hooks/useRole';
import { useTheme } from '../../../context/ThemeContext';

const PortfolioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPortfolio, isLoading, isSubmitting, error, getById, update, clearError, clearSuccess, success } = usePortfolio();
  const { roles, getAll: getAllRoles, isLoading: rolesLoading } = useRole();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    titleName: '',
    role: '',
    taglines: [],
    description: ''
  });
  const [newTagline, setNewTagline] = useState('');
  const [localError, setLocalError] = useState('');

  // Fetch roles and portfolio data on mount
  useEffect(() => {
    if (id) {
      fetchData();
    }
    fetchRoles();
  }, [id]);

  // Populate form when data is loaded
  useEffect(() => {
    if (currentPortfolio && currentPortfolio._id === id) {
      setFormData({
        titleName: currentPortfolio.titleName || '',
        role: currentPortfolio.role?._id || currentPortfolio.role || '',
        taglines: currentPortfolio.taglines || [],
        description: currentPortfolio.description || ''
      });
    }
  }, [currentPortfolio, id]);

  // Clear success after navigation
  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/portfolio');
    }
  }, [success, navigate, clearSuccess]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const fetchData = async () => {
    try {
      await getById(id);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setLocalError('Failed to load portfolio');
    }
  };

  const fetchRoles = async () => {
    try {
      await getAllRoles();
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleAddTagline = () => {
    if (newTagline.trim() && !formData.taglines.includes(newTagline.trim())) {
      setFormData(prev => ({
        ...prev,
        taglines: [...prev.taglines, newTagline.trim()]
      }));
      setNewTagline('');
    }
  };

  const handleRemoveTagline = (taglineToRemove) => {
    setFormData(prev => ({
      ...prev,
      taglines: prev.taglines.filter(tag => tag !== taglineToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validate required fields
    if (!formData.titleName.trim()) {
      setLocalError('Name is required');
      return;
    }
    if (!formData.role) {
      setLocalError('Role is required');
      return;
    }
    if (formData.taglines.length === 0) {
      setLocalError('At least one tagline is required');
      return;
    }
    if (!formData.description.trim()) {
      setLocalError('Description is required');
      return;
    }

    try {
      await update(id, formData);
    } catch (err) {
      setLocalError(err || 'Failed to update portfolio. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/portfolio')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Portfolio
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Update portfolio entry
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 
            transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
              Updating...
            </>
          ) : (
            <>
              <Save size={18} />
              Update Portfolio
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Errors */}
        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error || localError}</span>
          </div>
        )}

        {/* Portfolio Information */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Portfolio Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="titleName"
                  value={formData.titleName}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="e.g., Joyal Shaji"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Role *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {rolesLoading && (
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Loading roles...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Taglines */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Taglines *
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTagline}
              onChange={(e) => setNewTagline(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTagline())}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add a tagline..."
            />
            <button
              type="button"
              onClick={handleAddTagline}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 
                transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.taglines.map((tagline, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Tag size={14} className="text-[#27CBCB]" />
                {tagline}
                <button
                  type="button"
                  onClick={() => handleRemoveTagline(tagline)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.taglines.length === 0 && (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No taglines added yet
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Description *
          </h2>
          <div>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
                className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="Describe the portfolio entry..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="text-red-400">*</span> Required fields
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/admin/portfolio')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2 bg-[#27CBCB] text-black rounded-lg 
                  hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2 
                  disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PortfolioEdit;