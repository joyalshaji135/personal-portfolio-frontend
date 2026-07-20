import axiosInstance from '../../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const emailService = {
    sendEmail: async (emailData) => {
        try {
            const response = await axiosInstance.post(`${API_URL}public/email`, emailData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};