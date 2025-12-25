import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/fv1/auth/login`, credentials);
      return response.data;
    } catch (error) {
      let errMsg = 'Login failed';
      if (error.response) {
        if (error.response.data && Array.isArray(error.response.data.errors)) {
          errMsg = error.response.data.errors.map(e => e.msg).join(' | ');
        } else if (error.response.data && Array.isArray(error.response.data)) {
          errMsg = error.response.data.map(e => e.msg || e).join(' | ');
        } else if (error.response.data && error.response.data.message) {
          errMsg = error.response.data.message;
        } else if (error.response.status === 404) {
          errMsg = 'Service not found (404)';
        } else if (error.response.data && typeof error.response.data === 'string') {
          errMsg = error.response.data;
        }
      } else if (error.message) {
        errMsg = error.message;
      }
      return rejectWithValue(errMsg);
    }
  }
);

// After login, backend returns user data (except password) and JWT token
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    user: localStorage.getItem('me-user') ? JSON.parse(localStorage.getItem('me-user')) : null,
    token: localStorage.getItem('me-token') || null,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.success = false;
    },
    resetLoginState: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
      // Remove both token and user from localStorage
      localStorage.removeItem('me-token');
      localStorage.removeItem('me-user');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
      // Remove both token and user from localStorage
      localStorage.removeItem('me-token');
      localStorage.removeItem('me-user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { success: true, user: {...}, token: "..." }
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        // Store both token and user in localStorage
        localStorage.setItem('me-token', action.payload.token);
        localStorage.setItem('me-user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.success = false;
      });
  },
});

export const { clearError, resetLoginState, logout } = loginSlice.actions;
export default loginSlice.reducer;
