import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../redux/ProductsSlice';
import { getProductUrl } from '../utils/urlUtils';
import { CircularProgress, Box } from '@mui/material';

// Component to handle old product URLs and redirect to new SEO-friendly format
const ProductRedirect = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct } = useSelector((state) => state.products || {});

  useEffect(() => {
    if (productId) {
      // Fetch product to get name for SEO URL
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (currentProduct && currentProduct._id === productId) {
      // Redirect to new SEO-friendly URL
      const newUrl = getProductUrl(currentProduct);
      navigate(newUrl, { replace: true });
    }
  }, [currentProduct, productId, navigate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <CircularProgress />
    </Box>
  );
};

export default ProductRedirect;