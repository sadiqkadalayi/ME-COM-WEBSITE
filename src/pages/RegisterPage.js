import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, MenuItem, InputLabel, FormControl } from '@mui/material';


const RegisterPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    nationality: '',
    deliveryArea: '',
    building: '',
    street: '',
    city: '',
    country: 'Qatar',
    province: '',
    zone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <Box sx={{ minHeight: '80vh', pt: 6, bgcolor: '#fafbfc', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 1100, width: '100%', borderRadius: 3, boxShadow: 6, p: 0 }}>
        <CardContent sx={{ p: { xs: 2, md: 6 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#222', textAlign: 'center' }}>
            New Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="flex-start" sx={{ rowGap: 1.5, columnGap: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Email Address</InputLabel>
                <TextField name="email" value={form.email} onChange={handleChange} placeholder="Email Address" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Confirm Password</InputLabel>
                <TextField name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Phone Number</InputLabel>
                <TextField name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Name</InputLabel>
                <TextField name="name" value={form.name} onChange={handleChange} placeholder="Name" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Nationality</InputLabel>
                <TextField name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Delivery area name</InputLabel>
                <TextField name="deliveryArea" value={form.deliveryArea} onChange={handleChange} placeholder="Zone number and name" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Building / Flat number</InputLabel>
                <TextField name="building" value={form.building} onChange={handleChange} placeholder="Building / Flat number" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel sx={{ fontSize: 11 }}>Street number</InputLabel>
                <TextField name="street" value={form.street} onChange={handleChange} placeholder="Street number" fullWidth size="small" 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel sx={{ fontSize: 11 }}>City</InputLabel>
                <TextField name="city" value={form.city} onChange={handleChange} placeholder="City" fullWidth size="small" 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Country</InputLabel>
                <FormControl fullWidth size="small" sx={{ mb: 1.2 }}>
                  <TextField select name="country" value={form.country} onChange={handleChange} required
                    sx={{ '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                  >
                    <MenuItem value="Qatar">Qatar</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel sx={{ fontSize: 11 }}>Province (eg. Doha, Rayyan)</InputLabel>
                <TextField name="province" value={form.province} onChange={handleChange} placeholder="Province (eg. Doha, Rayyan)" fullWidth size="small" 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Zone Number (Enter only number for Shipping Calculation)</InputLabel>
                <TextField name="zone" value={form.zone} onChange={handleChange} placeholder="000" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button type="submit" variant="contained" sx={{ px: 6, py: 1.5, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }}>
                CREATE ACCOUNT
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
