import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Save,
  X,
  Cpu,
  CheckCircle,
  XCircle,
  Star,
  Users,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Layers,
  FolderTree,
  MoreVertical
} from 'lucide-react';

const AITool = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [tools, setTools] = useState([
    { 
      id: 1, 
      name: 'ChatGPT', 
      category: 'Productivity',
      subCategory: 'Conversational AI',
      description: 'Advanced language model for natural conversations',
      status: 'Active',
      rating: 4.8,
      users: '1.2M',
      createdAt: '2024-01-15',
      url: 'https://chat.openai.com',
      tags: ['AI', 'Conversation', 'Content Generation'],
      features: ['Natural Language Processing', 'Multi-language Support', 'API Integration']
    },
    { 
      id: 2, 
      name: 'GitHub Copilot', 
      category: 'Development',
      subCategory: 'Code Assistant',
      description: 'AI-powered code completion and suggestions',
      status: 'Active',
      rating: 4.7,
      users: '890K',
      createdAt: '2024-02-01',
      url: 'https://github.com/features/copilot',
      tags: ['Coding', 'AI', 'Development'],
      features: ['Code Completion', 'Multi-language', 'IDE Integration']
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    description: '',
    status: 'Active',
    url: '',
    tags: [],
    features: []
  });

  const categories = ['Development', 'Productivity', 'Creative', 'Analytics', 'Automation', 'Communication'];
  const subCategories = ['Conversational AI', 'Code Assistant', 'Image Generation', 'Data Analysis', 'Content Creation'];
  const statuses = ['Active', 'Inactive', 'Beta', 'Deprecated'];

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTool = () => {
    setEditingTool(null);
    setFormData({ 
      name: '', 
      category: '', 
      subCategory: '', 
      description: '', 
      status: 'Active',
      url: '',
      tags: [],
      features: []
    });
    setIsModalOpen(true);
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool);
    setFormData({ 
      name: tool.name,
      category: tool.category,
      subCategory: tool.subCategory,
      description: tool.description,
      status: tool.status,
      url: tool.url || '',
      tags: tool.tags || [],
      features: tool.features || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteTool = (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter(tool => tool.id !== toolId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTool) {
      setTools(tools.map(tool => 
        tool.id === editingTool.id 
          ? { ...tool, ...formData }
          : tool
      ));
    } else {
      setTools([...tools, { 
        id: Date.now(), 
        ...formData,
        rating: 0,
        users: '0',
        createdAt: new Date().toISOString().split('T')[0]
      }]);
    }
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value.trim()]
      });
      e.target.value = '';
    }
  };

  const handleTagRemove = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleFeatureAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, e.target.value.trim()]
      });
      e.target.value = '';
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
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
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#27CBCB] flex-shrink-0" />
              <span className="truncate">AI Tools</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm truncate">Create, update, and delete AI tools</p>
          </div>
        </div>
        <button
          onClick={handleAddTool}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#27CBCB] hover:bg-[#27CBCB]/80 text-black rounded-lg transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Tools Table - Desktop View */}
      <div className="hidden lg:block bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Sub-Category</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredTools.map((tool) => (
                <motion.tr
                  key={tool.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => handleEditTool(tool)}
                >
                  <td className="px-4 md:px-6 py-4">
                    <div>
                      <span className="text-white font-medium text-sm">{tool.name}</span>
                      <p className="text-gray-400 text-xs truncate max-w-xs">{tool.description}</p>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                      <FolderTree className="w-3 h-3" />
                      {tool.category}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                      <Layers className="w-3 h-3" />
                      {tool.subCategory}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      tool.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : tool.status === 'Beta'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tool.status === 'Active' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {tool.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-white text-sm">{tool.rating}</span>
                      <span className="text-gray-500 text-xs">({tool.users})</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEditTool(tool)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-[#27CBCB]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
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

      {/* Tools Cards - Tablet/Mobile View */}
      <div className="lg:hidden space-y-3">
        {filteredTools.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tools found
          </div>
        ) : (
          filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-[#27CBCB]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{tool.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                      tool.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : tool.status === 'Beta'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tool.status === 'Active' ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : (
                        <XCircle className="w-2.5 h-2.5" />
                      )}
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{tool.description}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                      <FolderTree className="w-2.5 h-2.5" />
                      {tool.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                      <Layers className="w-2.5 h-2.5" />
                      {tool.subCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{tool.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{tool.users} users</span>
                    <span>•</span>
                    <span>{tool.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditTool(tool)}
                    className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-[#27CBCB]"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
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

      {/* Modal for Add/Edit - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editingTool ? 'Edit AI Tool' : 'Add New AI Tool'}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Tool Name
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sub-Category
                  </label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    required
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27CBCB] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Tags (Press Enter to add)
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-800 border border-gray-700 rounded-lg min-h-[42px]">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 px-2 py-0.5 bg-[#27CBCB]/20 text-[#27CBCB] rounded text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(index)}
                          className="hover:text-white"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag..."
                      onKeyDown={handleTagAdd}
                      className="flex-1 min-w-[80px] bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Features (Press Enter to add)
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-800 border border-gray-700 rounded-lg min-h-[42px]">
                    {formData.features.map((feature, index) => (
                      <span key={index} className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleFeatureRemove(index)}
                          className="hover:text-white"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add feature..."
                      onKeyDown={handleFeatureAdd}
                      className="flex-1 min-w-[80px] bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
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
                  {editingTool ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {filteredTools.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-400">No tools found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default AITool;