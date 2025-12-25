import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;

// Async thunk for user registration with auto-login
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Use environment variable for API base URL
      const response = await axios.post(`${API_BASE_URL}/api/fv1/auth/register`, userData);
      
      // If registration successful, automatically login
      if (response.data.success) {
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/api/fv1/auth/login`, {
            email: userData.email,
            password: userData.password
          });
          return {
            ...response.data,
            autoLogin: loginResponse.data
          };
        } catch (loginError) {
          // Registration successful but login failed, return registration data
          return response.data;
        }
      }
      
      return response.data;
    } catch (error) {
      let errMsg = 'Registration failed';
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

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    loading: false,
    user: null,
    error: null,
    success: false,
    autoLoginSuccess: false,
  },
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      state.success = false;
      state.autoLoginSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.autoLoginSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.success = true;
        
        // Handle auto-login if successful
        if (action.payload.autoLogin) {
          state.autoLoginSuccess = true;
          // Store token and user for auto-login
          localStorage.setItem('me-token', action.payload.autoLogin.token);
          localStorage.setItem('me-user', JSON.stringify(action.payload.autoLogin.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.success = false;
        state.autoLoginSuccess = false;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
