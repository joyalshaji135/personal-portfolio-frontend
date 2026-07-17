import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { educationService } from '../../services/educationService';

// Async thunks
export const createEducation = createAsyncThunk(
  'education/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await educationService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create education');
    }
  }
);

export const getAllEducations = createAsyncThunk(
  'education/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await educationService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch education');
    }
  }
);

export const getEducationById = createAsyncThunk(
  'education/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await educationService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch education');
    }
  }
);

export const updateEducation = createAsyncThunk(
  'education/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await educationService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update education');
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'education/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await educationService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete education');
    }
  }
);

// Initial state
const initialState = {
  educations: [],
  currentEducation: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Education slice
const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    clearEducationError: (state) => {
      state.error = null;
    },
    clearEducationSuccess: (state) => {
      state.success = false;
    },
    clearCurrentEducation: (state) => {
      state.currentEducation = null;
    },
  },
  extraReducers: (builder) => {
    // Create Education
    builder
      .addCase(createEducation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.educations.unshift(action.payload);
        state.success = true;
        state.currentEducation = action.payload;
        state.total += 1;
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create education';
        state.success = false;
      })

    // Get All Education
    .addCase(getAllEducations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllEducations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.educations = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllEducations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch education';
    })

    // Get Education By ID
    .addCase(getEducationById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getEducationById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentEducation = action.payload;
    })
    .addCase(getEducationById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch education';
    })

    // Update Education
    .addCase(updateEducation.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateEducation.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.educations.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.educations[index] = action.payload;
      }
      state.currentEducation = action.payload;
      state.success = true;
    })
    .addCase(updateEducation.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update education';
      state.success = false;
    })

    // Delete Education
    .addCase(deleteEducation.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteEducation.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.educations = state.educations.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentEducation?._id === action.payload.id) {
        state.currentEducation = null;
      }
    })
    .addCase(deleteEducation.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete education';
    });
  },
});

export const { clearEducationError, clearEducationSuccess, clearCurrentEducation } = educationSlice.actions;
export default educationSlice.reducer;