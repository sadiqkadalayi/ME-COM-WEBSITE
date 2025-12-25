import React, { useState, useEffect } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/LoginSlice';
import { fetchNavigationCategories } from '../redux/NavigationCategoriesSlice';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Grid, Drawer, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Collapse, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nestedMenus, setNestedMenus] = useState({}); // For handling nested submenus
  const [expandedMobile, setExpandedMobile] = useState({}); // For mobile nested categories
  const [isScrolling, setIsScrolling] = useState(false); // Add scrolling state to prevent flicker
  const [hoverTimeouts, setHoverTimeouts] = useState({}); // Add hover timeouts to prevent rapid flickering
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login || {});
  const { categories: navCategories, loading: categoriesLoading } = useSelector((state) => state.navigationCategories || {});
  const { totalItems } = useSelector((state) => state.cart || {});
  
  // Check if user is logged in
  const isLoggedIn = Boolean(user || token);

  // Fetch navigation categories on component mount
  useEffect(() => {
    dispatch(fetchNavigationCategories());
  }, [dispatch]);

  // Add event listeners for closing dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any menu or button
      const isMenuClick = event.target.closest('.MuiMenu-paper') || 
                         event.target.closest('.MuiMenuItem-root') ||
                         event.target.closest('.MuiMenu-list') ||
                         event.target.closest('[data-menu-button]') ||
                         event.target.hasAttribute('data-menu-button');
      
      if (!isMenuClick) {
        console.log('Outside click detected, closing menus'); // Debug log
        handleMenuClose();
      }
    };

    const handleScroll = () => {
      // Immediately set scrolling state to hide menus
      setIsScrolling(true);
      // Immediately close all menus
      setAnchorEl(null);
      setOpenMenuId(null);
      setNestedMenus({});
      
      // Reset scrolling state after a short delay
      setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handleMenuClose();
      }
    };

    // Add event listeners
    document.addEventListener('click', handleClickOutside, true); // Use click instead of mousedown
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to home page after logout
  };

  const handleMenuOpen = (event, categoryId) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(categoryId);
    setNestedMenus({}); // Clear any existing nested menus
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setNestedMenus({}); // Clear all nested menus
  };

  const handleNestedMenuOpen = (event, categoryId) => {
    // Clear any existing timeout for this category
    if (hoverTimeouts[categoryId]) {
      clearTimeout(hoverTimeouts[categoryId]);
    }
    
    setNestedMenus(prev => ({
      ...prev,
      [categoryId]: event.currentTarget
    }));
  };

  const handleNestedMenuClose = (categoryId) => {
    // Clear timeout and close immediately
    if (hoverTimeouts[categoryId]) {
      clearTimeout(hoverTimeouts[categoryId]);
      setHoverTimeouts(prev => {
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      });
    }
    
    setNestedMenus(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  const handleNestedMenuOpenWithDelay = (event, categoryId) => {
    // Clear any existing timeout
    if (hoverTimeouts[categoryId]) {
      clearTimeout(hoverTimeouts[categoryId]);
    }
    
    // Set new timeout for opening
    const timeoutId = setTimeout(() => {
      handleNestedMenuOpen(event, categoryId);
    }, 150); // 150ms delay to prevent flickering
    
    setHoverTimeouts(prev => ({
      ...prev,
      [categoryId]: timeoutId
    }));
  };

  // Mobile expansion toggle function
  const handleMobileExpansion = (categoryId) => {
    setExpandedMobile(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Recursive function to render nested menu items
  const renderNestedItems = (subcategories, level = 1) => {
    if (!subcategories || subcategories.length === 0) return null;

    return subcategories.map((subcat) => {
      const hasNestedSubcategories = subcat.subcategories && subcat.subcategories.length > 0;
      
      return (
        <Box key={subcat._id}>
          <MenuItem 
            onClick={(e) => {
              // Always navigate on click for nested items
              navigate(`/category/${subcat.slug}`);
              handleMenuClose();
            }}
            onMouseEnter={() => {
              // Open submenu on hover if it has subcategories
              if (hasNestedSubcategories && level < 3) {
                handleNestedMenuOpen({ currentTarget: document.getElementById(`menu-item-${subcat._id}`) }, subcat._id);
              }
            }}
            sx={{ 
              fontSize: 13,
              color: '#666',
              pl: 2 + (level * 0.5), // Indent based on level
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#0b3a4a'
              }
            }}
            id={`menu-item-${subcat._id}`}
          >
            <Box>
              {'> '.repeat(level)}{subcat.name} ({subcat.productCount})
            </Box>
            {hasNestedSubcategories && level < 3 && (
              <Box sx={{ fontSize: 10, color: '#999' }}>▶</Box>
            )}
          </MenuItem>
          
          {/* Render nested submenu */}
          {hasNestedSubcategories && level < 3 && (
            <Menu
              anchorEl={nestedMenus[subcat._id]}
              open={Boolean(nestedMenus[subcat._id]) && !isScrolling}
              onClose={(event, reason) => {
                // Close on escape key or when mouse leaves menu area
                if (reason === 'escapeKeyDown') {
                  handleNestedMenuClose(subcat._id);
                }
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              disableScrollLock={true}
              disableAutoFocus={true}
              disableEnforceFocus={true}
              MenuListProps={{
                onMouseLeave: () => {
                  // Simple mouse leave - close immediately
                  handleNestedMenuClose(subcat._id);
                }
              }}
              PaperProps={{
                className: 'MuiMenu-paper',
                sx: {
                  visibility: isScrolling ? 'hidden' : 'visible',
                  opacity: isScrolling ? 0 : 1,
                  transition: 'none', // Remove transitions to prevent flicker
                  ml: 0.5 // Small margin to prevent gaps
                }
              }}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: 200,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  ml: 0.5
                }
              }}
            >
              <Box sx={{ 
                bgcolor: '#f8f9fa', 
                px: 2, 
                py: 1, 
                fontSize: 12,
                fontWeight: 600,
                color: '#333',
                textTransform: 'uppercase'
              }}>
                {subcat.name}
              </Box>
              <MenuItem 
                onClick={() => {
                  navigate(`/category/${subcat.slug}`);
                  handleMenuClose();
                }}
                sx={{ 
                  py: 1,
                  px: 2,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#0b3a4a',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                VIEW ALL ({subcat.productCount})
              </MenuItem>
              {renderNestedItems(subcat.subcategories, level + 1)}
            </Menu>
          )}
        </Box>
      );
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Info Bar */}
      <Box sx={{ background: '#0b3a4a', color: '#fff', fontSize: 13, py: 0.5, px: 2 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: { xs: 2, md: 0 }, py: { xs: 1, md: 1 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              <span style={{ marginRight: 8 }}>info@megiftpacks.com</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              <span style={{ marginRight: 8 }}>+974 6642 6697</span>
              <span style={{ marginRight: 8 }}>| 31331225</span>
              <span>| 31331226</span>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Main AppBar */}
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, md: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Toolbar sx={{ minHeight: 56, px: { xs: 2, md: 0 }, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Centered content */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <img 
                src={Logo} 
                alt="Logo" 
                style={{ height: 40, marginRight: 12, marginLeft: 20, cursor: 'pointer' }} 
                onClick={() => navigate('/')} 
              />
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" 
                  onClick={()=>navigate('/contact-us')}
                  sx={{ background: '#0b3a4a', color: '#fff', borderRadius: 2, px: 1, fontWeight: 500,fontSize: 11, boxShadow: 'none', '&:hover': { background: '#14506b' }, display: { xs: 'none', md: 'block' } }}>
                  Contact Us
                </Button>
                <Typography variant="body2" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, ml: 2,  fontSize: 13 }}>
                  {isLoggedIn ? (
                    // Show when logged in
                    <>
                      <Button 
                        variant="text" 
                        size="small"
                        onClick={() => navigate('/dashboard')}
                        sx={{ 
                          minWidth: 'auto', 
                          px: 1, 
                          py: 0.5, 
                          fontWeight: 500, 
                          fontSize: 13, 
                          textTransform: 'none', 
                          color: '#2f2f30ff',
                          marginRight: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          '&:hover': { background: 'transparent', textDecoration: 'underline' } 
                        }}
                      >
                        <AccountCircleIcon sx={{ fontSize: 18 }} />
                        Account
                      </Button>
                      <Button 
                        variant="text" 
                        size="small"
                        onClick={handleLogout}
                        sx={{ minWidth: 'auto', px: 1, py: 0.5, fontWeight: 500, fontSize: 13, textTransform: 'none', color: '#2f2f30ff', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    // Show when not logged in
                    <>
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
                    </>
                  )}
                </Typography>
                <IconButton 
                  color="inherit" 
                  sx={{ ml: 1, mr: 4 }}
                  onClick={() => navigate('/cart')}
                >
                  <Badge 
                    badgeContent={totalItems} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '10px',
                        height: '18px',
                        minWidth: '18px'
                      }
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
        {/* Navigation Bar */}
        <Toolbar sx={{ minHeight: 48, background: '#fff', px: 0, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', px: 0, mb: 1.5 }}>
            {/* Hamburger menu for mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, ml: 1, mr: 2 }}>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            </Box>
            {/* Nav items for desktop */}
            <Grid container spacing={0} alignItems="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navCategories && navCategories.map((category) => (
                <Grid item key={category._id} sx={{ width: 'auto' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Button 
                      data-menu-button="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (category.subcategories?.length > 0) {
                          // Toggle main menu - close if open, open if closed
                          if (openMenuId === category._id) {
                            handleMenuClose();
                          } else {
                            handleMenuOpen(e, category._id);
                          }
                        } else {
                          navigate(`/category/${category.slug}`);
                        }
                      }}
                      endIcon={category.subcategories?.length > 0 ? <ExpandMoreIcon /> : null}
                      sx={{ 
                        color: '#0b3a4a', 
                        fontWeight: 500, 
                        fontSize: 12, 
                        px: 1.5, 
                        textTransform: 'uppercase', 
                        minHeight: 40, 
                        height: 40, 
                        lineHeight: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(11, 58, 74, 0.1)'
                        }
                      }}
                    >
                      {category.name}
                    </Button>
                  </Box>
                  
                  {/* Dropdown Menu for Subcategories */}
                  {category.subcategories?.length > 0 && !isScrolling && (
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === category._id && !isScrolling}
                      onClose={(event, reason) => {
                        // Only close on escape key or backdrop click, not on item selection
                        if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
                          handleMenuClose();
                        }
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      disableScrollLock={true}
                      disablePortal={true}
                      disableAutoFocus={true}
                      disableEnforceFocus={true}
                      PaperProps={{
                        className: 'MuiMenu-paper',
                        sx: {
                          visibility: isScrolling ? 'hidden' : 'visible',
                          opacity: isScrolling ? 0 : 1,
                          transition: 'none' // Remove transitions to prevent flicker
                        }
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          mt: 1,
                          minWidth: 250,
                          maxWidth: 300,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'absolute',
                          zIndex: 1300
                        },
                        '& .MuiMenu-list': {
                          py: 0,
                        }
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: '#f8f9fa', 
                        px: 2, 
                        py: 1.5, 
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#333',
                        textTransform: 'uppercase'
                      }}>
                        {category.name}
                      </Box>
                      
                      <MenuItem 
                        onClick={() => {
                          navigate(`/category/${category.slug}`);
                          handleMenuClose();
                        }}
                        sx={{ 
                          py: 1.5,
                          px: 2,
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#0b3a4a',
                          borderBottom: '1px solid #f0f0f0',
                          '&:hover': {
                            backgroundColor: '#f8f9fa'
                          }
                        }}
                      >
                        SHOP ALL {category.name.toUpperCase()} ({category.productCount})
                      </MenuItem>
                      
                      
                      {/* Render nested subcategories recursively */}
                      {renderNestedItems(category.subcategories)}
                    </Menu>
                  )}
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
          <Box sx={{ width: 280 }} role="presentation">
            <List>
              {navCategories && navCategories.map((category) => (
                <React.Fragment key={category._id}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => {
                        if (category.subcategories && category.subcategories.length > 0) {
                          handleMobileExpansion(category._id);
                        } else {
                          navigate(`/category/${category.slug}`);
                          handleDrawerToggle();
                        }
                      }}
                      sx={{ 
                        backgroundColor: expandedMobile[category._id] ? '#f5f5f5' : 'transparent',
                        borderLeft: expandedMobile[category._id] ? '3px solid #0b3a4a' : 'none'
                      }}
                    >
                      <ListItemText 
                        primary={category.name.toUpperCase()} 
                        sx={{ 
                          fontWeight: expandedMobile[category._id] ? 'bold' : 'normal'
                        }}
                      />
                      {category.subcategories && category.subcategories.length > 0 && (
                        expandedMobile[category._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />
                      )}
                    </ListItemButton>
                  </ListItem>
                  
                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <Collapse in={expandedMobile[category._id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {category.subcategories.map((subcat) => (
                          <React.Fragment key={subcat._id}>
                            <ListItem disablePadding>
                              <ListItemButton 
                                sx={{ pl: 4 }}
                                onClick={() => {
                                  if (subcat.subcategories && subcat.subcategories.length > 0) {
                                    handleMobileExpansion(subcat._id);
                                  } else {
                                    navigate(`/category/${subcat.slug}`);
                                    handleDrawerToggle();
                                  }
                                }}
                              >
                                <ListItemText 
                                  primary={`${subcat.name} (${subcat.productCount})`}
                                  sx={{ fontSize: '0.9rem', color: '#666' }}
                                />
                                {subcat.subcategories && subcat.subcategories.length > 0 && (
                                  expandedMobile[subcat._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />
                                )}
                              </ListItemButton>
                            </ListItem>
                            
                            {/* Sub-subcategories */}
                            {subcat.subcategories && subcat.subcategories.length > 0 && (
                              <Collapse in={expandedMobile[subcat._id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  {subcat.subcategories.map((subsubcat) => (
                                    <ListItem key={subsubcat._id} disablePadding>
                                      <ListItemButton 
                                        sx={{ pl: 6 }}
                                        onClick={() => {
                                          navigate(`/category/${subsubcat.slug}`);
                                          handleDrawerToggle();
                                        }}
                                      >
                                        <ListItemText 
                                          primary={`> ${subsubcat.name} (${subsubcat.productCount})`}
                                          sx={{ fontSize: '0.8rem', color: '#888' }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </Collapse>
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
              
              <ListItem disablePadding>
                <ListItemButton onClick={handleDrawerToggle}>
                  <ListItemText primary="Contact Us" />
                </ListItemButton>
              </ListItem>
              
              {isLoggedIn ? (
                // Show when logged in
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                      navigate('/dashboard');
                      handleDrawerToggle();
                    }}>
                      <AccountCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                      <ListItemText primary="Account" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                // Show when not logged in
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                      navigate('/login');
                      handleDrawerToggle();
                    }}>
                      <ListItemText primary="Sign In" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                      navigate('/register');
                      handleDrawerToggle();
                    }}>
                      <ListItemText primary="Register" />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
};

export default Header;
