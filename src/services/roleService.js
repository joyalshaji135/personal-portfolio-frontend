import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const roleService = {
  // Create Role
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/role/create`, data);
    return response.data;
  },

  // Get All Roles
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/role/get-all`);
    return response.data;
  },

  // Get Single Role
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/role/get/${id}`);
    return response.data;
  },

  // Update Role
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/role/update/${id}`, data);
    return response.data;
  },

  // Delete Role
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/role/delete/${id}`);
    return response.data;
  }
};