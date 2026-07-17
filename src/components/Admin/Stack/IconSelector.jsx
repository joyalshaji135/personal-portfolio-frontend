import React, { useState, useEffect } from 'react';
import { 
  getIcon, 
  searchIcons, 
  getIconInfo,
  searchIconsWithCategory,
  getAllCategories 
} from '../../../utils/iconMapping';
import { Search, X, Grid3x3, List, Filter } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const IconSelector = ({ value, onChange, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const { isDark } = useTheme();

  const categories = ['all', ...getAllCategories()];

  useEffect(() => {
    let results = [];
    
    if (searchTerm || filterCategory !== 'all') {
      // Search with filters
      const allIcons = searchIconsWithCategory(searchTerm);
      results = filterCategory !== 'all' 
        ? allIcons.filter(icon => icon.category === filterCategory)
        : allIcons;
    } else {
      // Show all icons
      const iconNames = searchIcons('');
      results = iconNames.map(name => getIconInfo(name));
    }
    
    setFilteredIcons(results);
  }, [searchTerm, filterCategory]);

  const handleSelect = (iconName) => {
    onChange(iconName);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm`}>
      <div className={`w-full max-w-3xl max-h-[85vh] rounded-xl border p-6
        ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Select Icon
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search icons by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-10 py-2.5
                ${isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-sm
                  ${isDark 
                    ? 'bg-gray-900/50 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#27CBCB]/20 text-[#27CBCB]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#27CBCB]/20 text-[#27CBCB]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {filteredIcons.length} icons found
          </div>
        </div>

        {/* Icon Grid/List */}
        <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-600">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredIcons.map(({ name, icon: Icon }) => {
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all
                      ${isSelected 
                        ? 'bg-[#27CBCB]/20 border-2 border-[#27CBCB]' 
                        : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} border-2 border-transparent`
                      }`}
                  >
                    {React.createElement(Icon, { className: "w-6 h-6" })}
                    <span className={`text-xs truncate w-full text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredIcons.map(({ name, icon: Icon, category }) => {
                const isSelected = value === name;
                const colors = categoryColors[category] || categoryColors.default;
                return (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
                      ${isSelected 
                        ? `bg-[#27CBCB]/20 border-2 border-[#27CBCB]` 
                        : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} border-2 border-transparent`
                      }`}
                  >
                    {React.createElement(Icon, { className: "w-5 h-5" })}
                    <span className={`flex-1 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredIcons.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Search size={48} className="mx-auto mb-3 opacity-50" />
              <p>No icons found matching "{searchTerm}"</p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;