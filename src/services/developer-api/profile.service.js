import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

const apiClient = axiosInstance || axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'x-api-key-version': API_VERSION,
    'Content-Type': 'application/json',
  },
});

export const profileService = {
  // Get Profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await apiClient.get('developer/profile/get', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get Profile Error:', error);
      throw error.response?.data || error;
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await apiClient.put('developer/profile/update', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update Profile Error:', error);
      throw error.response?.data || error;
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await apiClient.put('developer/profile/change/password', passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete Account
  deleteAccount: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await apiClient.delete('developer/profile/delete', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Delete Account Error:', error);
      throw error.response?.data || error;
    }
  }
};