import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.success = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.error = null;
    },
    clearApiState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { setLoading, setError, setSuccess, clearApiState } = apiSlice.actions;
export default apiSlice.reducer;