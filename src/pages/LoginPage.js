import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Link, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 900, width: '100%', borderRadius: 3, boxShadow: 6, p: 0, mt: { xs: 4, sm: 6, md: 2, lg: 0 } }}>
        <Grid container>
          {/* Left: Login Form */}
          <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#222', textAlign: 'center', fontSize: 11 }}>
              Sign in
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#222', fontWeight: 500, fontSize: 11 }}>Email Address:</Typography>
              <TextField
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
              />
              <Typography variant="body2" sx={{ mb: 0.5, color: '#222', fontWeight: 500, fontSize: 11 }}>Password:</Typography>
              <TextField
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                variant="outlined"
                type="password"
                fullWidth
                size="small"
                sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { py: 0.8, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ px: 4, py: 1, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }}
                >
                  SIGN IN
                </Button>
                <Link onClick={() => navigate('/forgot-password')}  sx={{cursor: 'pointer', fontSize: 11, color: '#0b3a4a', fontWeight: 500 , ml:2}}>
                  Forgot your password?
                </Link>
                     
              </Box>
            </Box>
          </Grid>
          {/* Right: New Customer Card */}
          <Grid item xs={12} md={5} sx={{ bgcolor: '#f5f6fa', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#222', fontSize: 11 }}>
              New Customer?
            </Typography>
            <Typography variant="body2" sx={{ color: '#444', mb: 2, fontSize: 11 }}>
              Create an account with us and you'll be able to:
            </Typography>
            <List dense sx={{ mb: 2 }}>
              {[
                'Check out faster',
                'Save multiple shipping addresses',
                'Access your order history',
                'Track new orders',
                'Save items to your Wish List',
              ].map((text) => (
                <ListItem key={text} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon sx={{ color: '#0b3a4a', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ fontSize: 11, color: '#222' }} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, py: 1, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }}
            >
              CREATE ACCOUNT
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default LoginPage;
