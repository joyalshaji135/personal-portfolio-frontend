import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const projectService = {
  // Get Public Projects
  getPublicProjects: async () => {
    const response = await axiosInstance.get(`${API_URL}public/project`);
    return response.data;
  },
};