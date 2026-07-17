import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stackService } from '../../services/stackService';

// Async thunks
export const createStack = createAsyncThunk(
  'stack/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await stackService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create stack');
    }
  }
);

export const getAllStacks = createAsyncThunk(
  'stack/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stackService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stacks');
    }
  }
);

export const getStackById = createAsyncThunk(
  'stack/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await stackService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stack');
    }
  }
);

export const updateStack = createAsyncThunk(
  'stack/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await stackService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stack');
    }
  }
);

export const deleteStack = createAsyncThunk(
  'stack/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await stackService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stack');
    }
  }
);

// Initial state
const initialState = {
  stacks: [],
  currentStack: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Stack slice
const stackSlice = createSlice({
  name: 'stack',
  initialState,
  reducers: {
    clearStackError: (state) => {
      state.error = null;
    },
    clearStackSuccess: (state) => {
      state.success = false;
    },
    clearCurrentStack: (state) => {
      state.currentStack = null;
    },
  },
  extraReducers: (builder) => {
    // Create Stack
    builder
      .addCase(createStack.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStack.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.stacks.unshift(action.payload);
        state.success = true;
        state.currentStack = action.payload;
        state.total += 1;
      })
      .addCase(createStack.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create stack';
        state.success = false;
      })

    // Get All Stacks
    .addCase(getAllStacks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllStacks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stacks = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllStacks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch stacks';
    })

    // Get Stack By ID
    .addCase(getStackById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getStackById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentStack = action.payload;
    })
    .addCase(getStackById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch stack';
    })

    // Update Stack
    .addCase(updateStack.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateStack.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.stacks.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.stacks[index] = action.payload;
      }
      state.currentStack = action.payload;
      state.success = true;
    })
    .addCase(updateStack.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update stack';
      state.success = false;
    })

    // Delete Stack
    .addCase(deleteStack.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteStack.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.stacks = state.stacks.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentStack?._id === action.payload.id) {
        state.currentStack = null;
      }
    })
    .addCase(deleteStack.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete stack';
    });
  },
});

export const { clearStackError, clearStackSuccess, clearCurrentStack } = stackSlice.actions;
export default stackSlice.reducer;