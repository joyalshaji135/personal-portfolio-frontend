import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Code2,
  Plus,
  X,
  AlertCircle,
  Quote,
  Layers,
  Tag,
  Eye
} from 'lucide-react';
import { useStack } from '../../../hooks/useStack';
import { useTheme } from '../../../context/ThemeContext';
import IconSelector from './IconSelector';
import { getIcon, getCategoryColor } from '../../../utils/iconMapping';

const StackAdd = () => {
  const navigate = useNavigate();
  const { create, isSubmitting, error, success, clearError, clearSuccess } = useStack();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    quote: {
      text: '',
      author: ''
    },
    categories: [],
    others: []
  });

  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [newCategoryTechs, setNewCategoryTechs] = useState([]);
  const [newTechName, setNewTechName] = useState('');
  const [newTechIcon, setNewTechIcon] = useState('');
  const [otherName, setOtherName] = useState('');
  const [otherIcon, setOtherIcon] = useState('');
  const [localError, setLocalError] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedIconField, setSelectedIconField] = useState(null);

  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/stack');
    }
  }, [success, navigate, clearSuccess]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('quote.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        quote: {
          ...prev.quote,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (localError) setLocalError('');
  };

  const openIconSelector = (field) => {
    setSelectedIconField(field);
    setShowIconSelector(true);
  };

  const handleIconSelect = (iconName) => {
    if (selectedIconField === 'newTech') {
      setNewTechIcon(iconName);
    } else if (selectedIconField === 'other') {
      setOtherIcon(iconName);
    }
    setShowIconSelector(false);
    setSelectedIconField(null);
  };

  const handleAddCategory = () => {
    if (!newCategoryKey.trim()) {
      setLocalError('Category key is required');
      return;
    }
    if (newCategoryTechs.length === 0) {
      setLocalError('At least one technology is required for the category');
      return;
    }

    // Check if category already exists
    if (formData.categories.some(cat => cat.key === newCategoryKey.trim())) {
      setLocalError(`Category "${newCategoryKey.trim()}" already exists`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          key: newCategoryKey.trim(),
          technologies: [...newCategoryTechs]
        }
      ]
    }));

    // Reset form
    setNewCategoryKey('');
    setNewCategoryTechs([]);
    setIsAddingCategory(false);
    setLocalError('');
  };

  const handleRemoveCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleAddTechToCategory = () => {
    if (!newTechName.trim()) {
      setLocalError('Technology name is required');
      return;
    }
    // Check for duplicate tech in current category
    if (newCategoryTechs.some(tech => tech.name === newTechName.trim())) {
      setLocalError(`Technology "${newTechName.trim()}" already exists in this category`);
      return;
    }
    setNewCategoryTechs(prev => [
      ...prev,
      { name: newTechName.trim(), icon: newTechIcon.trim() || 'default' }
    ]);
    setNewTechName('');
    setNewTechIcon('');
    setLocalError('');
  };

  const handleRemoveTechFromCategory = (index) => {
    setNewCategoryTechs(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddOther = () => {
    if (!otherName.trim()) {
      setLocalError('Other technology name is required');
      return;
    }
    // Check for duplicate other tech
    if (formData.others.some(item => item.name === otherName.trim())) {
      setLocalError(`Technology "${otherName.trim()}" already exists in others`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      others: [
        ...prev.others,
        { name: otherName.trim(), icon: otherIcon.trim() || 'default' }
      ]
    }));
    setOtherName('');
    setOtherIcon('');
    setLocalError('');
  };

  const handleRemoveOther = (index) => {
    setFormData(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.title.trim()) {
      setLocalError('Title is required');
      return;
    }
    if (formData.categories.length === 0) {
      setLocalError('At least one category is required');
      return;
    }

    try {
      await create(formData);
    } catch (err) {
      setLocalError(err || 'Failed to create stack. Please try again.');
    }
  };

  const cancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryKey('');
    setNewCategoryTechs([]);
    setNewTechName('');
    setNewTechIcon('');
    setLocalError('');
  };

  const renderIcon = (iconName, className = "w-4 h-4") => {
    const Icon = getIcon(iconName);
    return React.createElement(Icon, { className });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/stack')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New Stack
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create a new tech stack entry
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
              Creating...
            </>
          ) : (
            <>
              <Save size={18} />
              Create Stack
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
                <Code2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
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
                  placeholder="e.g., My Tech Stack"
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
                placeholder="e.g., The technologies I use to build scalable applications"
              />
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Quote size={20} className="inline mr-2 text-[#27CBCB]" />
            Quote
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Quote Text
              </label>
              <textarea
                name="quote.text"
                value={formData.quote.text}
                onChange={handleChange}
                rows="2"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="First solve the problem. Then write the code."
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Quote Author
              </label>
              <input
                type="text"
                name="quote.author"
                value={formData.quote.author}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="e.g., John Johnson"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Layers size={20} className="inline mr-2 text-[#27CBCB]" />
              Categories *
            </h2>
            {!isAddingCategory && (
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
                Add Category
              </button>
            )}
          </div>

          {/* Add Category Form */}
          {isAddingCategory && (
            <div className={`p-4 rounded-lg border mb-4
              ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Category
                </h3>
                <button
                  type="button"
                  onClick={cancelAddCategory}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Category Key *
                  </label>
                  <input
                    type="text"
                    value={newCategoryKey}
                    onChange={(e) => setNewCategoryKey(e.target.value.toLowerCase())}
                    className={`w-full border rounded-lg px-4 py-2 
                      ${isDark 
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                    placeholder="e.g., frontend, backend, database"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Technologies *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      className={`flex-1 border rounded-lg px-4 py-2 
                        ${isDark 
                          ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                      placeholder="Technology name"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        value={newTechIcon}
                        onChange={(e) => setNewTechIcon(e.target.value)}
                        placeholder="Icon"
                        className={`w-32 border rounded-lg px-4 py-2 pr-10
                          ${isDark 
                            ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() => openIconSelector('newTech')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-700/30 transition-colors"
                        title="Select Icon"
                      >
                        <Eye size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTechToCategory}
                      className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newCategoryTechs.map((tech, idx) => (
                      <span key={idx} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                        ${isDark 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-purple-100 text-purple-600 border border-purple-200'
                        }`}
                      >
                        {renderIcon(tech.icon)}
                        {tech.name}
                        {tech.icon && tech.icon !== 'default' && (
                          <span className="text-xs opacity-50">({tech.icon})</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechFromCategory(idx)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {newCategoryTechs.length === 0 && (
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        No technologies added yet
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          )}

          {/* Display Categories */}
          <div className="space-y-3">
            {formData.categories.map((cat, idx) => (
              <div key={idx} className={`p-4 rounded-lg border
                ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cat.key}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.technologies.map((tech, techIdx) => (
                    <span key={techIdx} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                      ${isDark 
                        ? 'bg-gray-700/50 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {renderIcon(tech.icon)}
                      {tech.name}
                      {tech.icon && tech.icon !== 'default' && (
                        <span className="text-xs opacity-50">({tech.icon})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {formData.categories.length === 0 && (
              <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <Layers size={40} className="mx-auto mb-2 opacity-50" />
                <p>No categories added yet</p>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="mt-2 text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
                >
                  Add your first category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Others */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Tag size={20} className="inline mr-2 text-[#27CBCB]" />
            Other Technologies
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Technology name"
            />
            <div className="relative">
              <input
                type="text"
                value={otherIcon}
                onChange={(e) => setOtherIcon(e.target.value)}
                placeholder="Icon"
                className={`w-32 border rounded-lg px-4 py-2 pr-10
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              />
              <button
                type="button"
                onClick={() => openIconSelector('other')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-700/30 transition-colors"
                title="Select Icon"
              >
                <Eye size={16} className="text-gray-400" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddOther}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.others.map((item, idx) => (
              <span key={idx} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {renderIcon(item.icon)}
                {item.name}
                {item.icon && item.icon !== 'default' && (
                  <span className="text-xs opacity-50">({item.icon})</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveOther(idx)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.others.length === 0 && (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No other technologies added yet
              </p>
            )}
          </div>
        </div>

        {/* Icon Selector Modal */}
        {showIconSelector && (
          <IconSelector
            value={selectedIconField === 'newTech' ? newTechIcon : otherIcon}
            onChange={handleIconSelect}
            onClose={() => {
              setShowIconSelector(false);
              setSelectedIconField(null);
            }}
          />
        )}

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
                onClick={() => navigate('/admin/stack')}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Stack
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

export default StackAdd;