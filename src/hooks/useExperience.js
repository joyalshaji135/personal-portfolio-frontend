import { useSelector, useDispatch } from 'react-redux';
import { 
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  clearExperienceError,
  clearExperienceSuccess,
  clearCurrentExperience
} from '../store/slices/experienceSlice';

export const useExperience = () => {
  const dispatch = useDispatch();
  
  const { 
    experiences,
    currentExperience,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.experience);

  const create = async (data) => {
    try {
      const result = await dispatch(createExperience(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllExperiences()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getExperienceById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateExperience({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteExperienceEntry = async (id) => {
    try {
      const result = await dispatch(deleteExperience(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearExperienceError());
  };

  const clearSuccess = () => {
    dispatch(clearExperienceSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentExperience());
  };

  return {
    experiences,
    currentExperience,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteExperience: deleteExperienceEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};