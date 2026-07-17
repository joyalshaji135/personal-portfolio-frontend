import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aboutService } from '../../services/aboutService';

// Async thunks
export const createAbout = createAsyncThunk(
  'about/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await aboutService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create about');
    }
  }
);

export const getAllAbout = createAsyncThunk(
  'about/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aboutService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch about entries');
    }
  }
);

export const getAboutById = createAsyncThunk(
  'about/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aboutService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch about entry');
    }
  }
);

export const updateAbout = createAsyncThunk(
  'about/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await aboutService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update about');
    }
  }
);

export const deleteAbout = createAsyncThunk(
  'about/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aboutService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete about');
    }
  }
);

// Initial state
const initialState = {
  abouts: [],
  currentAbout: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// About slice
const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearAboutError: (state) => {
      state.error = null;
    },
    clearAboutSuccess: (state) => {
      state.success = false;
    },
    clearCurrentAbout: (state) => {
      state.currentAbout = null;
    },
  },
  extraReducers: (builder) => {
    // Create About
    builder
      .addCase(createAbout.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAbout.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.abouts.unshift(action.payload);
        state.success = true;
        state.currentAbout = action.payload;
        state.total += 1;
      })
      .addCase(createAbout.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create about';
        state.success = false;
      })

    // Get All About
    .addCase(getAllAbout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllAbout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.abouts = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllAbout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch about entries';
    })

    // Get About By ID
    .addCase(getAboutById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAboutById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentAbout = action.payload;
    })
    .addCase(getAboutById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch about entry';
    })

    // Update About
    .addCase(updateAbout.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateAbout.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.abouts.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.abouts[index] = action.payload;
      }
      state.currentAbout = action.payload;
      state.success = true;
    })
    .addCase(updateAbout.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update about';
      state.success = false;
    })

    // Delete About
    .addCase(deleteAbout.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteAbout.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.abouts = state.abouts.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentAbout?._id === action.payload.id) {
        state.currentAbout = null;
      }
    })
    .addCase(deleteAbout.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete about';
    });
  },
});

export const { clearAboutError, clearAboutSuccess, clearCurrentAbout } = aboutSlice.actions;
export default aboutSlice.reducer;