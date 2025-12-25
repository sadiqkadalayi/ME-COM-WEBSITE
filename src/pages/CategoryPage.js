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
import HomeIcon from '@mui/icons-material/Home';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { categoryProducts, categoryLoading, categoryError, currentCategory, pagination } = useSelector((state) => state.products || {});
  const { categories: navCategories } = useSelector((state) => state.navigationCategories || {});
  
  // Pagination and display states
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 6 cards x 2 rows = 12
  const [quantities, setQuantities] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [],
    sortBy: 'best-selling'
  });
  
  // Sample filter data (you can fetch this from backend)
  const priceRanges = [
    { label: 'QR0.00 - QR25.00', min: 0, max: 25 },
    { label: 'QR25.00 - QR50.00', min: 25, max: 50 },
    { label: 'QR50.00 - QR75.00', min: 50, max: 75 },
    { label: 'QR75.00 - QR100.00', min: 75, max: 100 },
    { label: 'QR100.00 - QR250.00', min: 100, max: 250 },
    { label: 'QR250.00+', min: 250, max: 999999 }
  ];
  
  const brands = [
    'dept store', 'Vegetable', 'Nivea', 'Dove', 'Fruit', 'Gillan', 'Gaepia', 'Baladna'
  ];

  // Fetch category products
  useEffect(() => {
    if (categorySlug) {
      dispatch(fetchCategoryProducts(categorySlug));
    }
  }, [dispatch, categorySlug]);

  // Handle quantity changes
  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [productId]: qty
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    console.log(`Added ${quantity} of product ${productId} to cart`);
    // TODO: Implement add to cart functionality
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
  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [range.min, range.max]
    }));
  };

  const handleBrandChange = (brand, checked) => {
    setFilters(prev => ({
      ...prev,
      brands: checked 
        ? [...prev.brands, brand]
        : prev.brands.filter(b => b !== brand)
    }));
  };

  // Calculate pagination - use backend pagination
  const totalProducts = pagination?.total_products || 0;
  const totalPages = pagination?.total_pages || 1;
  const currentProducts = categoryProducts || [];

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
    <Container maxWidth="xl" sx={{ mt: 2, pb: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            HOME
          </Link>
          <Link underline="hover" sx={{ cursor: 'pointer' }}>
            SPECIAL PROMOTION
          </Link>
          <Typography color="text.primary">
            {currentCategory?.name || 'Category'}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {currentCategory?.name || 'Products'} ({totalProducts})
      </Typography>

      <Grid container spacing={3}>
        {/* Left Sidebar - Filters */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, mb: 2 }}>
            {/* Shop by Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                backgroundColor: '#8b1538', 
                color: 'white', 
                p: 1, 
                mb: 2, 
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                SHOP BY PRICE
              </Typography>
              <FormGroup>
                {priceRanges.map((range, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox 
                        size="small"
                        onChange={(e) => handlePriceRangeChange(range)}
                      />
                    }
                    label={<Typography variant="body2">{range.label}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Popular Brands */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                backgroundColor: '#8b1538', 
                color: 'white', 
                p: 1, 
                mb: 2, 
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                POPULAR BRANDS
              </Typography>
              <FormGroup>
                {brands.map((brand, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox 
                        size="small"
                        onChange={(e) => handleBrandChange(brand, e.target.checked)}
                      />
                    }
                    label={<Typography variant="body2">{brand}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </Card>
        </Grid>

        {/* Right Content - Products */}
        <Grid item xs={12} md={9}>
          {/* Sort and Items per page controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Sort By:</Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <MenuItem value="best-selling">Best Selling</MenuItem>
                  <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Products Per Page:</Typography>
              <FormControl size="small">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={36}>36</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Products Grid - Exactly 6 cards per row */}
          {currentProducts.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {currentProducts.map((product) => (
                <Grid item xs={6} sm={4} md={2} key={product._id}>
                  <ProductCard
                    product={product}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={() => handleAddToCart(product._id)}
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
                Page {pagination?.current_page || 1} of {totalPages} ({totalProducts} total items)
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryPage;