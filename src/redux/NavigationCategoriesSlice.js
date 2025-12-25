import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Fetch navigation categories
export const fetchNavigationCategories = createAsyncThunk(
  'categories/fetchNavigation',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching navigation categories from:', `${API_BASE_URL}/api/categories/navigation`);
      const response = await fetch(`${API_BASE_URL}/api/categories/navigation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      console.log('Navigation categories response:', data);
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const navigationCategoriesSlice = createSlice({
  name: 'navigationCategories',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavigationCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNavigationCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchNavigationCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = navigationCategoriesSlice.actions;
export default navigationCategoriesSlice.reducer;