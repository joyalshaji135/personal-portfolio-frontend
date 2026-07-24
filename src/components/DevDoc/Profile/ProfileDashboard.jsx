import { useState } from 'react';
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
  UserCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logoutUser } from '../../../store/slices/authGoogleSlice';
import { useTheme } from '../../../context/ThemeContext';

const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Full Stack Developer | MERN Stack Expert',
    location: user?.location || 'Kerala, India',
    website: user?.website || 'https://joyalshaji.dev',
    github: user?.github || 'https://github.com/joyalshaji135',
    linkedin: user?.linkedin || 'https://linkedin.com/in/joyalshaji',
    twitter: user?.twitter || 'https://twitter.com/joyalshaji'
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditSuccess, setShowEditSuccess] = useState(false);

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

  // Handle save profile
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      await dispatch(updateUser(formData));
      setShowEditSuccess(true);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => {
        setShowEditSuccess(false);
      }, 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || 'Full Stack Developer | MERN Stack Expert',
      location: user?.location || 'Kerala, India',
      website: user?.website || 'https://joyalshaji.dev',
      github: user?.github || 'https://github.com/joyalshaji135',
      linkedin: user?.linkedin || 'https://linkedin.com/in/joyalshaji',
      twitter: user?.twitter || 'https://twitter.com/joyalshaji'
    });
    setErrors({});
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await dispatch(logoutUser());
    }
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

      {/* Success Message */}
      {showEditSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
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
              <div className="flex gap-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                      placeholder="https://your-website.com"
                    />
                  </div>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {errors.submit && (
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-400">Bio</p>
                    <p className="text-white mt-1">{user?.bio || 'Full Stack Developer | MERN Stack Expert'}</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white mt-1">{user?.location || 'Kerala, India'}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-sm text-gray-400">Social Links</p>
                  <div className="flex gap-3 mt-2">
                    {user?.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {user?.github && (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {user?.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {user?.twitter && (
                      <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#27CBCB] transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
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
          onClick={() => setIsEditing(true)}
          className="px-6 py-2.5 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Account Settings
        </button>
        <button
          onClick={() => window.location.href = '/dev-doc/dashboard'}
          className="px-6 py-2.5 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileDashboard;