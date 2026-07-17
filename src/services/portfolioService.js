import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const portfolioService = {
  // Create Portfolio
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/portfolio/create`, data);
    return response.data;
  },

  // Get All Portfolios
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/portfolio/get-all`);
    return response.data;
  },

  // Get Single Portfolio
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/portfolio/get/${id}`);
    return response.data;
  },

  // Update Portfolio
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/portfolio/update/${id}`, data);
    return response.data;
  },

  // Delete Portfolio
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/portfolio/delete/${id}`);
    return response.data;
  }
};