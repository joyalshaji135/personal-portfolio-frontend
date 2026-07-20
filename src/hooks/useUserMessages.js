import { useState, useEffect } from 'react';
import { userMessagesService } from '../services/userMessagesService';

export const useUserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const getAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userMessagesService.getAll();
      if (response.status && response.data) {
        setMessages(response.data);
        setTotal(response.data.length);
        return response.data;
      }
      return [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch messages';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userMessagesService.getById(id);
      if (response.status && response.data) {
        setCurrentMessage(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch message';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCurrent = () => {
    setCurrentMessage(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    messages,
    currentMessage,
    isLoading,
    error,
    total,
    getAll,
    getById,
    clearCurrent,
    clearError
  };
};