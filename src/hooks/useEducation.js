import { useSelector, useDispatch } from 'react-redux';
import { 
  createEducation,
  getAllEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
  clearEducationError,
  clearEducationSuccess,
  clearCurrentEducation
} from '../store/slices/educationSlice';

export const useEducation = () => {
  const dispatch = useDispatch();
  
  const { 
    educations,
    currentEducation,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.education);

  const create = async (data) => {
    try {
      const result = await dispatch(createEducation(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllEducations()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getEducationById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateEducation({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteEducationEntry = async (id) => {
    try {
      const result = await dispatch(deleteEducation(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearEducationError());
  };

  const clearSuccess = () => {
    dispatch(clearEducationSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentEducation());
  };

  return {
    educations,
    currentEducation,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteEducation: deleteEducationEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};