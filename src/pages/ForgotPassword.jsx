import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0); // Cooldown in seconds
  const [canRequest, setCanRequest] = useState(true);

  const navigate = useNavigate();

  // Cooldown timer effect
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      setCanRequest(false);
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setCanRequest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canRequest) {
      setError(`Please wait ${cooldown} seconds before requesting another OTP.`);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fv1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail(''); // Clear the form
        setCooldown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '60vh', bgcolor: '#fafbfc', display: 'flex', justifyContent: 'center', pt: 4, pb: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 6, p: 0, mt: { xs: 3, md: 0 } }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0b3a4a', fontSize: 18, textAlign: 'center' }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#444', mb: 3, fontSize: 11, textAlign: 'center' }}>
            Enter your email address and we'll send you a 6-digit OTP to reset your password.
          </Typography>

          {/* Cooldown Warning */}
          {!canRequest && cooldown > 0 && (
            <Alert severity="warning" sx={{ mb: 2, fontSize: 11 }}>
              Please wait {cooldown} seconds before requesting another OTP.
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 11 }}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {message && (
            <Alert severity="success" sx={{ mb: 2, fontSize: 11 }}>
              {message}
              <br />
              <Button
                variant="text"
                sx={{ mt: 1, fontSize: 11, color: '#0b3a4a', fontWeight: 700, textTransform: 'none' }}
                onClick={() => navigate('/reset-password')}
              >
                Enter OTP Now →
              </Button>
            </Alert>
          )}

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
              disabled={loading || !email.trim() || !canRequest}
              sx={{ 
                mt: 2, 
                py: 1, 
                fontWeight: 700, 
                borderRadius: 2, 
                bgcolor: !canRequest ? '#ccc' : '#0b3a4a', 
                fontSize: 11, 
                '&:hover': { bgcolor: !canRequest ? '#ccc' : '#14506b' }, 
                '&:disabled': { bgcolor: '#ccc' } 
              }}
              fullWidth
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {loading ? 'Sending...' : 
               !canRequest && cooldown > 0 ? `Wait ${cooldown}s` : 
               'Send OTP'}
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