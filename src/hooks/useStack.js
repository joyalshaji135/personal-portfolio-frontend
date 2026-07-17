import { useSelector, useDispatch } from 'react-redux';
import { 
  createStack,
  getAllStacks,
  getStackById,
  updateStack,
  deleteStack,
  clearStackError,
  clearStackSuccess,
  clearCurrentStack
} from '../store/slices/stackSlice';

export const useStack = () => {
  const dispatch = useDispatch();
  
  const { 
    stacks,
    currentStack,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.stack);

  const create = async (data) => {
    try {
      const result = await dispatch(createStack(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllStacks()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getStackById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateStack({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteStackEntry = async (id) => {
    try {
      const result = await dispatch(deleteStack(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearStackError());
  };

  const clearSuccess = () => {
    dispatch(clearStackSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentStack());
  };

  return {
    stacks,
    currentStack,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteStack: deleteStackEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};