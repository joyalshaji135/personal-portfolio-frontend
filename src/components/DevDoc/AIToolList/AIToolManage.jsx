import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FolderTree, 
  Layers, 
  Cpu,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

const AIToolManage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Module Cards Data
  const modules = [
    {
      id: 'category',
      title: 'AI Tool Category',
      description: 'Manage AI tool categories with CRUD operations',
      icon: FolderTree,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      stats: '6 Categories',
      path: '/dev-doc/ai-tools/category'
    },
    {
      id: 'sub-category',
      title: 'AI Tool Sub-Category',
      description: 'Manage sub-categories for better organization',
      icon: Layers,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      stats: '12 Sub-Categories',
      path: '/dev-doc/ai-tools/sub-category'
    },
    {
      id: 'tool',
      title: 'AI Tool',
      description: 'Create, update, and delete AI tools',
      icon: Cpu,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      stats: '45+ Tools',
      path: '/dev-doc/ai-tools/tool'
    }
  ];

  const handleModuleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Cpu className="w-8 h-8 text-[#27CBCB]" />
              AI Tool Management
            </h1>
            <p className="text-gray-400 mt-1">Manage categories, sub-categories, and tools</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dev-doc/ai-tools/tool')}
              className="flex items-center gap-2 px-4 py-2 bg-[#27CBCB] hover:bg-[#27CBCB]/80 text-black rounded-lg transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add New Tool
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#27CBCB] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-[#27CBCB] transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg border transition-colors ${viewMode === 'grid' ? 'bg-[#27CBCB]/10 border-[#27CBCB] text-[#27CBCB]' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg border transition-colors ${viewMode === 'list' ? 'bg-[#27CBCB]/10 border-[#27CBCB] text-[#27CBCB]' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleModuleClick(module.path)}
              className={`group relative p-6 bg-gray-800/30 border ${module.borderColor} rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Glow Effect */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`w-16 h-16 ${module.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className={`w-8 h-8 ${module.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white group-hover:text-[#27CBCB] transition-colors">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mt-2">
                  {module.description}
                </p>

                {/* Stats and Action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                  <span className="text-xs text-gray-500">{module.stats}</span>
                  <span className="flex items-center gap-1 text-[#27CBCB] text-sm font-medium group-hover:gap-2 transition-all">
                    Manage
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ x: 4 }}
              onClick={() => handleModuleClick(module.path)}
              className={`group p-4 bg-gray-800/30 border ${module.borderColor} rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${module.bgColor} rounded-xl`}>
                  <module.icon className={`w-5 h-5 ${module.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-white font-medium group-hover:text-[#27CBCB] transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{module.stats}</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#27CBCB] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Categories</p>
          <p className="text-2xl font-bold text-white">6</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Sub-Categories</p>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total AI Tools</p>
          <p className="text-2xl font-bold text-white">45+</p>
        </div>
      </div>
    </div>
  );
};

export default AIToolManage;