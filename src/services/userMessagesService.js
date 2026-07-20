import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const userMessagesService = {
  // Get All Messages
  getAll: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}admin/user-message/get-all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Single Message
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}admin/user-message/get/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};