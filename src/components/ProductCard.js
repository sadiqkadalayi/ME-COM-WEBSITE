import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  IconButton,
  Chip,
  Badge
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';

const ProductCard = ({ product, quantities, onQuantityChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart || {});
  
  // Find if this product is in cart and get quantity
  const cartItem = items.find(item => item.product._id === product._id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  
  const getProductImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      // Find thumbnail first, or use first image
      const thumbnail = product.images.find(img => img.is_thumbnail) || product.images[0];
      return thumbnail.cloudinary_url || '/api/placeholder/200/200';
    }
    return '/api/placeholder/200/200';
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = () => {
    const quantity = quantities[product._id] || 1;
    dispatch(addToCart({ product, quantity }));
  };

  return (
    <Card sx={{ 
      position: 'relative',
      width: '100%',
      height: 350,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
      },
      transition: 'all 0.3s ease',
      border: '1px solid #e5e5e5',
      borderRadius: 2,
      backgroundColor: '#fff',
      overflow: 'hidden'
    }}>
      {/* Cart Badge */}
      {cartQuantity > 0 && (
        <Chip
          label={`${cartQuantity} in cart`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: '#4caf50',
            color: 'white',
            fontSize: '10px',
            fontWeight: 600,
            zIndex: 2,
            height: '20px'
          }}
        />
      )}

      {/* Promotion Banner */}
        {/* <Box sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: '#FFD700',
          color: '#000',
          px: 1.5,
          py: 0.5,
          fontSize: '0.65rem',
          fontWeight: 'bold',
          borderRadius: 0.5,
          zIndex: 2,
          textTransform: 'uppercase'
        }}>
          X-Mas Promotion
        </Box> */}

        {/* Fixed Image Container */}
        <Box 
          sx={{
            width: '100%',
            height: 220,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer'
          }}
          onClick={handleProductClick}
        >
          <CardMedia
            component="img"
            sx={{
              width: '90%',
              height: '90%',
              objectFit: 'contain',
              padding: 2
            }}
            image={getProductImageUrl(product)}
            alt={product.product_name}
          />
        </Box>

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          pb: 1,
          '&:last-child': { pb: 1 }
        }}>
          {/* SKU */}
          <Typography 
            variant="caption"
            sx={{ 
              color: '#666',
              fontSize: '0.7rem',
              mb: 0.5,
              fontWeight: 500,
              textTransform: 'uppercase'
            }}
          >
            {product.sku}
          </Typography>

          {/* Product Name */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1,
              fontSize: '0.8rem',
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 32,
              maxHeight: 32,
              fontWeight: 500,
              color: '#333',
              wordBreak: 'break-word',
              textOverflow: 'ellipsis'
            }}
          >
            {product.product_name}
          </Typography>
          
          {/* Brand */}
          <Typography 
            variant="caption"
            sx={{ 
              color: '#888',
              fontSize: '0.7rem',
              mb: 1,
              textTransform: 'uppercase',
              fontWeight: 500
            }}
          >
            {product.brand}
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Quantity and Add Button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 'auto'
          }}>
            {product.current_stock === 0 ? (
              // Out of Stock Button - Full Width
              <Button 
                variant="contained"
                size="small"
                disabled
                fullWidth
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  py: 1,
                  height: 20,
                  backgroundColor: '#572929ff',
                  borderRadius: 1,
                  textTransform: 'uppercase',
                  color: '#666',
                  cursor: 'not-allowed',
                  '&:disabled': {
                    backgroundColor: '#721a1aff',
                    color: '#ece7e7ff'
                  }
                }}
              >
                OUT OF STOCK
              </Button>
            ) : (
              // In Stock - Quantity Input + Add Button
              <>
                <TextField
                  size="small"
                  type="number"
                  value={quantities[product._id] || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string for editing
                    if (value === '' || value === '0') {
                      onQuantityChange(product._id, '');
                      return;
                    }
                    const numValue = parseInt(value) || 1;
                    const clampedValue = Math.max(1, Math.min(numValue, product.current_stock));
                    onQuantityChange(product._id, clampedValue);
                  }}
                  onBlur={(e) => {
                    // When user leaves the field, ensure minimum value of 1
                    const currentValue = quantities[product._id];
                    if (currentValue === '' || currentValue < 1) {
                      onQuantityChange(product._id, 1);
                    }
                  }}
                  inputProps={{ 
                    min: 1,
                    max: product.current_stock,
                    style: { 
                      textAlign: 'center',
                      fontSize: '0.8rem'
                    }
                  }}
                  sx={{
                    width: 70,
                    '& .MuiOutlinedInput-root': {
                      height: 20,
                      borderRadius: 1
                    }
                  }}
                />

                <Button 
                  variant="contained"
                  size="small"
                  onClick={handleAddToCart}
                  sx={{ 
                    flexGrow: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    py: 1,
                    height: 20,
                    backgroundColor: '#2c3e50',
                    borderRadius: 1,
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: '#131f2fff',
                    }
                  }}
                >
                  ADD
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
  );
};

export default ProductCard;