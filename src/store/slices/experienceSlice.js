import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { experienceService } from '../../services/experienceService';

// Async thunks
export const createExperience = createAsyncThunk(
  'experience/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await experienceService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create experience');
    }
  }
);

export const getAllExperiences = createAsyncThunk(
  'experience/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await experienceService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experiences');
    }
  }
);

export const getExperienceById = createAsyncThunk(
  'experience/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await experienceService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experience');
    }
  }
);

export const updateExperience = createAsyncThunk(
  'experience/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await experienceService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update experience');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'experience/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await experienceService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete experience');
    }
  }
);

// Initial state
const initialState = {
  experiences: [],
  currentExperience: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Experience slice
const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    clearExperienceError: (state) => {
      state.error = null;
    },
    clearExperienceSuccess: (state) => {
      state.success = false;
    },
    clearCurrentExperience: (state) => {
      state.currentExperience = null;
    },
  },
  extraReducers: (builder) => {
    // Create Experience
    builder
      .addCase(createExperience.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.experiences.unshift(action.payload);
        state.success = true;
        state.currentExperience = action.payload;
        state.total += 1;
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create experience';
        state.success = false;
      })

    // Get All Experiences
    .addCase(getAllExperiences.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllExperiences.fulfilled, (state, action) => {
      state.isLoading = false;
      state.experiences = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllExperiences.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch experiences';
    })

    // Get Experience By ID
    .addCase(getExperienceById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getExperienceById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentExperience = action.payload;
    })
    .addCase(getExperienceById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch experience';
    })

    // Update Experience
    .addCase(updateExperience.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateExperience.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.experiences.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
      state.currentExperience = action.payload;
      state.success = true;
    })
    .addCase(updateExperience.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update experience';
      state.success = false;
    })

    // Delete Experience
    .addCase(deleteExperience.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteExperience.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.experiences = state.experiences.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentExperience?._id === action.payload.id) {
        state.currentExperience = null;
      }
    })
    .addCase(deleteExperience.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete experience';
    });
  },
});

export const { clearExperienceError, clearExperienceSuccess, clearCurrentExperience } = experienceSlice.actions;
export default experienceSlice.reducer;