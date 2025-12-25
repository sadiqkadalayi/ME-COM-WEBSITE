import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Async thunk to fetch homepage products grouped by category
export const fetchHomepageProducts = createAsyncThunk(
  'products/fetchHomepage',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching homepage products from:', `${API_BASE_URL}/api/fv1/products/homepage`);
      const response = await axios.get(`${API_BASE_URL}/api/fv1/products/homepage`);
      console.log('Homepage products response:', response.data);
      return response.data.data || {};
    } catch (error) {
      console.error('Homepage products error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch homepage products');
    }
  }
);

// Async thunk to fetch products by category slug with pagination
export const fetchProductsByCategorySlug = createAsyncThunk(
  'products/fetchByCategorySlug',
  async ({ categorySlug, limit = 12, page = 1, sortBy = 'created_at', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fv1/products/category/slug/${categorySlug}`, {
        params: { limit, page, sortBy, sortOrder }
      });
      return {
        categorySlug,
        category: response.data.category || {},
        products: response.data.products || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

// Async thunk to fetch category products for CategoryPage
export const fetchCategoryProducts = createAsyncThunk(
  'products/fetchCategoryProducts',
  async (categorySlug, { rejectWithValue }) => {
    try {
      console.log('Fetching category products for slug:', categorySlug);
      const response = await axios.get(`${API_BASE_URL}/api/fv1/products/category/slug/${categorySlug}`);
      console.log('Category products response:', response.data);
      return {
        products: response.data.products || [],
        category: response.data.category || {},
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      console.error('Category products error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch category products');
    }
  }
);

// Async thunk to fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fv1/products/${productId}`);
      return response.data.product || response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
    }
  }
);

// Async thunk to fetch all products with filters
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ page = 1, limit = 20, search, category, sortBy = 'created_at', sortOrder = 'desc', minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const params = { page, limit, sortBy, sortOrder };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      
      const response = await axios.get(`${API_BASE_URL}/api/fv1/products/all`, { params });
      return {
        products: response.data.products || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    // Homepage products grouped by category
    homepageProducts: {},
    // Products for category pages
    categoryProducts: [],
    currentCategory: {},
    // Single product details
    currentProduct: {},
    // All products (for search/browse pages)
    allProducts: [],
    // Loading states
    homepageLoading: false,
    categoryLoading: false,
    productLoading: false,
    allProductsLoading: false,
    // Error states
    homepageError: null,
    categoryError: null,
    productError: null,
    allProductsError: null,
    // Pagination info
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_products: 0,
      has_next: false,
      has_prev: false
    }
  },
  reducers: {
    clearHomepageProducts: (state) => {
      state.homepageProducts = {};
      state.homepageError = null;
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.currentCategory = {};
      state.categoryError = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = {};
      state.productError = null;
    },
    clearAllProducts: (state) => {
      state.allProducts = [];
      state.allProductsError = null;
      state.pagination = {
        current_page: 1,
        total_pages: 1,
        total_products: 0,
        has_next: false,
        has_prev: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch homepage products
      .addCase(fetchHomepageProducts.pending, (state) => {
        state.homepageLoading = true;
        state.homepageError = null;
      })
      .addCase(fetchHomepageProducts.fulfilled, (state, action) => {
        state.homepageLoading = false;
        state.homepageProducts = action.payload;
      })
      .addCase(fetchHomepageProducts.rejected, (state, action) => {
        state.homepageLoading = false;
        state.homepageError = action.payload;
      })
      
      // Fetch products by category slug
      .addCase(fetchProductsByCategorySlug.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const { category, products, pagination } = action.payload;
        state.currentCategory = category;
        state.categoryProducts = products;
        state.pagination = pagination;
      })
      .addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })
      
      // Fetch category products
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const { products, category, pagination } = action.payload;
        state.categoryProducts = products;
        state.currentCategory = category;
        state.pagination = pagination;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })
      
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsLoading = true;
        state.allProductsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsLoading = false;
        const { products, pagination } = action.payload;
        state.allProducts = products;
        state.pagination = pagination;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allProductsLoading = false;
        state.allProductsError = action.payload;
      });
  }
});

export const { 
  clearHomepageProducts, 
  clearCategoryProducts, 
  clearCurrentProduct, 
  clearAllProducts 
} = productsSlice.actions;
export default productsSlice.reducer;