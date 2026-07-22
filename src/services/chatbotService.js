import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const chatbotService = {
  // Get About Data
  getAbout: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/about`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Contact Data
  getContact: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/contact`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Stack Data
  getStack: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/stack`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Education Data
  getEducation: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/education`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Experience Data
  getExperience: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/experience`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Project Data
  getProject: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}public/chat/project`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};