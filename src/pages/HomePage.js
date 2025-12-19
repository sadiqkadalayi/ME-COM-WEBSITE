import React from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import SliderSection from '../components/SliderSection';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Search Bar */}
      <SearchBar />
      {/* Hero Section as Slider */}
      <SliderSection />

      {/* Brands Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our Brands
        </Typography>
        <Grid container spacing={3}>
          {/* Example brand cards */}
          {[1,2,3,4,5].map((brand) => (
            <Grid item xs={6} sm={4} md={2.4} key={brand}>
              <Box sx={{ background: '#fff', borderRadius: 2, p: 2, boxShadow: 1, textAlign: 'center' }}>
                <Box sx={{ width: 60, height: 60, background: '#eee', borderRadius: '50%', mx: 'auto', mb: 1 }} />
                <Typography variant="subtitle1">Brand {brand}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* New Arrivals Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          New Arrivals
        </Typography>
        <Grid container spacing={3}>
          {[1,2,3,4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Box sx={{ background: '#fff', borderRadius: 2, p: 2, boxShadow: 1 }}>
                <Box sx={{ width: '100%', height: 140, background: '#eee', borderRadius: 2, mb: 2 }} />
                <Typography variant="subtitle1">Product {item}</Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  View Details
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Shop by Collection Section */}
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Shop by Collection
        </Typography>
        <Grid container spacing={3}>
          {[1,2,3,4].map((col) => (
            <Grid item xs={12} sm={6} md={3} key={col}>
              <Box sx={{ background: '#fff', borderRadius: 2, p: 2, boxShadow: 1 }}>
                <Box sx={{ width: '100%', height: 100, background: '#eee', borderRadius: 2, mb: 2 }} />
                <Typography variant="subtitle1">Collection {col}</Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  Shop here
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
