import React from 'react';
import { getIcon } from '../../../utils/iconMapping';

const IconPreview = ({ iconName, size = "w-8 h-8", className = "" }) => {
  const Icon = getIcon(iconName);
  
  if (!Icon) {
    return (
      <div className={`${size} flex items-center justify-center bg-gray-800/30 rounded-lg text-gray-500 text-xs ${className}`}>
        ?
      </div>
    );
  }

  return React.createElement(Icon, { className: `${size} ${className}` });
};

export default IconPreview;