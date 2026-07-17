import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Mail,
  MessageSquare,
  Link as LinkIcon,
  Plus,
  X,
  AlertCircle,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink
} from 'lucide-react';
import { useContact } from '../../../hooks/useContact';
import { useTheme } from '../../../context/ThemeContext';

const ContactAdd = () => {
  const navigate = useNavigate();
  const { create, isSubmitting, error, success, clearError, clearSuccess } = useContact();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    socials: []
  });

  const [newSocial, setNewSocial] = useState({
    name: '',
    url: '',
    description: '',
    icon: 'link'
  });
  const [localError, setLocalError] = useState('');
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/contact');
    }
  }, [success, navigate, clearSuccess]);

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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setNewSocial(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleAddSocial = () => {
    if (!newSocial.name.trim()) {
      setLocalError('Social name is required');
      return;
    }
    if (!newSocial.url.trim()) {
      setLocalError('URL is required');
      return;
    }
    // Check for duplicate social
    if (formData.socials.some(s => s.name === newSocial.name.trim())) {
      setLocalError(`Social "${newSocial.name.trim()}" already exists`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          name: newSocial.name.trim(),
          url: newSocial.url.trim(),
          description: newSocial.description.trim(),
          icon: newSocial.icon || 'link'
        }
      ]
    }));

    setNewSocial({
      name: '',
      url: '',
      description: '',
      icon: 'link'
    });
    setIsAddingSocial(false);
    setLocalError('');
  };

  const handleRemoveSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.heading.trim()) {
      setLocalError('Heading is required');
      return;
    }
    if (formData.socials.length === 0) {
      setLocalError('At least one social link is required');
      return;
    }

    try {
      await create(formData);
    } catch (err) {
      setLocalError(err || 'Failed to create contact. Please try again.');
    }
  };

  const cancelAddSocial = () => {
    setIsAddingSocial(false);
    setNewSocial({
      name: '',
      url: '',
      description: '',
      icon: 'link'
    });
    setLocalError('');
  };

  const getSocialIcon = (iconName) => {
    switch(iconName?.toLowerCase()) {
      case 'github': return <Github size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'website': return <Globe size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };

  const socialIconOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'website', label: 'Website' },
    { value: 'link', label: 'Link' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/contact')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New Contact
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create a new contact section
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
              Create Contact
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
                Heading *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="e.g., Let's work together"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full border rounded-lg px-4 py-2.5 
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-y`}
                placeholder="Describe your contact section..."
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <LinkIcon size={20} className="inline mr-2 text-[#27CBCB]" />
              Social Links *
            </h2>
            {!isAddingSocial && (
              <button
                type="button"
                onClick={() => setIsAddingSocial(true)}
                className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
                Add Social Link
              </button>
            )}
          </div>

          {/* Add Social Form */}
          {isAddingSocial && (
            <div className={`p-4 rounded-lg border mb-4
              ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Social Link
                </h3>
                <button
                  type="button"
                  onClick={cancelAddSocial}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newSocial.name}
                      onChange={handleSocialChange}
                      className={`w-full border rounded-lg px-4 py-2 
                        ${isDark 
                          ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                      placeholder="e.g., GitHub"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={newSocial.icon}
                      onChange={handleSocialChange}
                      className={`w-full border rounded-lg px-4 py-2 
                        ${isDark 
                          ? 'bg-gray-900/50 border-gray-700 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                    >
                      {socialIconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={newSocial.url}
                    onChange={handleSocialChange}
                    className={`w-full border rounded-lg px-4 py-2 
                      ${isDark 
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={newSocial.description}
                    onChange={handleSocialChange}
                    className={`w-full border rounded-lg px-4 py-2 
                      ${isDark 
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                    placeholder="e.g., Explore my projects"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSocial}
                  className="w-full px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
                >
                  Add Social Link
                </button>
              </div>
            </div>
          )}

          {/* Display Social Links */}
          <div className="space-y-2">
            {formData.socials.map((social, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border
                ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                    {getSocialIcon(social.icon)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {social.name}
                    </p>
                    {social.description && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {social.description}
                      </p>
                    )}
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-xs ${isDark ? 'text-[#27CBCB]' : 'text-[#27CBCB]'} hover:underline flex items-center gap-1`}
                    >
                      {social.url}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            {formData.socials.length === 0 && (
              <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <LinkIcon size={40} className="mx-auto mb-2 opacity-50" />
                <p>No social links added yet</p>
                <button
                  type="button"
                  onClick={() => setIsAddingSocial(true)}
                  className="mt-2 text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
                >
                  Add your first social link
                </button>
              </div>
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
                onClick={() => navigate('/admin/contact')}
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
                    Create Contact
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

export default ContactAdd;