import React from 'react';
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaHtml5,
  FaCss3,
  FaPython,
  FaJava,
  FaAws,
  FaDocker,
  FaNpm,
  FaPhp,
  FaFigma
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiVercel,
  SiRender,
  SiFastapi,
  SiNextdotjs,
  SiPostgresql,
  SiSupabase,
  SiNginx,
  SiGithubactions,
  SiCloudflare,
  SiPostman,
  SiMongoose,
  SiVite,
  SiKubernetes
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";
import { RiJavascriptFill } from "react-icons/ri";
import { VscAzure } from "react-icons/vsc";
import { IoKey } from "react-icons/io5";

// Icon mapping - connects string names to actual icon components
export const iconMap = {
  // Frontend
  react: FaReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  vite: SiVite,
  html: FaHtml5,
  css: FaCss3,
  javascript: RiJavascriptFill,
  js: RiJavascriptFill,

  // Backend
  nodejs: FaNodeJs,
  express: SiExpress,
  fastapi: SiFastapi,
  mongoose: SiMongoose,
  jwt: MdSecurity,
  rest: TbApi,
  api: TbApi,
  security: MdSecurity,

  // Database
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  supabase: SiSupabase,

  // DevOps
  docker: FaDocker,
  nginx: SiNginx,
  github: FaGitAlt,
  githubactions: SiGithubactions,
  git: FaGitAlt,
  pm2: FaDocker,
  kubernetes: SiKubernetes,

  // Cloud
  aws: FaAws,
  cloudflare: SiCloudflare,
  vercel: SiVercel,
  render: SiRender,
  azure: VscAzure,

  // Languages
  python: FaPython,
  java: FaJava,
  php: FaPhp,

  // Tools
  postman: SiPostman,
  figma: FaFigma,
  npm: FaNpm,

  // Default
  default: FaReact,
};

// Category colors for styling
export const categoryColors = {
  frontend: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  backend: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
  database: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  devops: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  cloud: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  mobile: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' },
  default: { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400' },
};

// Get icon component by name
export const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName?.toLowerCase()];
  return IconComponent || iconMap.default;
};

// Get category color by key
export const getCategoryColor = (categoryKey) => {
  return categoryColors[categoryKey] || categoryColors.default;
};

// Get icon with styling - Using React.createElement
export const getIconWithProps = (iconName, className = "w-5 h-5", color = "currentColor") => {
  const Icon = getIcon(iconName);
  return React.createElement(Icon, { className, color });
};

// Helper function to render icon in components
export const renderIcon = (iconName, className = "w-5 h-5", color = "currentColor") => {
  const Icon = getIcon(iconName);
  return React.createElement(Icon, { className, color });
};

// Search icons by name
export const searchIcons = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return getAllIconNames();
  }
  
  const term = searchTerm.toLowerCase().trim();
  return Object.keys(iconMap)
    .filter(key => key !== 'default' && key.toLowerCase().includes(term))
    .sort((a, b) => a.localeCompare(b));
};

// Get all icon names
export const getAllIconNames = () => {
  return Object.keys(iconMap).filter(key => key !== 'default').sort();
};

// Get icon by category
export const getIconsByCategory = (category) => {
  const iconCategories = {
    frontend: ['react', 'nextjs', 'typescript', 'tailwind', 'vite', 'html', 'css', 'javascript', 'js'],
    backend: ['nodejs', 'express', 'fastapi', 'mongoose', 'jwt', 'rest', 'api', 'security'],
    database: ['mongodb', 'mysql', 'postgresql', 'supabase'],
    devops: ['docker', 'nginx', 'github', 'githubactions', 'git', 'pm2'],
    cloud: ['aws', 'cloudflare', 'vercel', 'render', 'azure'],
    languages: ['python', 'java', 'php'],
    tools: ['postman', 'figma', 'npm']
  };
  return iconCategories[category] || [];
};

// Get icon info with category
export const getIconInfo = (iconName) => {
  const name = iconName?.toLowerCase();
  const Icon = getIcon(name);
  
  // Find which category this icon belongs to
  let category = 'default';
  for (const [cat, icons] of Object.entries(getAllCategoriesWithIcons())) {
    if (icons.includes(name)) {
      category = cat;
      break;
    }
  }
  
  return {
    name: name,
    icon: Icon,
    category: category,
    colors: categoryColors[category] || categoryColors.default
  };
};

// Get all categories with their icons
export const getAllCategoriesWithIcons = () => {
  return {
    frontend: ['react', 'nextjs', 'typescript', 'tailwind', 'vite', 'html', 'css', 'javascript', 'js'],
    backend: ['nodejs', 'express', 'fastapi', 'mongoose', 'jwt', 'rest', 'api', 'security'],
    database: ['mongodb', 'mysql', 'postgresql', 'supabase'],
    devops: ['docker', 'nginx', 'github', 'githubactions', 'git', 'pm2'],
    cloud: ['aws', 'cloudflare', 'vercel', 'render', 'azure'],
    languages: ['python', 'java', 'php'],
    tools: ['postman', 'figma', 'npm']
  };
};

// Get all categories
export const getAllCategories = () => {
  return Object.keys(categoryColors).filter(key => key !== 'default');
};

// Search icons with category info
export const searchIconsWithCategory = (searchTerm) => {
  const results = [];
  const term = searchTerm?.toLowerCase().trim() || '';
  
  Object.keys(iconMap)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (!term || key.toLowerCase().includes(term)) {
        const info = getIconInfo(key);
        results.push(info);
      }
    });
  
  return results.sort((a, b) => a.name.localeCompare(b.name));
};