

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, InputLabel, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetRegisterState } from '../redux/registerSlice';
import { useNavigate } from 'react-router-dom';



const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.register || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }
    setPasswordError('');
    dispatch(registerUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    }));
  };

  useEffect(() => {
    if (success) {
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(resetRegisterState());
        navigate('/login');
      }, 1800);
    }
  }, [success, dispatch, navigate]);

  return (
    <Box sx={{ minHeight: '80vh', pt: 6, bgcolor: '#fafbfc', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 1100, width: '100%', borderRadius: 3, boxShadow: 6, p: 0 }}>
        <CardContent sx={{ p: { xs: 2, md: 6 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#222', textAlign: 'center' }}>
            New Account
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Snackbar open={Boolean(error)} autoHideDuration={4000} onClose={() => dispatch(resetRegisterState())} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => dispatch(resetRegisterState())} severity="error" sx={{ width: '100%' }}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(typeof error === 'string' ? error.split(' | ') : error).map((msg, idx) => (
                      <li key={idx} style={{ fontSize: 13 }}>{msg}</li>
                    ))}
                  </ul>
                </Alert>
              </Snackbar>
            )}
            {passwordError && (
              <Snackbar open={Boolean(passwordError)} autoHideDuration={3000} onClose={() => setPasswordError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setPasswordError('')} severity="error" sx={{ width: '100%' }}>
                  {passwordError}
                </Alert>
              </Snackbar>
            )}
            <Snackbar open={openSnackbar && success} autoHideDuration={1800} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert severity="success" sx={{ width: '100%' }}>
                Registration successful! Redirecting to login...
              </Alert>
            </Snackbar>
            <Grid container spacing={2} alignItems="flex-start" sx={{ rowGap: 1.5, columnGap: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Full Name</InputLabel>
                <TextField name="name" value={form.name} onChange={handleChange} placeholder="Full Name" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Email Address</InputLabel>
                <TextField name="email" value={form.email} onChange={handleChange} placeholder="Email Address" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Mobile Number</InputLabel>
                <TextField name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile Number" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Password</InputLabel>
                <TextField name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <InputLabel required sx={{ fontSize: 11 }}>Confirm Password</InputLabel>
                <TextField name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" fullWidth size="small" required 
                  sx={{ mb: 1.2, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button type="submit" variant="contained" sx={{ px: 6, py: 1.5, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }} disabled={loading}>
                {loading ? 'Creating...' : 'CREATE ACCOUNT'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
