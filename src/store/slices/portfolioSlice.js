import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { portfolioService } from '../../services/portfolioService';

// Async thunks
export const createPortfolio = createAsyncThunk(
  'portfolio/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await portfolioService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create portfolio');
    }
  }
);

export const getAllPortfolios = createAsyncThunk(
  'portfolio/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolios');
    }
  }
);

export const getPortfolioById = createAsyncThunk(
  'portfolio/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio');
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  'portfolio/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await portfolioService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update portfolio');
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolio/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await portfolioService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete portfolio');
    }
  }
);

// Initial state
const initialState = {
  portfolios: [],
  currentPortfolio: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Portfolio slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearPortfolioError: (state) => {
      state.error = null;
    },
    clearPortfolioSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPortfolio: (state) => {
      state.currentPortfolio = null;
    },
  },
  extraReducers: (builder) => {
    // Create Portfolio
    builder
      .addCase(createPortfolio.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.portfolios.unshift(action.payload);
        state.success = true;
        state.currentPortfolio = action.payload;
        state.total += 1;
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create portfolio';
        state.success = false;
      })

    // Get All Portfolios
    .addCase(getAllPortfolios.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllPortfolios.fulfilled, (state, action) => {
      state.isLoading = false;
      state.portfolios = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllPortfolios.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch portfolios';
    })

    // Get Portfolio By ID
    .addCase(getPortfolioById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getPortfolioById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPortfolio = action.payload;
    })
    .addCase(getPortfolioById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch portfolio';
    })

    // Update Portfolio
    .addCase(updatePortfolio.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updatePortfolio.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.portfolios.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.portfolios[index] = action.payload;
      }
      state.currentPortfolio = action.payload;
      state.success = true;
    })
    .addCase(updatePortfolio.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update portfolio';
      state.success = false;
    })

    // Delete Portfolio
    .addCase(deletePortfolio.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deletePortfolio.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.portfolios = state.portfolios.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentPortfolio?._id === action.payload.id) {
        state.currentPortfolio = null;
      }
    })
    .addCase(deletePortfolio.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete portfolio';
    });
  },
});

export const { clearPortfolioError, clearPortfolioSuccess, clearCurrentPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;