import { useSelector, useDispatch } from 'react-redux';
import { 
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  clearContactError,
  clearContactSuccess,
  clearCurrentContact
} from '../store/slices/contactSlice';

export const useContact = () => {
  const dispatch = useDispatch();
  
  const { 
    contacts,
    currentContact,
    isLoading,
    isSubmitting,
    error,
    success,
    total
  } = useSelector((state) => state.contact);

  const create = async (data) => {
    try {
      const result = await dispatch(createContact(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const result = await dispatch(getAllContacts()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const result = await dispatch(getContactById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const result = await dispatch(updateContact({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteContactEntry = async (id) => {
    try {
      const result = await dispatch(deleteContact(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearContactError());
  };

  const clearSuccess = () => {
    dispatch(clearContactSuccess());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentContact());
  };

  return {
    contacts,
    currentContact,
    isLoading,
    isSubmitting,
    error,
    success,
    total,
    create,
    getAll,
    getById,
    update,
    deleteContact: deleteContactEntry,
    clearError,
    clearSuccess,
    clearCurrent,
  };
};