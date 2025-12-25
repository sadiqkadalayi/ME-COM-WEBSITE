import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Slider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoryProducts } from '../redux/ProductsSlice';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import HomeIcon from '@mui/icons-material/Home';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { categoryProducts, categoryLoading, categoryError, currentCategory, pagination } = useSelector((state) => state.products || {});
  const { categories: navCategories } = useSelector((state) => state.navigationCategories || {});
  
  // Safety checks for Redux state
  const safeProducts = categoryProducts || [];
  const safePagination = pagination || { total_products: 0, total_pages: 1, current_page: 1 };
  const safeCurrentCategory = currentCategory || { name: 'Category' };
  
  // Pagination and display states
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 6 cards x 2 rows = 12
  const [quantities, setQuantities] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    priceRange: [0, 1000],
    sortBy: 'best-selling'
  });

  // Fetch category products and scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    if (categorySlug) {
      dispatch(fetchCategoryProducts(categorySlug));
    }
  }, [dispatch, categorySlug]);

  // Handle quantity changes
  const handleQuantityChange = (productId, value) => {
    // Allow empty string for editing
    if (value === '' || value === '0') {
      setQuantities(prev => ({
        ...prev,
        [productId]: ''
      }));
      return;
    }
    
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [productId]: qty
    }));
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
  };

  // Filter handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Apply filters to product list
  };

  // Calculate pagination - use backend pagination
  const totalProducts = safePagination.total_products || 0;
  const totalPages = safePagination.total_pages || 1;
  const currentProducts = safeProducts || [];

  if (categoryLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading products...</Typography>
      </Container>
    );
  }

  if (categoryError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {categoryError}
        </Alert>
        <Button onClick={() => dispatch(fetchCategoryProducts(categorySlug))} variant="outlined">
          Retry Loading Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 5, pb: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link underline="hover" sx={{ cursor: 'pointer' }}>
            Category
          </Link>
          <Typography color="text.primary">
            {safeCurrentCategory.name || 'Category'}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Page Title */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 400 }}>
        {safeCurrentCategory.name || 'Products'} ({totalProducts})
      </Typography>

      <Grid container spacing={3}>
        {/* Left Sidebar - Filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <CategorySidebar 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </Grid>

        {/* Right Content - Products */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Sort and Items per page controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
              <Typography variant="body2" sx={{ fontSize: 11 }}>Sort By:</Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="best-selling" sx={{ fontSize: 11 }}>Best Selling</MenuItem>
                  <MenuItem value="price-low-high" sx={{ fontSize: 11 }}>Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low" sx={{ fontSize: 11 }}>Price: High to Low</MenuItem>
                  <MenuItem value="newest" sx={{ fontSize: 11 }}>Newest</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontSize: 11 }}>Products Per Page:</Typography>
              <FormControl size="small">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value={12} sx={{ fontSize: 11 }}>12</MenuItem>
                  <MenuItem value={24} sx={{ fontSize: 11 }}>24</MenuItem>
                  <MenuItem value={36} sx={{ fontSize: 11 }}>36</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Products Grid - Exactly 6 cards per row */}
          {currentProducts.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {currentProducts.map((product) => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={product._id}>
                  <ProductCard
                    product={product}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No products found in this category
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              mt: 4
            }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Page {safePagination.current_page || 1} of {totalPages} ({totalProducts} total items)
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryPage;