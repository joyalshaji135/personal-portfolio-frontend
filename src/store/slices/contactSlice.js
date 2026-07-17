import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '../../services/contactService';

// Async thunks
export const createContact = createAsyncThunk(
  'contact/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await contactService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contact');
    }
  }
);

export const getAllContacts = createAsyncThunk(
  'contact/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contactService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const getContactById = createAsyncThunk(
  'contact/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contactService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contact/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await contactService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contact/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contactService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete contact');
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  currentContact: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Contact slice
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
    clearContactSuccess: (state) => {
      state.success = false;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
  },
  extraReducers: (builder) => {
    // Create Contact
    builder
      .addCase(createContact.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.contacts.unshift(action.payload);
        state.success = true;
        state.currentContact = action.payload;
        state.total += 1;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create contact';
        state.success = false;
      })

    // Get All Contacts
    .addCase(getAllContacts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.contacts = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllContacts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch contacts';
    })

    // Get Contact By ID
    .addCase(getContactById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getContactById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentContact = action.payload;
    })
    .addCase(getContactById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch contact';
    })

    // Update Contact
    .addCase(updateContact.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateContact.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.contacts.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      state.currentContact = action.payload;
      state.success = true;
    })
    .addCase(updateContact.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update contact';
      state.success = false;
    })

    // Delete Contact
    .addCase(deleteContact.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteContact.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.contacts = state.contacts.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentContact?._id === action.payload.id) {
        state.currentContact = null;
      }
    })
    .addCase(deleteContact.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete contact';
    });
  },
});

export const { clearContactError, clearContactSuccess, clearCurrentContact } = contactSlice.actions;
export default contactSlice.reducer;