import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  FileText,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useEducation } from '../../../hooks/useEducation';
import { useTheme } from '../../../context/ThemeContext';

const EducationAdd = () => {
  const navigate = useNavigate();
  const { create, isSubmitting, error, success, clearError, clearSuccess } = useEducation();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    period: '',
    description: []
  });

  const [newDescription, setNewDescription] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (success) {
      clearSuccess();
      navigate('/admin/education');
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

  const handleAddDescription = () => {
    if (newDescription.trim() && !formData.description.includes(newDescription.trim())) {
      setFormData(prev => ({
        ...prev,
        description: [...prev.description, newDescription.trim()]
      }));
      setNewDescription('');
    }
  };

  const handleRemoveDescription = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.filter(item => item !== itemToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.degree.trim()) {
      setLocalError('Degree is required');
      return;
    }
    if (!formData.institution.trim()) {
      setLocalError('Institution is required');
      return;
    }
    if (!formData.period.trim()) {
      setLocalError('Period is required');
      return;
    }

    try {
      await create(formData);
    } catch (err) {
      setLocalError(err || 'Failed to create education entry. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/education')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New Education
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Add your education history
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
              Create Entry
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

        {/* Education Information */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Education Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Degree / Qualification *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="e.g., Bachelor of Computer Applications (BCA)"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Institution *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="e.g., Mahatma Gandhi University"
                />
              </div>
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
                  placeholder="e.g., Kottayam, Kerala, India"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Period *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg pl-10 pr-4 py-2.5 
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
                  placeholder="e.g., 2020 - 2023"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`rounded-xl p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Description / Highlights
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDescription())}
              className={`flex-1 border rounded-lg px-4 py-2 
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              placeholder="Add description point..."
            />
            <button
              type="button"
              onClick={handleAddDescription}
              className="px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.description.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border
                ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <span className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle size={16} className="text-[#27CBCB]" />
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveDescription(item)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {formData.description.length === 0 && (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No description added yet
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
                onClick={() => navigate('/admin/education')}
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
                    Create Entry
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

export default EducationAdd;