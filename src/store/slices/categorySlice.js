import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';

// Async thunks
export const createCategory = createAsyncThunk(
  'category/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await categoryService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const getAllCategories = createAsyncThunk(
  'category/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getCategoryById = createAsyncThunk(
  'category/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoryService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

// Initial state
const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCategorySuccess: (state) => {
      state.success = false;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.categories.unshift(action.payload);
        state.success = true;
        state.currentCategory = action.payload;
        state.total += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create category';
        state.success = false;
      })

    // Get All Categories
    .addCase(getAllCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch categories';
    })

    // Get Category By ID
    .addCase(getCategoryById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getCategoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentCategory = action.payload;
    })
    .addCase(getCategoryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch category';
    })

    // Update Category
    .addCase(updateCategory.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.categories.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.currentCategory = action.payload;
      state.success = true;
    })
    .addCase(updateCategory.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update category';
      state.success = false;
    })

    // Delete Category
    .addCase(deleteCategory.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.categories = state.categories.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentCategory?._id === action.payload.id) {
        state.currentCategory = null;
      }
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete category';
    });
  },
});

export const { clearCategoryError, clearCategorySuccess, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;