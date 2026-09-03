import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Save,
  X,
  Layers,
  CheckCircle,
  XCircle,
  FolderTree
} from 'lucide-react';

const AIToolSubCategory = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: 'Conversational AI', description: 'Chat and conversation tools', category: 'Development', toolCount: 8, active: true, createdAt: '2024-01-20' },
    { id: 2, name: 'Code Assistant', description: 'AI for coding assistance', category: 'Development', toolCount: 12, active: true, createdAt: '2024-02-01' },
    { id: 3, name: 'Image Generation', description: 'AI image creation tools', category: 'Creative', toolCount: 10, active: true, createdAt: '2024-02-15' },
    { id: 4, name: 'Data Analysis', description: 'AI for data insights', category: 'Analytics', toolCount: 6, active: false, createdAt: '2024-03-01' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    active: true
  });

  const categories = ['Development', 'Productivity', 'Creative', 'Analytics', 'Automation', 'Communication'];

  const filteredSubCategories = subCategories.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubCategory = () => {
    setEditingSubCategory(null);
    setFormData({ name: '', description: '', category: '', active: true });
    setIsModalOpen(true);
  };

  const handleEditSubCategory = (subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({ 
      name: subCategory.name, 
      description: subCategory.description,
      category: subCategory.category,
      active: subCategory.active 
    });
    setIsModalOpen(true);
  };

  const handleDeleteSubCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      setSubCategories(subCategories.filter(sub => sub.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubCategory) {
      setSubCategories(subCategories.map(sub => 
        sub.id === editingSubCategory.id 
          ? { ...sub, ...formData }
          : sub
      ));
    } else {
      setSubCategories([...subCategories, { 
        id: Date.now(), 
        ...formData,
        toolCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }]);
    }
    setIsModalOpen(false);
    setEditingSubCategory(null);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/dev-doc/ai-tools')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#27CBCB] flex-shrink-0" />
              <span className="truncate">AI Tool Sub-Categories</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm truncate">Create, update, and delete sub-categories</p>
          </div>
        </div>
        <button
          onClick={handleAddSubCategory}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#27CBCB] hover:bg-[#27CBCB]/80 text-black rounded-lg transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub-Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search sub-categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Sub-Categories Table - Desktop View */}
      <div className="hidden lg:block bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Tools</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredSubCategories.map((subCategory) => (
                <motion.tr
                  key={subCategory.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-white font-medium text-sm">{subCategory.name}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                      <FolderTree className="w-3 h-3" />
                      {subCategory.category}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-gray-400 text-sm line-clamp-2">{subCategory.description}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-gray-300 text-sm">{subCategory.toolCount}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      subCategory.active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {subCategory.active ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {subCategory.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditSubCategory(subCategory)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-[#27CBCB]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-Categories Cards - Tablet/Mobile View */}
      <div className="lg:hidden space-y-3">
        {filteredSubCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No sub-categories found
          </div>
        ) : (
          filteredSubCategories.map((subCategory) => (
            <motion.div
              key={subCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-[#27CBCB]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{subCategory.name}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs flex-shrink-0">
                      <FolderTree className="w-2.5 h-2.5" />
                      {subCategory.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                      subCategory.active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {subCategory.active ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : (
                        <XCircle className="w-2.5 h-2.5" />
                      )}
                      {subCategory.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{subCategory.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{subCategory.toolCount} Tools</span>
                    <span>•</span>
                    <span>{subCategory.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditSubCategory(subCategory)}
                    className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-[#27CBCB]"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubCategory(subCategory.id)}
                    className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sub-Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#27CBCB] focus:ring-[#27CBCB]"
                  />
                  <label className="text-sm text-gray-400">Active</label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#27CBCB] hover:bg-[#27CBCB]/80 text-black rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
                >
                  <Save className="w-4 h-4" />
                  {editingSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {filteredSubCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-400">No sub-categories found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default AIToolSubCategory;