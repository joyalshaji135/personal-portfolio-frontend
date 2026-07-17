import { useSelector, useDispatch } from 'react-redux';
import { 
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  clearRoleError,
  clearRoleSuccess,
  clearCurrentRole
} from '../store/slices/roleSlice';

export const useRole = () => {
  const dispatch = useDispatch();
  
  const { 
    roles,
    currentRole,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.role);

  const create = async (data) => {
    try {
      const result = await dispatch(createRole(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllRoles()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getRoleById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateRole({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteRoleEntry = async (id) => {
    try {
      const result = await dispatch(deleteRole(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearRoleError());
  };

  const clearSuccess = () => {
    dispatch(clearRoleSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentRole());
  };

  return {
    roles,
    currentRole,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteRole: deleteRoleEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};