import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const categoryService = {
  // Create Category
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/category/create`, data);
    return response.data;
  },

  // Get All Categories
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/category/get-all`);
    return response.data;
  },

  // Get Single Category
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/category/get/${id}`);
    return response.data;
  },

  // Update Category
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/category/update/${id}`, data);
    return response.data;
  },

  // Delete Category
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/category/delete/${id}`);
    return response.data;
  }
};