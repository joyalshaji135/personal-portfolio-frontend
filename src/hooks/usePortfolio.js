import { useSelector, useDispatch } from 'react-redux';
import { 
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  clearPortfolioError,
  clearPortfolioSuccess,
  clearCurrentPortfolio
} from '../store/slices/portfolioSlice';

export const usePortfolio = () => {
  const dispatch = useDispatch();
  
  const { 
    portfolios,
    currentPortfolio,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.portfolio);

  const create = async (data) => {
    try {
      const result = await dispatch(createPortfolio(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllPortfolios()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getPortfolioById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updatePortfolio({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deletePortfolioEntry = async (id) => {
    try {
      const result = await dispatch(deletePortfolio(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearPortfolioError());
  };

  const clearSuccess = () => {
    dispatch(clearPortfolioSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentPortfolio());
  };

  return {
    portfolios,
    currentPortfolio,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deletePortfolio: deletePortfolioEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};