import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  FolderGit2,
  FileText,
  Tag,
  Calendar,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Plus,
  X,
  AlertCircle,
  Layers,
  Lightbulb,
  Code,
  Star,
  Zap
} from 'lucide-react';
import { useProject } from '../../../hooks/useProject';
import { useCategory } from '../../../hooks/useCategory';
import { useTheme } from '../../../context/ThemeContext';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, isLoading, isSubmitting, error, getById, update, clearError, clearSuccess, success } = useProject();
  const { categories, getAll: getAllCategories, isLoading: categoriesLoading } = useCategory();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    description: '',
    detailedDescription: [],
    highlights: [],
    tech: [],
    features: [],
    github: '',
    live: '',
    projectImage: null,
    challenge: '',
    solution: '',
    accent: 'from-[#27CBCB]/40',
    removeImage: false
  });

  const [newDetailedDesc, setNewDetailedDesc] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (currentProject && currentProject._id === id) {
      setFormData({
        title: currentProject.title || '',
        subtitle: currentProject.subtitle || '',
        category: currentProject.category?._id || currentProject.category || '',
        description: currentProject.description || '',
        detailedDescription: currentProject.detailedDescription || [],
        highlights: currentProject.highlights || [],
        tech: currentProject.tech || [],
        features: currentProject.features || [],
        github: currentProject.github || '',
        live: currentProject.live || '',
        projectImage: null,
        challenge: currentProject.challenge || '',
        solution: currentProject.solution || '',
        accent: currentProject.accent || 'from-[#27CBCB]/40',
        removeImage: false
      });
      
      if (currentProject.projectImage) {
        setImagePreview(currentProject.projectImage);
      }
    }
  }, [currentProject, id]);

  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/project');
    }
  }, [success, navigate, clearSuccess]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const fetchData = async () => {
    try {
      await getById(id);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLocalError('Failed to load project');
    }
  };

  const fetchCategories = async () => {
    try {
      await getAllCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        projectImage: file,
        removeImage: false
      }));
      setHasImageChanged(true);
      setLocalError('');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      projectImage: null,
      removeImage: true
    }));
    setHasImageChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelImageUpload = () => {
    if (currentProject?.projectImage) {
      setImagePreview(currentProject.projectImage);
      setFormData(prev => ({
        ...prev,
        projectImage: null,
        removeImage: false
      }));
    } else {
      setImagePreview(null);
    }
    setHasImageChanged(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = (field, value, setter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const handleRemoveItem = (field, itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== itemToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.title.trim()) {
      setLocalError('Title is required');
      return;
    }
    if (!formData.category) {
      setLocalError('Category is required');
      return;
    }
    if (!formData.description.trim()) {
      setLocalError('Description is required');
      return;
    }

    try {
      const submitData = { ...formData };
      if (!submitData.projectImage && !submitData.removeImage) {
        delete submitData.projectImage;
        delete submitData.removeImage;
      }
      await update(id, submitData);
    } catch (err) {
      setLocalError(err || 'Failed to update project. Please try again.');
    }
  };

  const accentOptions = [
    'from-[#27CBCB]/40',
    'from-blue-500/40',
    'from-purple-500/40',
    'from-pink-500/40',
    'from-orange-500/40',
    'from-green-500/40',
    'from-red-500/40',
    'from-indigo-500/40'
  ];

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/project')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Project
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Update project details
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
              Update Project
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error || localError}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Title *
              </label>
              <div className="relative">
                <FolderGit2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="Project Name"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="Project Subtitle"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="Brief description..."
              />
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Detailed Description
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newDetailedDesc}
              onChange={(e) => setNewDetailedDesc(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('detailedDescription', newDetailedDesc, setNewDetailedDesc))}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add detailed description point..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('detailedDescription', newDetailedDesc, setNewDetailedDesc)}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.detailedDescription.map((item, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <FileText size={14} className="text-[#27CBCB]" />
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('detailedDescription', item)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Highlights
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('highlights', newHighlight, setNewHighlight))}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add highlight..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('highlights', newHighlight, setNewHighlight)}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.highlights.map((item, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-blue-100 text-blue-600 border border-blue-200'
                }`}
              >
                <Star size={14} className="text-yellow-400" />
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('highlights', item)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Technologies
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('tech', newTech, setNewTech))}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add technology..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('tech', newTech, setNewTech)}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tech.map((item, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-purple-100 text-purple-600 border border-purple-200'
                }`}
              >
                <Code size={14} />
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('tech', item)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Features
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('features', newFeature, setNewFeature))}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add feature..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('features', newFeature, setNewFeature)}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((item, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-green-100 text-green-600 border border-green-200'
                }`}
              >
                <Zap size={14} />
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('features', item)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Links
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                <Github size={16} className="inline mr-2" />
                GitHub URL
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                <ExternalLink size={16} className="inline mr-2" />
                Live URL
              </label>
              <input
                type="url"
                name="live"
                value={formData.live}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="https://project-live-url.com"
              />
            </div>
          </div>
        </div>

        {/* Project Image */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Project Image
          </h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className={`w-40 h-40 rounded-lg border-2 border-dashed 
              flex items-center justify-center overflow-hidden
              ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Project" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-gray-500" />
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No image
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2
                    ${isDark 
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <Plus size={18} />
                    {imagePreview && !formData.removeImage ? 'Change Image' : 'Upload Image'}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {(imagePreview || formData.removeImage) && (
                  <button
                    type="button"
                    onClick={formData.removeImage ? handleCancelImageUpload : handleRemoveImage}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                      ${formData.removeImage 
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                  >
                    {formData.removeImage ? (
                      <>
                        <X size={18} />
                        Restore
                      </>
                    ) : (
                      <>
                        <X size={18} />
                        Remove
                      </>
                    )}
                  </button>
                )}
              </div>
              {formData.removeImage && (
                <p className="text-xs text-red-400">Image will be removed</p>
              )}
              {currentProject?.projectImage && !formData.removeImage && !hasImageChanged && (
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Current: <span className="text-[#27CBCB]">{currentProject.projectImage.split('/').pop()}</span>
                </p>
              )}
              {hasImageChanged && formData.projectImage && (
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  New: <span className="text-green-400">{formData.projectImage.name}</span>
                </p>
              )}
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                PNG, JPG, WEBP (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Challenge & Solution
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                <Lightbulb size={16} className="inline mr-2" />
                Challenge
              </label>
              <textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows="2"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="What challenge did you face?"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                <Zap size={16} className="inline mr-2" />
                Solution
              </label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows="2"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="How did you solve it?"
              />
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Accent Color
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {accentOptions.map((accent) => (
              <button
                key={accent}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, accent }))}
                className={`h-12 rounded-lg transition-all duration-200 bg-gradient-to-r ${accent} to-transparent
                  ${formData.accent === accent 
                    ? 'ring-2 ring-[#27CBCB] scale-105' 
                    : 'hover:scale-105'
                  }`}
              />
            ))}
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
                onClick={() => navigate('/admin/project')}
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
                    Update Project
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

export default ProjectEdit;