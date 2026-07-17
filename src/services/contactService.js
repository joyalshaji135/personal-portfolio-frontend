import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const contactService = {
  // Create Contact
  create: async (data) => {
    const response = await axiosInstance.post(`${API_URL}admin/contact/create`, data);
    return response.data;
  },

  // Get All Contacts
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/contact/get-all`);
    return response.data;
  },

  // Get Single Contact
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/contact/get/${id}`);
    return response.data;
  },

  // Update Contact
  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_URL}admin/contact/update/${id}`, data);
    return response.data;
  },

  // Delete Contact
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/contact/delete/${id}`);
    return response.data;
  }
};