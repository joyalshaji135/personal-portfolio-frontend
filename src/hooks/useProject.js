import { useSelector, useDispatch } from 'react-redux';
import { 
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  clearProjectError,
  clearProjectSuccess,
  clearCurrentProject
} from '../store/slices/projectSlice';

export const useProject = () => {
  const dispatch = useDispatch();
  
  const { 
    projects,
    currentProject,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.project);

  const create = async (data) => {
    try {
      const result = await dispatch(createProject(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllProjects()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getProjectById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateProject({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteProjectEntry = async (id) => {
    try {
      const result = await dispatch(deleteProject(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearProjectError());
  };

  const clearSuccess = () => {
    dispatch(clearProjectSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentProject());
  };

  return {
    projects,
    currentProject,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteProject: deleteProjectEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};