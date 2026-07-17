import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const aboutService = {
  // Create About with FormData
  create: async (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'avatar' || key === 'miniAvatar' || key === 'resume') {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        }
      } else if (key === 'interests' && Array.isArray(data[key])) {
        data[key].forEach(item => formData.append('interests[]', item));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await axiosInstance.post(`${API_URL}admin/about/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get All About
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/about/get-all`);
    return response.data;
  },

  // Get Single About
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/about/get/${id}`);
    return response.data;
  },

  // Update About with FormData
  update: async (id, data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'avatar' || key === 'miniAvatar' || key === 'resume') {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        }
      } else if (key === 'interests' && Array.isArray(data[key])) {
        data[key].forEach(item => formData.append('interests[]', item));
      } else if (key === 'removeAvatar' || key === 'removeMiniAvatar' || key === 'removeResume') {
        if (data[key] === true) {
          formData.append(key, 'true');
        }
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await axiosInstance.put(`${API_URL}admin/about/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete About
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/about/delete/${id}`);
    return response.data;
  }
};