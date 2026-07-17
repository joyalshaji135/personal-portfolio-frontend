import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X, 
  User, 
  MapPin, 
  Briefcase,
  Upload,
  Image as ImageIcon,
  Plus,
  AlertCircle,
  FileText,
  Trash2,
  Eye
} from 'lucide-react';
import { useAbout } from '../../../hooks/useAbout';
import { useTheme } from '../../../context/ThemeContext';

const AboutAdd = () => {
  const navigate = useNavigate();
  const { create, isSubmitting, error, clearError, success, clearSuccess } = useAbout();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    handle: '',
    status: '',
    location: '',
    heading: '',
    headingHighlight: '',
    intro: '',
    quote: '',
    interests: [],
    resumeUrl: '',
    resume: null,
    avatarUrl: '',
    avatar: null,
    miniAvatarUrl: '',
    miniAvatar: null
  });

  const [newInterest, setNewInterest] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [miniAvatarPreview, setMiniAvatarPreview] = useState(null);
  const [resumeFilePreview, setResumeFilePreview] = useState(null);
  const [localError, setLocalError] = useState('');

  // File input refs
  const avatarInputRef = useRef(null);
  const miniAvatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Clear success after navigation
  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/about');
    }
  }, [success, navigate, clearSuccess]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Handle Avatar Upload
  const handleAvatarUpload = (e) => {
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
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarUrl: ''
      }));
      setLocalError('');
    }
  };

  // Handle Mini Avatar Upload
  const handleMiniAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setLocalError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMiniAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        miniAvatar: file,
        miniAvatarUrl: ''
      }));
      setLocalError('');
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setLocalError('Please upload a PDF or Word document');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setLocalError('File size should be less than 10MB');
        return;
      }
      
      setResumeFilePreview(file.name);
      setFormData(prev => ({
        ...prev,
        resume: file,
        resumeUrl: ''
      }));
      setLocalError('');
    }
  };

  // Remove Avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({
      ...prev,
      avatar: null,
      avatarUrl: ''
    }));
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  // Remove Mini Avatar
  const handleRemoveMiniAvatar = () => {
    setMiniAvatarPreview(null);
    setFormData(prev => ({
      ...prev,
      miniAvatar: null,
      miniAvatarUrl: ''
    }));
    if (miniAvatarInputRef.current) {
      miniAvatarInputRef.current.value = '';
    }
  };

  // Remove Resume
  const handleRemoveResume = () => {
    setResumeFilePreview(null);
    setFormData(prev => ({
      ...prev,
      resume: null,
      resumeUrl: ''
    }));
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.title) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      const submitData = { ...formData };
      if (!submitData.avatar) delete submitData.avatar;
      if (!submitData.miniAvatar) delete submitData.miniAvatar;
      if (!submitData.resume) delete submitData.resume;
      
      await create(submitData);
    } catch (err) {
      setLocalError(err || 'Failed to create about entry. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/about')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400 hover:text-white" />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New About Entry
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create a new about section profile
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
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Entry
            </>
          )}
        </button>
      </div>

      {/* Form */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="Joyal Shaji"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Professional Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
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
                  placeholder="Full-Stack Developer"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Handle / Username
              </label>
              <input
                type="text"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="joyalshaji"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="India"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status - Now as Input Field */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Status
          </h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Current Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="e.g., Currently Working on Backend Developer at BeetStack"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Enter your current professional status
            </p>
          </div>
        </div>

        {/* Content */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Heading
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="A developer who"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Heading Highlight
              </label>
              <input
                type="text"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                placeholder="cares about the details"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Intro / Bio
              </label>
              <textarea
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                rows="4"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="Tell your story..."
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Quote
              </label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                rows="3"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="Curiosity drives how I approach technology..."
              />
            </div>
          </div>
        </div>

        {/* Avatar Image Upload */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Avatar Image
          </h2>
          <div className="flex items-center gap-6">
            <div className={`w-32 h-32 rounded-full border-2 border-dashed 
              flex items-center justify-center overflow-hidden
              ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="mx-auto text-gray-500" />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No image
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2
                    ${isDark 
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <Upload size={18} />
                    Upload Avatar
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                PNG, JPG, WEBP (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Mini Avatar Image Upload */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Mini Avatar Image
          </h2>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full border-2 border-dashed 
              flex items-center justify-center overflow-hidden
              ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
            >
              {miniAvatarPreview ? (
                <img src={miniAvatarPreview} alt="Mini Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={24} className="mx-auto text-gray-500" />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No image
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2
                    ${isDark 
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <Upload size={18} />
                    Upload Mini Avatar
                  </div>
                  <input
                    ref={miniAvatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMiniAvatarUpload}
                    className="hidden"
                  />
                </label>
                {miniAvatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveMiniAvatar}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                PNG, JPG, WEBP (Max 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Resume
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex-1">
                <div className={`px-4 py-3 border rounded-lg transition-colors flex items-center gap-3
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <FileText size={20} className="text-[#27CBCB]" />
                  <span className="flex-1">
                    {resumeFilePreview ? resumeFilePreview : 'Choose resume file'}
                  </span>
                  <Upload size={18} className="text-gray-500" />
                </div>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
              {resumeFilePreview && (
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              )}
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Interests
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add an interest..."
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 
                transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.interests.length === 0 && (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No interests added yet
              </p>
            )}
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
                onClick={() => navigate('/admin/about')}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Entry
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

export default AboutAdd;