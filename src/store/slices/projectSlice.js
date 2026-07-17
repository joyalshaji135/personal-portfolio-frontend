import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';

// Async thunks
export const createProject = createAsyncThunk(
  'project/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await projectService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const getAllProjects = createAsyncThunk(
  'project/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const getProjectById = createAsyncThunk(
  'project/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await projectService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectService.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  total: 0,
};

// Project slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearProjectSuccess: (state) => {
      state.success = false;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.projects.unshift(action.payload);
        state.success = true;
        state.currentProject = action.payload;
        state.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create project';
        state.success = false;
      })

    // Get All Projects
    .addCase(getAllProjects.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAllProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = action.payload;
      state.total = action.payload.length;
    })
    .addCase(getAllProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch projects';
    })

    // Get Project By ID
    .addCase(getProjectById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getProjectById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProject = action.payload;
    })
    .addCase(getProjectById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch project';
    })

    // Update Project
    .addCase(updateProject.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateProject.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const index = state.projects.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      state.currentProject = action.payload;
      state.success = true;
    })
    .addCase(updateProject.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to update project';
      state.success = false;
    })

    // Delete Project
    .addCase(deleteProject.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    })
    .addCase(deleteProject.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.projects = state.projects.filter(item => item._id !== action.payload.id);
      state.total -= 1;
      state.success = true;
      if (state.currentProject?._id === action.payload.id) {
        state.currentProject = null;
      }
    })
    .addCase(deleteProject.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload || 'Failed to delete project';
    });
  },
});

export const { clearProjectError, clearProjectSuccess, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;