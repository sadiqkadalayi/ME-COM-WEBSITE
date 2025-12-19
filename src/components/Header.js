import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Grid, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const navItems = [
  'SUSTAINABLE',
  'APPAREL',
  'TECH',
  'DRINKWARE',
  'BAGS',
  'OFFICE',
  'OTHERS',
  'BRANDS',
  'SALES TOOLS',
];


const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Info Bar */}
      <Box sx={{ background: '#0b3a4a', color: '#fff', fontSize: 13, py: 0.5, px: 2 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: { xs: 2, md: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            <span style={{ marginRight: 12 }}>info@megiftpacks.com</span>
            <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            <span style={{ marginRight: 8 }}>+974 6642 6697</span>
            <span style={{ marginRight: 8 }}>| 31331225</span>
            <span>| 31331226</span>
          </Box>
        </Container>
      </Box>
      {/* Main AppBar */}
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, md: 0 } }}>
          <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 0 } }}>
            {/* Logo section: only logo (left) */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 6 }}>
              <img 
                src={Logo} 
                alt="Logo" 
                style={{ height: 60, marginRight: 16, cursor: 'pointer' }} 
                onClick={() => navigate('/')} 
              />
            </Box>
            {/* Spacer to push buttons to right */}
            <Box sx={{ flexGrow: 1 }} />
            {/* Right section: align with main content */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: 'auto', md: '100%' }, maxWidth: { xs: 'none', md: 1200 }, justifyContent: { xs: 'flex-end', md: 'flex-end' } }}>
              <Button variant="contained" sx={{ background: '#0b3a4a', color: '#fff', borderRadius: 2, px: 1, fontWeight: 500,fontSize: 11, boxShadow: 'none', '&:hover': { background: '#14506b' }, display: { xs: 'none', md: 'block' } }}>
                Contact Us
              </Button>
              <Typography variant="body2" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, ml: 2,  fontSize: 13 }}>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{ minWidth: 'auto', px: 1, py: 0.5, fontWeight: 500, fontSize: 13, textTransform: 'none', color: '#2f2f30ff', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                >
                  Sign In
                </Button>
                <span style={{ color: '#999' }}>or</span>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => navigate('/register')}
                  sx={{ minWidth: 'auto', px: 1, py: 0.5, fontWeight: 500, fontSize: 13, textTransform: 'none', color: '#2f2f30ff', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                >
                  Register
                </Button>
              </Typography>
              <IconButton color="inherit" sx={{ ml: 1,mr: 4 }}>
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
        {/* Navigation Bar */}
        <Toolbar sx={{ minHeight: 48, background: '#fff', px: 0, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', px: 0 }}>
            {/* Hamburger menu for mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, ml: 1, mr: 2 }}>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            </Box>
            {/* Nav items for desktop */}
            <Grid container spacing={0} alignItems="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Grid item key={item} sx={{ width: 'auto' }}>
                  <Button sx={{ color: '#0b3a4a', fontWeight: 500, fontSize: 12, px: 1.2, textTransform: 'none', minHeight: 28, height: 28, lineHeight: 1 }}>
                    {item}
                  </Button>
                </Grid>
              ))}
            </Grid>
            {/* Hide Contact Us and Sign in in nav bar, now in main bar */}
          </Container>
        </Toolbar>
        {/* Drawer for mobile nav */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
            <List>
              {navItems.map((item) => (
                <ListItem key={item} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Contact Us" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/login')}>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/register')}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
};

export default Header;
