import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const stackService = {
  // Create Stack
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/stack/create`, data);
    return response.data;
  },

  // Get All Stacks
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/stack/get-all`);
    return response.data;
  },

  // Get Single Stack
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/stack/get/${id}`);
    return response.data;
  },

  // Update Stack
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/stack/update/${id}`, data);
    return response.data;
  },

  // Delete Stack
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/stack/delete/${id}`);
    return response.data;
  }
};