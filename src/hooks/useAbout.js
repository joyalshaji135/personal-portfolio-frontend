import { useSelector, useDispatch } from 'react-redux';
import { 
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
  clearAboutError,
  clearAboutSuccess,
  clearCurrentAbout
} from '../store/slices/aboutSlice';

export const useAbout = () => {
  const dispatch = useDispatch();
  
  const { 
    abouts,
    currentAbout,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.about);

  const create = async (data) => {
    try {
      const result = await dispatch(createAbout(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllAbout()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getAboutById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateAbout({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteAboutEntry = async (id) => {
    try {
      const result = await dispatch(deleteAbout(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearAboutError());
  };

  const clearSuccess = () => {
    dispatch(clearAboutSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentAbout());
  };

  return {
    abouts,
    currentAbout,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteAbout: deleteAboutEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};