import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleService } from '../../services/roleService';

// Async thunks
export const createRole = createAsyncThunk(
  'role/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await roleService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create role');
    }
  }
);

export const getAllRoles = createAsyncThunk(
  'role/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

export const getRoleById = createAsyncThunk(
  'role/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'role/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await roleService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'role/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

// Initial state
const initialState = {
  roles: [],
  currentRole: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Role slice
const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearRoleSuccess: (state) => {
      state.success = false;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    // Create Role
    builder
      .addCase(createRole.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.roles.unshift(action.payload);
        state.success = true;
        state.currentRole = action.payload;
        state.total += 1;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create role';
        state.success = false;
      })

    // Get All Roles
    .addCase(getAllRoles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllRoles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.roles = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch roles';
    })

    // Get Role By ID
    .addCase(getRoleById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getRoleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRole = action.payload;
    })
    .addCase(getRoleById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch role';
    })

    // Update Role
    .addCase(updateRole.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateRole.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.roles.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
      state.currentRole = action.payload;
      state.success = true;
    })
    .addCase(updateRole.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update role';
      state.success = false;
    })

    // Delete Role
    .addCase(deleteRole.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteRole.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.roles = state.roles.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentRole?._id === action.payload.id) {
        state.currentRole = null;
      }
    })
    .addCase(deleteRole.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete role';
    });
  },
});

export const { clearRoleError, clearRoleSuccess, clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;