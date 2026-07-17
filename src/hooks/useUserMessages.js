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
      setMessages(response.data);
      setTotal(response.data.length);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
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
      setCurrentMessage(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch message');
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

  const markAsRead = (id) => {
    setMessages(prev => 
      prev.map(msg => 
        msg._id === id ? { ...msg, status: 'read' } : msg
      )
    );
  };

  const toggleStar = (id) => {
    setMessages(prev => 
      prev.map(msg => 
        msg._id === id ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
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
    clearError,
    markAsRead,
    toggleStar
  };
};