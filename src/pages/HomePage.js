import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CircularProgress,
  Alert,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNavigationCategories } from '../redux/NavigationCategoriesSlice';
import { fetchHomepageProducts } from '../redux/ProductsSlice';
import SliderSection from '../components/SliderSection';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import sliderImage from '../assets/01.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories: navCategories, loading: categoriesLoading } = useSelector((state) => state.navigationCategories || {});
  const { homepageProducts, homepageLoading, homepageError } = useSelector((state) => state.products || {});
  
  const [quantities, setQuantities] = useState({});

  // Fetch categories and homepage products
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchNavigationCategories());
    dispatch(fetchHomepageProducts());
  }, [dispatch]);



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

  const handleShowMore = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  if (categoriesLoading || homepageLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading products...</Typography>
      </Container>
    );
  }

  if (homepageError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {homepageError}
        </Alert>
        <Button onClick={() => dispatch(fetchHomepageProducts())} variant="outlined">
          Retry Loading Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, pb: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mt: { xs: 6, md: 0 } }}>
        <SearchBar />
      </Box>
      
      {/* Hero Section as Slider - Fixed dimensions */}
      <Box sx={{ 
        width: '100%',
        height: { xs: '100px', md: '300px' },
        mb: 2,
        overflow: 'hidden',
        borderRadius: 2,
        backgroundColor: '#f5f5f5'
      }}>
        {/* Display the 01.jpg image to check size */}
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center'
          }}
          image={sliderImage}
          alt="ME Gift Packs Slider"
        />
      </Box>

      {/* Category-based Product Sections */}
      {homepageProducts && Object.keys(homepageProducts).length > 0 ? (
        Object.entries(homepageProducts).map(([categoryId, categoryData]) => {
          console.log(`Rendering Category: ${categoryData.category?.name}, ID: ${categoryId}, Products:`, categoryData);
          
          // Skip categories with no products
          if (!categoryData || !categoryData.products || categoryData.products.length === 0) {
            return (
              <Box key={categoryId} sx={{ mb: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                <Typography variant="h5" color="text.secondary">
                  {categoryData.category?.name || 'Unknown Category'} - No products available
                </Typography>
              </Box>
            );
          }

          return (
            <Box key={categoryId} sx={{ mb: 8 }}>
              {/* Row 1: Category Title */}
              <Box sx={{ 
                mb: 3,
                px: 1
              }}>
                <Typography 
                  variant="h4" 
                  fontWeight={600}
                  sx={{ 
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '1.5rem'
                  }}
                >
                  {categoryData.category?.name || 'Products'}
                </Typography>
              </Box>
              
              {/* Row 2: Exactly 6 Product Cards in Single Row */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
                px: 1,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                maxWidth: '100%'
              }}>
                {/* Show exactly 6 products in a row */}
                {categoryData.products.slice(0, 6).map(product => (
                  <Box key={product._id} sx={{ 
                    flex: { xs: '0 0 calc(50% - 8px)', md: '0 0 auto' },
                    width: { xs: 'calc(50% - 8px)', md: 200 },
                    maxWidth: { xs: '180px', md: '200px' }
                  }}>
                    <ProductCard 
                      product={product}
                      quantities={quantities}
                      onQuantityChange={handleQuantityChange}
                    />
                  </Box>
                ))}
                
                {/* Fill empty slots if less than 6 products to always show 6 slots */}
                {Array.from({ 
                  length: Math.max(0, 6 - categoryData.products.length) 
                }, (_, index) => (
                  <Box key={`empty-${categoryId}-${index}`} sx={{ 
                    flex: { xs: '0 0 calc(50% - 8px)', md: '0 0 auto' },
                    width: { xs: 'calc(50% - 8px)', md: 200 },
                    maxWidth: { xs: '180px', md: '200px' },
                    display: { xs: index >= 2 ? 'none' : 'block', md: 'block' }
                  }}>
                    <Card sx={{ 
                      width: '100%',
                      height: 450,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9f9f9',
                      border: '2px dashed #ddd',
                      borderRadius: 2
                    }}>
                      <Typography color="text.secondary" sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                        More products<br />coming soon
                      </Typography>
                    </Card>
                  </Box>
                ))}
              </Box>

              {/* Row 3: Show More Button */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                px: 1
              }}>
                <Button 
                  variant="outlined"
                  onClick={() => handleShowMore(categoryData.category?.slug)}
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    px: 3,
                    py: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                      color: 'white'
                    }
                  }}
                >
                  SHOW MORE
                </Button>
              </Box>
            </Box>
          );
        })
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No products available at the moment
          </Typography>
          <Typography color="text.secondary">
            Please check back later or contact us for more information.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
