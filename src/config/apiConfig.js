// API Configuration
export const API_CONFIG = {
  baseURL: 'http://localhost:5000/api/v1/',
  apiKey: 'your-api-key-here',
  apiVersion: '1.0',
};

// Or use environment variables if available
export const API_CONFIG_ENV = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/',
  apiKey: import.meta.env.VITE_API_KEY || 'your-api-key-here',
  apiVersion: import.meta.env.VITE_API_VERSION || '1.0',
};