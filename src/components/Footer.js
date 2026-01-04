import React from 'react';
import { Box, Container, Typography, Grid, Button, TextField, Divider, Link } from '@mui/material';
import { Facebook, LinkedIn, Instagram } from '@mui/icons-material';

// Import client logos
import client1 from '../assets/clients/client-01.png';
import client2 from '../assets/clients/client-02.png';
import client3 from '../assets/clients/client-03.png';
import client4 from '../assets/clients/client-04.png';
import client5 from '../assets/clients/client-05.png';
import client6 from '../assets/clients/client-06.png';

const Footer = () => {
  return (
    <Box sx={{ background: '#fff', pt: 6 }}>
      {/* Client Logos */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 4 }}>
        
        <Box sx={{ 
          overflow: 'hidden', 
          width: '100%', 
          height: '80px',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: '100px',
            height: '100%',
            zIndex: 2,
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, #fff, transparent)',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, #fff, transparent)',
          }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            animation: 'scroll 60s linear infinite',
            width: 'max-content',
            '@keyframes scroll': {
              '0%': { transform: 'translateX(100%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}>
            <img src={client1} alt="Client 1" style={{ height: '48px' }} />
            <img src={client2} alt="Client 2" style={{ height: '48px' }} />
            <img src={client3} alt="Client 3" style={{ height: '48px' }} />
            <img src={client4} alt="Client 4" style={{ height: '48px' }} />
            <img src={client5} alt="Client 5" style={{ height: '48px' }} />
            <img src={client6} alt="Client 6" style={{ height: '48px' }} />
            {/* Duplicate logos for seamless loop */}
            <img src={client1} alt="Client 1" style={{ height: '48px' }} />
            <img src={client2} alt="Client 2" style={{ height: '48px' }} />
            <img src={client3} alt="Client 3" style={{ height: '48px' }} />
            <img src={client4} alt="Client 4" style={{ height: '48px' }} />
            <img src={client5} alt="Client 5" style={{ height: '48px' }} />
            <img src={client6} alt="Client 6" style={{ height: '48px' }} />
          </Box>
        </Box>
      </Container>
      
      {/* Main Footer - 3 columns */}
      <Box sx={{ background: 'linear-gradient(90deg, #232526 0%, #414345 100%)', color: '#fff', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Column 1: About & Social */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                ME Gift Packs
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <span role="img" aria-label="check"></span> 
                Your one stop solution provider for all your Corporate Gifts, office stationery supplies, 
                print management solutions and Food Grade disposable products and many more..
                
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Link href="#" color="inherit" sx={{ '&:hover': { color: '#1976d2' } }}>
                  <Facebook fontSize="medium" />
                </Link>
                <Link href="#" color="inherit" sx={{ '&:hover': { color: '#0077b5' } }}>
                  <LinkedIn fontSize="medium" />
                </Link>
                <Link href="#" color="inherit" sx={{ '&:hover': { color: '#e4405f' } }}>
                  <Instagram fontSize="medium" />
                </Link>
              </Box>
              
            </Grid>
            {/* Column 2: Links (3 sub-columns) */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>COMPANY INFO</Typography>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#fff' }}>
                      
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#ccc', fontSize: '0.85rem' }}>
                      Opposite Majlis Hypermarket, <br />
                      1st Floor, Building no 239, Zone 41, <br />
                      Street 230, C ring Road, Doha
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#ccc', fontSize: '0.85rem' }}>
                      Email: info@megiftpacks.com<br />
                      Phone: +97 3133 1225
                    </Typography>
                  
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>PAGES</Typography>
                  <Box>
                    <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>Home</Link><br />
                    <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>About Us</Link><br />
                    <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>Privacy Policy</Link><br />
                    <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>Contact Us</Link><br />
                    <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>Our Locations</Link>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>LOCATION</Typography>
                  <Box sx={{ 
                    width: '100%', 
                    height: '100px', 
                    border: '1px solid #555',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.2374130423677!2d51.53249609999999!3d25.262597799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d5bfaefde9966a3%3A0xe0e92d42a85a3e21!2sME%20Gift%20Packs%20Qatar%20-%20Corporate%20Gifts%20%26%20Promotional%20Gifts%20Company%20Qatar!5e0!3m2!1sen!2sqa!4v1748156423409!5m2!1sen!2sqa"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="ME Gift Packs Location"
                    ></iframe>
                  </Box>
                </Grid>
               
                
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box sx={{ textAlign: 'center', color: '#ccc', fontSize: 13, mt: 4 }}>
          Copyright © ME Gift Packs {new Date().getFullYear()}. All rights reserved. <br/><span style={{fontSize:'11px'}}>All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.</span>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
