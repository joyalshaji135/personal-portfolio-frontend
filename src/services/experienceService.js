import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const experienceService = {
  // Create Experience
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/experience/create`, data);
    return response.data;
  },

  // Get All Experiences
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/experience/get-all`);
    return response.data;
  },

  // Get Single Experience
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/experience/get/${id}`);
    return response.data;
  },

  // Update Experience
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/experience/update/${id}`, data);
    return response.data;
  },

  // Delete Experience
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/experience/delete/${id}`);
    return response.data;
  }
};