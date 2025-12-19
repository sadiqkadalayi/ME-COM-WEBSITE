import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch slider posts from backend
export const fetchSliderPosts = createAsyncThunk(

  
  'slider/fetchSliderPosts',
  async (_, thunkAPI) => {
    // Replace with your backend API endpoint
    const API_URL = process.env.REACT_APP_API_BASE_URL;
    const response = await axios.get(`${API_URL}/api/frond-end/slider-posts`);
    return response.data;
  }
);

const initialState = {
  posts: null, // null means not loaded yet
  status: 'idle',
  error: null,
};

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliderPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSliderPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchSliderPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default sliderSlice.reducer;
