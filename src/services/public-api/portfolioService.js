import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const portfolioService = {
  // Get Public Portfolio
  getPublicPortfolio: async () => {
    const response = await axiosInstance.get(`${API_URL}public/portfolio`);
    return response.data;
  },
};