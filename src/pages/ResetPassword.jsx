import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: OTP verification, 2: Password reset
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!formData.otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoadingOTP(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fv1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2); // Move to password reset step
        setMessage('OTP verified successfully! Now enter your new password.');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('OTP verification error:', error);
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(''); // Clear error when user types
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoadingReset(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fv1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message + ' Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password reset successful! Please login with your new password.' }
          });
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
        setLoadingReset(false);
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('Reset password error:', error);
      setLoadingReset(false);
    }
    // Note: Don't set loading to false on success since we're redirecting
  };

  return (
    <Box sx={{ minHeight: '60vh', bgcolor: '#fafbfc', display: 'flex', justifyContent: 'center', pt: 4, pb: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 6, p: 0, mt: { xs: 3, md: 0 } }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0b3a4a', fontSize: 18, textAlign: 'center' }}>
            {step === 1 ? 'Verify OTP' : 'Reset Password'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#444', mb: 3, fontSize: 11, textAlign: 'center' }}>
            {step === 1 
              ? 'Enter your email and the 6-digit OTP sent to you.'
              : 'Enter your new password below.'
            }
          </Typography>

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
            </Alert>
          )}

          {/* Step 1: OTP Verification */}
          {step === 1 && (
            <Box component="form" onSubmit={handleOTPVerification} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="Email Address"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 } }}
                required
              />
              <TextField
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange('otp')}
                placeholder="Enter 6-digit OTP"
                variant="outlined"
                fullWidth
                size="small"
                inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11, textAlign: 'center', letterSpacing: 3 } }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loadingOTP || !formData.email.trim() || !formData.otp.trim()}
                sx={{ 
                  mt: 2, 
                  py: 1, 
                  fontWeight: 700, 
                  borderRadius: 2, 
                  bgcolor: loadingOTP ? '#ccc' : '#0b3a4a', 
                  fontSize: 11, 
                  '&:hover': { bgcolor: loadingOTP ? '#ccc' : '#14506b' }, 
                  '&:disabled': { bgcolor: '#ccc', cursor: 'not-allowed' }
                }}
                fullWidth
                startIcon={loadingOTP ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {loadingOTP ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
            </Box>
          )}

          {/* Step 2: Password Reset */}
          {step === 2 && (
            <Box component="form" onSubmit={handlePasswordReset} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                placeholder="New Password"
                variant="outlined"
                fullWidth
                size="small"
                disabled={loadingReset}
                sx={{ 
                  fontSize: 11, 
                  '& .MuiInputBase-input': { py: 0.8, fontSize: 11 },
                  '& .MuiInputBase-root.Mui-disabled': { bgcolor: '#f5f5f5' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        disabled={loadingReset}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              <TextField
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Confirm New Password"
                variant="outlined"
                fullWidth
                size="small"
                disabled={loadingReset}
                sx={{ 
                  fontSize: 11, 
                  '& .MuiInputBase-input': { py: 0.8, fontSize: 11 },
                  '& .MuiInputBase-root.Mui-disabled': { bgcolor: '#f5f5f5' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        disabled={loadingReset}
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loadingReset || !formData.newPassword.trim() || !formData.confirmPassword.trim()}
                sx={{ 
                  mt: 2, 
                  py: 1, 
                  fontWeight: 700, 
                  borderRadius: 2, 
                  bgcolor: loadingReset ? '#ccc' : '#0b3a4a', 
                  fontSize: 11, 
                  '&:hover': { bgcolor: loadingReset ? '#ccc' : '#14506b' }, 
                  '&:disabled': { bgcolor: '#ccc', cursor: 'not-allowed' }
                }}
                fullWidth
                startIcon={loadingReset ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {loadingReset ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Box>
          )}
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

export default ResetPassword;