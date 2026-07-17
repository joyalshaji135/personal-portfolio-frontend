import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const projectService = {
  // Create Project with FormData
  create: async (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'projectImage' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await axiosInstance.post(`${API_URL}admin/project/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get All Projects
  getAll: async () => {
    const response = await axiosInstance.get(`${API_URL}admin/project/get-all`);
    return response.data;
  },

  // Get Single Project
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}admin/project/get/${id}`);
    return response.data;
  },

  // Update Project with FormData
  update: async (id, data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'projectImage' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key === 'removeImage' && data[key] === true) {
        formData.append(key, 'true');
      } else if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await axiosInstance.put(`${API_URL}admin/project/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete Project
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}admin/project/delete/${id}`);
    return response.data;
  }
};