import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Button,
  IconButton,
  TextField,
  Grid,
  Card,
  CardMedia,
  Divider,
  Breadcrumbs,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Remove as RemoveIcon, 
  Add as AddIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/CartSlice';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);

  // State for checkout flow
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isUserLoggedIn = () => {
    return Boolean(localStorage.getItem('me-token'));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      navigate('/login?from=cart');
      return;
    }

    // Show confirmation dialog
    setCheckoutConfirmOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    setCheckoutConfirmOpen(false);
    setCheckoutLoading(true);

    try {
      // Get user email from localStorage
      const userData = JSON.parse(localStorage.getItem('me-user') || '{}');
      const userEmail = userData.email;

      if (!userEmail) {
        throw new Error('User email not found. Please login again.');
      }

      // Prepare order data
      const orderData = {
        customer_email: userEmail,
        is_guest_order: false,
        items: items.map(item => ({
          product_id: item.product._id,
          quantity: item.quantity
        })),
        shipping_address: {
          full_name: userData.name || userData.first_name + ' ' + userData.last_name || 'Customer',
          phone: userData.phone || '123456789',
          email: userEmail,
          address_line_1: userData.address || 'Address Line 1',
          city: userData.city || 'Dubai',
          country: 'UAE'
        },
        payment_method: 'cash_on_delivery',
        customer_notes: customerNotes || 'Order placed from website',
        discount_amount: 0,
        shipping_method: 'standard'
      };

      // Make API call to create order
      const response = await axios.post(`${API_BASE_URL}/api/fv1/orders/create`, orderData);

      if (response.data.success) {
        setOrderNumber(response.data.order_number);
        setCheckoutSuccess(true);
        
        // Clear cart after successful order
        dispatch(clearCart());
        
        // Show success message
        setTimeout(() => {
          setCheckoutSuccess(false);
          navigate('/');
        }, 5000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.response?.data?.error || error.message || 'Checkout failed. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setCheckoutConfirmOpen(false);
    navigate('/');
  };

  const handleRegisterRedirect = () => {
    navigate('/register?from=cart');
  };

  const getProductImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const thumbnail = product.images.find(img => img.is_thumbnail) || product.images[0];
      return thumbnail.cloudinary_url || '/api/placeholder/100/100';
    }
    return '/api/placeholder/100/100';
  };

  // Calculate total without taxes
  const subtotal = totalAmount;
  const total = subtotal;

  if (items.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 5, pb: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary' }}>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleContinueShopping}
            sx={{ fontSize: 12 }}
          >
            Continue Shopping
          </Button>
        </Box>
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
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 11 }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 11 }}>
            Review Order
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Progress Steps */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          label="Review Order" 
          sx={{ 
            backgroundColor: '#1976d2', 
            color: 'white',
            fontSize: 11,
            fontWeight: 600
          }} 
        />
        <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Chip 
          label="Shipping" 
          variant="outlined" 
          sx={{ fontSize: 11, color: 'text.secondary' }}
        />
        <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Chip 
          label="Payment" 
          variant="outlined" 
          sx={{ fontSize: 11, color: 'text.secondary' }}
        />
      </Box>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Order overview
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side - Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600 }}>
              Cart Items ({totalItems})
            </Typography>
            <Button 
              onClick={handleClearCart} 
              color="error" 
              size="small"
              sx={{ fontSize: 11 }}
            >
              Clear Cart
            </Button>
          </Box>

          {/* Cart Items List */}
          <Box sx={{ mb: 4 }}>
            {items.map((item, index) => (
              <Paper key={item.product._id} sx={{ p: 3, mb: 2, border: '1px solid #e5e5e5' }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {/* Product Image */}
                  <Card sx={{ width: 80, height: 80, flexShrink: 0 }}>
                    <CardMedia
                      component="img"
                      image={getProductImageUrl(item.product)}
                      alt={item.product.product_name}
                      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Card>

                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontSize: 14, fontWeight: 600 }}>
                      {item.product.product_name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>
                      SKU: {item.product.sku}
                    </Typography>
                    {item.product.color && (
                      <Typography variant="body2" sx={{ fontSize: 11, color: 'text.secondary' }}>
                        Color: {item.product.color}
                      </Typography>
                    )}
                  </Box>

                  {/* Quantity Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <TextField
                      size="small"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(item.product._id, value);
                      }}
                      inputProps={{ 
                        min: 1,
                        max: item.product.current_stock || 999,
                        style: { textAlign: 'center', fontSize: '11px', width: '50px' }
                      }}
                      sx={{ width: 60 }}
                    />
                    
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product.current_stock || 999)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Price and Remove */}
                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
                      {(item.product.price * item.quantity).toFixed(2)} {item.product.currency || 'AED'}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Right Side - Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontSize: 12 }}>Subtotal</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                {subtotal.toFixed(2)} AED
              </Typography>
            </Box>

            {/* Customer Notes */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1 }}>Additional Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Any special requests or concerns you'd like to share with us..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                sx={{ 
                  '& .MuiInputBase-root': { fontSize: 11 }
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Total</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                {total.toFixed(2)} AED
              </Typography>
            </Box>

            {/* Gift Card / Discount Code */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Gift card or discount code..."
                InputProps={{
                  endAdornment: (
                    <Button size="small" sx={{ fontSize: 11 }}>
                      APPLY
                    </Button>
                  ),
                }}
                sx={{ 
                  '& .MuiInputBase-root': { fontSize: 11 }
                }}
              />
            </Box>

            {/* Checkout Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              sx={{
                py: 1.5,
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: '#1976d2',
                mb: 2,
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              {checkoutLoading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <>Checkout <ArrowForwardIcon sx={{ ml: 1, fontSize: 16 }} /></>
              )}
            </Button>

            {/* Continue Shopping */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 11, mb: 1, color: 'text.secondary' }}>
                or
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={handleContinueShopping}
                sx={{ 
                  fontSize: 11, 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  border: 'none',
                  background: 'none',
                  color: '#1976d2'
                }}
              >
                ← Continue shopping
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout Confirmation Dialog */}
      <Dialog
        open={checkoutConfirmOpen}
        onClose={() => setCheckoutConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ready to Checkout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you have any other items to add to your cart before proceeding with checkout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleContinueShopping}
            variant="outlined"
            sx={{ fontSize: 12 }}
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={handleCheckoutConfirm}
            variant="contained"
            disabled={checkoutLoading}
            sx={{ fontSize: 12 }}
          >
            {checkoutLoading ? <CircularProgress size={20} /> : 'Proceed to Checkout'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={checkoutSuccess}
        autoHideDuration={5000}
        onClose={() => setCheckoutSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            Your order number is: <strong>{orderNumber}</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 11, mt: 1 }}>
            A confirmation email has been sent to your email address. Redirecting to home page...
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(checkoutError)}
        autoHideDuration={6000}
        onClose={() => setCheckoutError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setCheckoutError('')} sx={{ width: '100%' }}>
          {checkoutError}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default CartPage;