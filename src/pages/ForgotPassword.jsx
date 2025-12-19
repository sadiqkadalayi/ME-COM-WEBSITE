import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
  };

  return (
    <Box sx={{ minHeight: '60vh', bgcolor: '#fafbfc', display: 'flex', justifyContent: 'center', pt: 4, pb: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 6, p: 0, mt: { xs: 3, md: 0 } }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0b3a4a', fontSize: 18, textAlign: 'center' }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#444', mb: 3, fontSize: 11, textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your Email"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 } }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, py: 1, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }}
              fullWidth
            >
              Send Reset Link
            </Button>
          </Box>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2, fontSize: 11, color: '#0b3a4a', fontWeight: 700, textTransform: 'none' }}
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;