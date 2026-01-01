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
import { removeFromCart, updateQuantity, clearCart, addToCart, addDuplicateToCart } from '../redux/CartSlice';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);

  // State for checkout flow
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false);
  const [guestCheckoutOpen, setGuestCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Stock notification state
  const [stockNotification, setStockNotification] = useState({
    open: false,
    message: ''
  });

  // Empty quantity modal state
  const [emptyQuantityModal, setEmptyQuantityModal] = useState({
    open: false,
    itemIndex: null,
    newQuantity: ''
  });

  // Guest checkout form data
  const [guestData, setGuestData] = useState({
    companyName: '',
    individualName: '',
    email: '',
    mobile: '',
    countryCode: '+971' // Default UAE
  });
  const [customerNotes, setCustomerNotes] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isUserLoggedIn = () => {
    return Boolean(localStorage.getItem('me-token'));
  };

  const handleQuantityChange = (itemIndex, newQuantity) => {
    // If quantity is empty or 0, show the empty quantity modal
    if (newQuantity === '' || newQuantity === 0) {
      setEmptyQuantityModal({
        open: true,
        itemIndex: itemIndex,
        newQuantity: ''
      });
      return;
    }

    if (newQuantity < 1) return;
    
    // Check if quantity exceeds stock and show notification
    const item = items[itemIndex];
    const stockQuantity = item.product.current_stock || 0;
    
    if (newQuantity > stockQuantity) {
      setStockNotification({
        open: true,
        message: `You are requesting ${newQuantity} pieces, but we currently have only ${stockQuantity} pieces in stock. We can manufacture additional quantities upon order confirmation.`
      });
    }
    
    // Get the item and dispatch the Redux action properly
    dispatch(updateQuantity({ 
      productId: item.product._id, 
      quantity: newQuantity, 
      cartId: item.cartId 
    }));
  };

  // Handle confirming quantity from modal
  const handleConfirmQuantity = () => {
    const quantity = parseInt(emptyQuantityModal.newQuantity);
    if (quantity && quantity > 0) {
      handleQuantityChange(emptyQuantityModal.itemIndex, quantity);
    }
    setEmptyQuantityModal({ open: false, itemIndex: null, newQuantity: '' });
  };

  // Handle removing item from empty quantity modal
  const handleRemoveFromModal = () => {
    handleRemoveItem(emptyQuantityModal.itemIndex);
    setEmptyQuantityModal({ open: false, itemIndex: null, newQuantity: '' });
  };

  const handleRemoveItem = (itemIndex) => {
    // Remove by dispatching Redux action with proper identifiers
    const item = items[itemIndex];
    dispatch(removeFromCart({ 
      productId: item.product._id, 
      cartId: item.cartId 
    }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // Show guest checkout option popup instead of checking login
    setGuestCheckoutOpen(true);
  };

  const handleDuplicateItem = (product) => {
    // Add same product as a duplicate entry with quantity 1
    dispatch(addDuplicateToCart({ product, quantity: 1 }));
  };

  const handleCheckoutConfirm = async () => {
    setCheckoutConfirmOpen(false);
    setCheckoutLoading(true);

    try {
      // Prepare complete order data (same structure as before, just with guest info)
      const orderData = {
        customer_email: guestData.email,
        is_guest_order: true,
        items: items.map(item => ({
          product_id: item.product._id,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price || 0,
          total_price: (item.product.price || 0) * item.quantity
        })),
        shipping_address: {
          full_name: guestData.individualName,
          company_name: guestData.companyName,
          phone: `${guestData.countryCode}${guestData.mobile}`,
          email: guestData.email,
          address_line_1: guestData.companyName || 'Company Address',
          city: 'Dubai',
          country: 'UAE'
        },
        payment_method: 'enquiry',
        customer_notes: customerNotes || 'Guest enquiry from website',
        discount_amount: 0,
        shipping_method: 'standard',
        guestData: guestData
      };

      console.log('🚀 Sending guest enquiry:', orderData);

      const response = await axios.post(`${API_BASE_URL}/api/website/guest-checkout`, orderData);

      if (response.data.success) {
        setOrderNumber(response.data.order_number);
        setCheckoutLoading(false); // Reset loading state
        setCheckoutSuccess(true);
        
        // Clear cart after successful enquiry
        dispatch(clearCart());
        
        // Clear guest form
        setGuestData({
          companyName: '',
          individualName: '',
          email: '',
          mobile: '',
          countryCode: '+971'
        });
        setCustomerNotes('');

        // Auto redirect after success message
        setTimeout(() => {
          setCheckoutSuccess(false);
          navigate('/');
        }, 3000);
      } else {
        setCheckoutError('Failed to submit enquiry. Please try again.');
        setCheckoutLoading(false); // Reset loading state on error
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

          {/* Highlight Notification for Multiple Quantity */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              backgroundColor: '#e3f2fd', 
              border: '1px solid #2196f3',
              fontSize: 12,
              '& .MuiAlert-icon': {
                fontSize: 16
              }
            }}
          >
            💡 <strong>Need multiple quantity pricing?</strong> Use the "Another Quantity" button to add the same product with different quantities.
          </Alert>

          {/* Cart Items List */}
          <Box sx={{ mb: 4 }}>
            {items.map((item, index) => (
              <Paper key={item.cartId || item.product._id + '_' + index} sx={{ p: 3, mb: 2, border: '1px solid #e5e5e5' }}>
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
                      onClick={() => handleQuantityChange(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <TextField
                      size="small"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleQuantityChange(index, '');
                        } else {
                          const numValue = parseInt(value) || 0;
                          handleQuantityChange(index, numValue);
                        }
                      }}
                      inputProps={{ 
                        min: 1,
                        style: { textAlign: 'center', fontSize: '10px', width: '150px' }
                      }}
                      sx={{ width: 60 }}
                    />
                    
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Duplicate Button and Remove */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleDuplicateItem(item.product)}
                      sx={{ fontSize: '10px', py: 0.5 }}
                    >
                      Another Quantity
                    </Button>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Right Side - Enquiry Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            {/* Items Count */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontSize: 12 }}>Total Items</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                {totalItems} items
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
                backgroundColor: '#0b3a4a',
                mb: 2,
                '&:hover': {
                  backgroundColor: '#1c586eff'
                }
              }}
            >
              {checkoutLoading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <>REQUEST QUOTE <ArrowForwardIcon sx={{ ml: 1, fontSize: 16 }} /></>
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
                  color: '#0b3a4a'
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
            {checkoutLoading ? <CircularProgress size={20} /> : 'Send Enquiry'}
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

      {/* Guest Checkout Modal */}
      <Dialog open={guestCheckoutOpen} onClose={() => setGuestCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout Options</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose how you'd like to proceed with your enquiry:
          </DialogContentText>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => {
                setGuestCheckoutOpen(false);
                setCheckoutConfirmOpen(true);
              }}
            >
              Continue as Guest
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setGuestCheckoutOpen(false);
                navigate('/login?from=cart');
              }}
            >
              Sign In
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Guest Form Modal */}
      <Dialog open={checkoutConfirmOpen} onClose={() => setCheckoutConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Guest Enquiry Form</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Company Name"
              fullWidth
              value={guestData.companyName}
              onChange={(e) => setGuestData(prev => ({ ...prev, companyName: e.target.value }))}
              required
            />
            <TextField
              label="Individual Name"
              fullWidth
              value={guestData.individualName}
              onChange={(e) => setGuestData(prev => ({ ...prev, individualName: e.target.value }))}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={guestData.email}
              onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Country Code"
                value={guestData.countryCode}
                onChange={(e) => setGuestData(prev => ({ ...prev, countryCode: e.target.value }))}
                sx={{ width: 120 }}
                select
                SelectProps={{ native: true }}
              >
                <option value="+971">+971 (UAE)</option>
                <option value="+966">+966 (SA)</option>
                <option value="+965">+965 (KW)</option>
                <option value="+974">+974 (QA)</option>
                <option value="+968">+968 (OM)</option>
                <option value="+973">+973 (BH)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
              </TextField>
              <TextField
                label="Mobile Number"
                fullWidth
                value={guestData.mobile}
                onChange={(e) => setGuestData(prev => ({ ...prev, mobile: e.target.value }))}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutConfirmOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCheckoutConfirm}
            disabled={!guestData.companyName || !guestData.individualName || !guestData.email || !guestData.mobile}
          >
            Send Enquiry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Notification */}
      <Snackbar
        open={stockNotification.open}
        autoHideDuration={8000}
        onClose={() => setStockNotification({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          onClose={() => setStockNotification({ open: false, message: '' })} 
          sx={{ width: '100%' }}
        >
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {stockNotification.message}
          </Typography>
        </Alert>
      </Snackbar>

      {/* Empty Quantity Modal */}
      <Dialog open={emptyQuantityModal.open} onClose={() => setEmptyQuantityModal({ open: false, itemIndex: null, newQuantity: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Quantity Required</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter a quantity or remove this item from your enquiry:
          </DialogContentText>
          <TextField
            fullWidth
            label="Enter Quantity"
            type="number"
            value={emptyQuantityModal.newQuantity}
            onChange={(e) => setEmptyQuantityModal(prev => ({ ...prev, newQuantity: e.target.value }))}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button 
            color="error" 
            onClick={handleRemoveFromModal}
            startIcon={<DeleteIcon />}
          >
            Remove Item
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmQuantity}
            disabled={!emptyQuantityModal.newQuantity || parseInt(emptyQuantityModal.newQuantity) < 1}
          >
            Confirm Quantity
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default CartPage;