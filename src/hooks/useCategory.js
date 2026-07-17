import { useSelector, useDispatch } from 'react-redux';
import { 
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  clearCategoryError,
  clearCategorySuccess,
  clearCurrentCategory
} from '../store/slices/categorySlice';

export const useCategory = () => {
  const dispatch = useDispatch();
  
  const { 
    categories,
    currentCategory,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.category);

  const create = async (data) => {
    try {
      const result = await dispatch(createCategory(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllCategories()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getCategoryById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateCategory({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteCategoryEntry = async (id) => {
    try {
      const result = await dispatch(deleteCategory(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearCategoryError());
  };

  const clearSuccess = () => {
    dispatch(clearCategorySuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentCategory());
  };

  return {
    categories,
    currentCategory,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteCategory: deleteCategoryEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};