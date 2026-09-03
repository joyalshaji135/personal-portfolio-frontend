import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Activity,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Camera,
  UserCircle,
  Key,
  Trash2,
  Plus
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logoutUser } from '../../../store/slices/authSlice';
import { profileService } from '../../../services/developer-api/profile.service';
import { useTheme } from '../../../context/ThemeContext';

const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    socialLinks: []
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      if (response.status && response.data) {
        const userData = response.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          github: userData.socialLinks?.find(s => s.platform === 'github')?.url || '',
          linkedin: userData.socialLinks?.find(s => s.platform === 'linkedin')?.url || '',
          twitter: userData.socialLinks?.find(s => s.platform === 'twitter')?.url || '',
          socialLinks: userData.socialLinks || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user avatar
  const getAvatar = () => {
    if (!user?.avatar) return null;
    let avatarUrl = user.avatar;
    if (avatarUrl.includes('s96-c')) {
      avatarUrl = avatarUrl.replace('s96-c', 's200-c');
    }
    return avatarUrl;
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle social link change
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setNewSocialLink(prev => ({ ...prev, [name]: value }));
  };

  // Add social link
  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      setErrorMessage('Please select a platform and enter a URL');
      return;
    }
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: newSocialLink.platform, url: newSocialLink.url }]
    }));
    setNewSocialLink({ platform: '', url: '' });
    setErrorMessage('');
  };

  // Remove social link
  const handleRemoveSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password
  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare social links
      const socialLinks = [
        { platform: 'github', url: formData.github },
        { platform: 'linkedin', url: formData.linkedin },
        { platform: 'twitter', url: formData.twitter },
        ...formData.socialLinks.filter(s => 
          !['github', 'linkedin', 'twitter'].includes(s.platform)
        )
      ].filter(s => s.url);

      const updateData = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        socialLinks
      };

      const response = await profileService.updateProfile(updateData);
      if (response.status) {
        setSuccessMessage('Profile updated successfully!');
        setShowSuccess(true);
        setIsEditing(false);
        // Update redux user
        dispatch(updateUser(updateData));
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setDeleteLoading(true);
    setErrorMessage('');
    setPasswordSuccess(false);

    try {
      const response = await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.status) {
        setPasswordSuccess(true);
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to change password');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const response = await profileService.deleteAccount();
      if (response.status) {
        await dispatch(logoutUser());
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Stats data
  const stats = [
    { label: 'Provider', value: user?.provider || 'Local', icon: Shield },
    { label: 'Verified', value: user?.isVerified ? 'Yes' : 'No', icon: CheckCircle },
    { label: 'Joined', value: formatDate(user?.createdAt || user?.registeredAt), icon: Calendar },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Profile Dashboard</h1>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {passwordSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Password changed successfully!</span>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className={`rounded-xl border ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'} p-6`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#27CBCB] to-blue-500 flex items-center justify-center overflow-hidden border-4 border-[#27CBCB]/20">
                {user?.avatar && !avatarError ? (
                  <img 
                    src={getAvatar()} 
                    alt={user?.name || 'User'} 
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-[#27CBCB] rounded-full text-black hover:bg-[#27CBCB]/80 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-400">{user?.email || 'No email'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#27CBCB]/10 text-[#27CBCB] text-xs rounded-full">
                {user?.provider === 'google' ? 'Google Account' : 'Local Account'}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                <p className="text-sm text-gray-400">Manage your personal information</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors text-sm flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-[#27CBCB]" />
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  <p className="text-white font-medium mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Form Fields */}
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                      disabled
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                    placeholder="https://your-website.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      <Github className="w-4 h-4 inline mr-1" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      <Linkedin className="w-4 h-4 inline mr-1" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      <Twitter className="w-4 h-4 inline mr-1" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Additional Social Links</label>
                  <div className="space-y-2">
                    {formData.socialLinks.filter(s => !['github', 'linkedin', 'twitter'].includes(s.platform)).map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.platform}
                          className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                          disabled
                        />
                        <input
                          type="text"
                          value={link.url}
                          className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                          disabled
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <select
                        name="platform"
                        value={newSocialLink.platform}
                        onChange={handleSocialLinkChange}
                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                      >
                        <option value="">Select Platform</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="medium">Medium</option>
                        <option value="devto">Dev.to</option>
                        <option value="leetcode">LeetCode</option>
                        <option value="hackerrank">HackerRank</option>
                        <option value="codepen">CodePen</option>
                        <option value="behance">Behance</option>
                        <option value="dribbble">Dribbble</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="url"
                        name="url"
                        value={newSocialLink.url}
                        onChange={handleSocialLinkChange}
                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="p-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-400">Bio</p>
                    <p className="text-white mt-1">{formData.bio || 'No bio set'}</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white mt-1">{formData.location || 'No location set'}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-sm text-gray-400">Social Links</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {formData.website && (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {formData.github && (
                      <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {formData.linkedin && (
                      <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {formData.twitter && (
                      <a href={formData.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {formData.socialLinks.filter(s => !['github', 'linkedin', 'twitter'].includes(s.platform)).map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors text-sm">
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-6 py-2.5 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-2"
        >
          <Key className="w-5 h-5" />
          Change Password
        </button>
        <button
          onClick={() => window.location.href = '/dev-doc/dashboard'}
          className="px-6 py-2.5 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Delete Account
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl border ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full bg-gray-900/50 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                />
                {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full bg-gray-900/50 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                />
                {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full bg-gray-900/50 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                />
                {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
              </div>
              <button
                onClick={handleChangePassword}
                disabled={deleteLoading}
                className="w-full py-2.5 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl border ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-400">Delete Account</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400">Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileDashboard;