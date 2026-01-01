import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Button,
  Card,
  CardMedia,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../redux/ProductsSlice';
import { addToCart } from '../redux/CartSlice';
import { getProductUrl } from '../utils/urlUtils';
import { 
  generateProductSEO, 
  generateProductStructuredData, 
  generateBreadcrumbStructuredData,
  updateDocumentHead, 
  addStructuredData 
} from '../utils/seoUtils';

const ProductDetailsPage = () => {
  const { productTitle, productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get product data from Redux store
  const { currentProduct: product, productLoading, productError } = useSelector((state) => state.products || {});
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  // Fetch product data when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    
    // Clear product data when component unmounts
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  // Update selected color when product data loads
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // SEO optimization when product loads
  useEffect(() => {
    if (product) {
      // Generate SEO data
      const seoData = generateProductSEO(product);
      
      // Update document head with meta tags
      updateDocumentHead(seoData);
      
      // Generate and add structured data
      const productStructuredData = generateProductStructuredData(product);
      
      // Generate breadcrumb structured data
      const breadcrumbs = [
        { name: 'Home', url: window.location.origin },
        { name: 'Products', url: `${window.location.origin}/products` },
        { name: product.product_name, url: window.location.href }
      ];
      const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbs);
      
      // Combine structured data
      const combinedStructuredData = [productStructuredData, breadcrumbStructuredData];
      addStructuredData(combinedStructuredData);
    }
  }, [product]);

  // Helper function to get product images
  const getProductImages = () => {
    if (product && product.images && product.images.length > 0) {
      return product.images;
    }
    return [{ cloudinary_url: '/api/placeholder/400/400', is_thumbnail: true }];
  };

  const handleQuantityChange = (value) => {
    // Allow empty string for editing, but ensure it's not negative
    if (value === '' || value === '0') {
      setQuantity('');
      return;
    }
    
    const qty = Math.max(1, Math.min(parseInt(value) || 1, product?.current_stock || 999));
    setQuantity(qty);
  };

  const handleQuantityBlur = () => {
    // When user leaves the field, ensure minimum value of 1
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    const qty = quantity === '' ? 1 : quantity;
    dispatch(addToCart({ product, quantity: qty }));
    // Show success message or navigate to cart
    console.log(`Added ${qty} of ${product?.product_name} to cart`);
  };

  // Loading state
  if (productLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading product details...</Typography>
      </Container>
    );
  }

  // Error state
  if (productError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {productError}
        </Alert>
        <Button onClick={() => dispatch(fetchProductById(productId))} variant="outlined">
          Retry Loading Product
        </Button>
      </Container>
    );
  }

  // No product found
  if (!product || !product._id) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Product not found
        </Alert>
        <Button onClick={() => navigate('/')} variant="outlined">
          Go Home
        </Button>
      </Container>
    );
  }

  const images = getProductImages();
  const totalPriceForMain = ((product.price || 0) ).toFixed(2);
  const totalPrice = ((product.price || 0) * quantity).toFixed(2);


  return (
    <Container maxWidth="xl" sx={{ mt: 5, pb: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        {/* <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ fontSize: 12 }}
        >
          Back
        </Button> */}
      </Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 11 }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            All Products
          </Link>
          {product.categories && product.categories.length > 0 && (
            <Link underline="hover" sx={{ cursor: 'pointer',fontSize: 11 }}>
              {product.categories[0].name}
            </Link>
          )}
          <Typography color="text.primary" sx={{ fontSize: 11 }}>
            {product.sku || product.product_name}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side - Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* New Badge */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            {/* Only show "New!" badge if product is less than 30 days old */}
            {product.created_at && new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
              <Chip 
                label="New!" 
                sx={{ 
                  backgroundColor: '#1976d2',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 2
                }}
              />
            )}
            
            {/* Main Image */}
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'contain',
                  p: 2
                }}
                image={images[selectedImage]?.cloudinary_url}
                alt={product.product_name}
              />
            </Card>

            {/* Thumbnail Images */}
            <Grid container spacing={1}>
              {images.map((image, index) => (
                <Grid size={{ xs: 3 }} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { borderColor: '#1976d2' }
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'contain',
                        p: 1
                      }}
                      image={image.cloudinary_url}
                      alt={`${product.product_name} ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Available Colors:
              </Typography>
              <Grid container spacing={2}>
                {product.colors.map((color, index) => (
                  <Grid size={{ xs: 4 }} key={index}>
                    <Card 
                      sx={{ 
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: selectedColor === color ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        '&:hover': { borderColor: '#1976d2' }
                      }}
                      onClick={() => setSelectedColor(color)}
                    >
                      <Typography variant="caption" sx={{ fontSize: 12 }}>
                        {color}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Right Side - Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {product.product_name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                Item Code:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {product.sku}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                Item Color:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {product.color}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                mr: 1
              }}
            />
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
              In Stock ({product.current_stock}+ units)
            </Typography>
          </Box>

          {/* Expandable Sections */}
          <Box sx={{ mb: 4 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Item Description
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Specifications
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                        {spec.label}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {spec.value}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {product.material && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                          Material:
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {product.material}
                        </Typography>
                      </Box>
                    )}
                    {product.weight && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                          Weight:
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {product.weight}
                        </Typography>
                      </Box>
                    )}
                    {product.size && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                          Size:
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {product.size}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Downloads
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontSize: 12 }}>
                  No downloads available for this product.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Order Configurator */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              ORDER CONFIGURATOR
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                ENTER QUANTITY:
              </Typography>
              <TextField
                size="small"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleQuantityBlur}
                inputProps={{ min: 1, max: product.current_stock || 999 }}
                sx={{ width: 100 }}
              />
              <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                Available: {product.current_stock || 0} units
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                CHOOSE BRANDING OPTIONS:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary' }}>
                No Branding Options defined for this Product.
              </Typography>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="outlined"
              fullWidth
              onClick={handleAddToCart}
              sx={{ 
                py: 1.5,
                fontSize: 12,
                fontWeight: 'bold',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              ADD TO ENQUIRY
            </Button>
            
            <Button 
              variant="contained"
              fullWidth
              sx={{ 
                py: 1.5,
                fontSize: 12,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              PERSONALIZE
            </Button>
          </Box>

          {/* Production Timeline */}
          <Paper sx={{ p: 3, backgroundColor: '#f0f0f0' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Production Timeline <span style={{ fontSize: 12, fontWeight: 'normal' }}>(excluding delivery)</span>
            </Typography>
            
            <Typography variant="body2" sx={{ fontSize: 12, mb: 1 }}>
              <strong>Pre-Production Sample: 2-3 working days</strong>
            </Typography>
            
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              <strong>Bulk Production: 4-5 working days</strong> after approval of Pre-Production Sample.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailsPage;