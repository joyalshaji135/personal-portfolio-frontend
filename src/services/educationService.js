import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const educationService = {
  // Create Education
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/education/create`, data);
    return response.data;
  },

  // Get All Education
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/education/get-all`);
    return response.data;
  },

  // Get Single Education
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/education/get/${id}`);
    return response.data;
  },

  // Update Education
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/education/update/${id}`, data);
    return response.data;
  },

  // Delete Education
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/education/delete/${id}`);
    return response.data;
  }
};