import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';

const ContactUsPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle send logic here
  };

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: '#fafbfc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 4, pb: 4 }}>
      <Card sx={{ maxWidth: 900, width: '100%', borderRadius: 3, boxShadow: 6, p: 0, mt: { xs: 4, md: 0 } }}>
        <Grid container>
          {/* Left: Contact Form */}
          <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 4 }, borderRight: { md: '1px solid #e0e0e0' } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0b3a4a', fontSize: 18 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#444', mb: 3, fontSize: 11 }}>
              We'd love to hear from you! Fill out the form below and our team will get back to you soon.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 } }}
                required
              />
              <TextField
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 } }}
                required
              />
              <TextField
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ fontSize: 11, '& .MuiInputBase-input': { py: 0.8, fontSize: 11 } }}
              />
              <TextField
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                variant="outlined"
                fullWidth
                size="small"
                multiline
                minRows={4}
                sx={{ fontSize: 11, '& .MuiInputBase-input': { fontSize: 11 } }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, py: 1, fontWeight: 700, borderRadius: 2, bgcolor: '#0b3a4a', fontSize: 11, '&:hover': { bgcolor: '#14506b' } }}
                fullWidth
              >
                Send Message
              </Button>
            </Box>
          </Grid>
          {/* Right: Company Info */}
          <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0b3a4a', fontSize: 15 }}>
              Company Information
            </Typography>
            <Box sx={{ fontSize: 11, color: '#222', mb: 1 }}>
              <strong>Phone:</strong> +974 6642 6697, 31331225, 31331226
            </Box>
            <Box sx={{ fontSize: 11, color: '#222', mb: 1 }}>
              <strong>Email:</strong> info@megiftpacks.com
            </Box>
            <Box sx={{ fontSize: 11, color: '#222', mb: 1 }}>
              <strong>Location:</strong> Doha, Qatar
            </Box>
            <Box sx={{ fontSize: 11, color: '#222', mb: 1 }}>
              <strong>Working Hours:</strong> 9:00 AM - 6:00 PM (Sun-Thu)
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ContactUsPage;