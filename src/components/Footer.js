import React from 'react';
import { Box, Container, Typography, Grid, Button, TextField, Divider, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ background: '#fff', pt: 6 }}>
      {/* Certifications */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Our Certifications
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, flexWrap: 'wrap', mb: 2 }}>
          <img src="https://www.jasani.ae/web/image/355066-2320df44/image.png" alt="Sedex" style={{ height: 48 }} />
          <img src="https://www.jasani.ae/web/image/334748-516e7606/89.webp" alt="Ecovadis" style={{ height: 48 }} />
          <img src="https://www.jasani.ae/web/image/355067-2320df44/image.png" alt="ICV" style={{ height: 48 }} />
        </Box>
      </Container>
      {/* Reseller Portal */}
      <Box sx={{ background: '#f8f9fa', py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Get access to our reseller portal!
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            And avail our many partnership benefits.
          </Typography>
          <Button variant="contained" sx={{ mt: 2, borderRadius: 8, px: 4 }}>
            GET IN TOUCH WITH US &gt;
          </Button>
        </Container>
      </Box>
      {/* Main Footer - 3 columns */}
      <Box sx={{ background: 'linear-gradient(90deg, #232526 0%, #414345 100%)', color: '#fff', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Column 1: About & Social */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                The #1 premium corporate gifts supplier in the Middle East.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <span role="img" aria-label="check">✔️</span> 30+ years of deep expertise in branded merchandise, corporate & promotional giveaways<br />
                <span role="img" aria-label="check">✔️</span> Extensive collection of over 2,750 ready-stock products and counting...<br />
                <span role="img" aria-label="check">✔️</span> Diverse range of premium brands including Moleskine, Cross, Skross, Ocean Bottle, Stormtech, XDDesign, and a lot more!<br />
                <span role="img" aria-label="check">✔️</span> Custom items such as drinkware, notebooks, bags, and so much more!<br />
                <span role="img" aria-label="check">✔️</span> Serving clients across <b>Middle East, Africa and India!</b>
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Link href="#" color="inherit"><img src="/facebook.svg" alt="Facebook" height={24} /></Link>
                <Link href="#" color="inherit"><img src="/linkedin.svg" alt="LinkedIn" height={24} /></Link>
                <Link href="#" color="inherit"><img src="/instagram.svg" alt="Instagram" height={24} /></Link>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">We Accept</Typography>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" height={24} style={{ marginRight: 8 }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/MasterCard_Logo.svg" alt="Mastercard" height={24} />
              </Box>
            </Grid>
            {/* Column 2: Links (3 sub-columns) */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>COMPANY INFO</Typography>
                  <Box>
                    <Link href="#" color="inherit" underline="hover">About Us</Link><br />
                    <Link href="#" color="inherit" underline="hover">Sustainability</Link><br />
                    <Link href="#" color="inherit" underline="hover">Privacy Policy</Link><br />
                    <Link href="#" color="inherit" underline="hover">Jobs</Link><br />
                    <Link href="#" color="inherit" underline="hover">Contact Us</Link>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>PRODUCTS</Typography>
                  <Box>
                    <Link href="#" color="inherit" underline="hover">Home</Link><br />
                    <Link href="#" color="inherit" underline="hover">E-Catalog</Link><br />
                    <Link href="#" color="inherit" underline="hover">Products</Link><br />
                    <Link href="#" color="inherit" underline="hover">Brands</Link><br />
                    <Link href="#" color="inherit" underline="hover">Branding Methods</Link>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>SUPPORT</Typography>
                  <Box>
                    <Link href="#" color="inherit" underline="hover">FAQs</Link><br />
                    <Link href="#" color="inherit" underline="hover">APIs</Link><br />
                    <Link href="#" color="inherit" underline="hover">Reseller Registration</Link><br />
                    <Link href="#" color="inherit" underline="hover">Our Locations</Link><br />
                    <Link href="#" color="inherit" underline="hover">Blogs</Link>
                  </Box>
                </Grid>
                {/* Contact/Newsletter section below links, spanning all 3 sub-columns */}
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2, background: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Button variant="outlined" color="inherit" sx={{ borderRadius: 8, color: '#fff', borderColor: '#fff' }}>EMAIL</Button>
                    <Button variant="outlined" color="inherit" sx={{ borderRadius: 8, color: '#fff', borderColor: '#fff' }}>CALL</Button>
                    <Button variant="outlined" color="inherit" sx={{ borderRadius: 8, color: '#fff', borderColor: '#fff' }}>WHATSAPP</Button>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Our Offices: <b>Dubai</b> <b>Abu Dhabi</b> <b>Saudi Arabia</b> <b>Qatar</b> <b>South Africa</b> <b>India</b></Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <TextField size="small" placeholder="your email..." variant="outlined" sx={{ background: '#fff', borderRadius: 1, input: { color: '#222' } }} />
                    <Button variant="contained" sx={{ borderRadius: 1, px: 3 }}>Subscribe</Button>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#fff', mt: 1, display: 'block' }}>
                    For complaints or feedback about our services, please email our Managing Director at <b>biren@jasani.ae</b> for immediate action.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box sx={{ textAlign: 'center', color: '#ccc', fontSize: 13, mt: 4 }}>
          Copyright © Jasani LLC 2004 - 2025. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
