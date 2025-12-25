import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state.login || {});

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const menuItems = [
    { label: 'Orders', value: 0, title: 'Orders' },
    { label: 'Returns', value: 1, title: 'Returns' },
    { label: 'Messages (0)', value: 2, title: 'Messages' },
    { label: 'Addresses', value: 3, title: 'Addresses' },
    { label: 'Wish Lists', value: 4, title: 'Wish Lists' },
    { label: 'Recently Viewed', value: 5, title: 'Recently Viewed' },
    { label: 'Account Settings', value: 6, title: 'Account Settings' }
  ];

  const getActiveTitle = () => {
    const activeItem = menuItems.find(item => item.value === activeTab);
    return activeItem ? activeItem.title : 'Dashboard';
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, mt: 1.5, fontSize: 12 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}
          >
            HOME
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/dashboard" 
            sx={{ fontSize: 12 }}
          >
            YOUR ACCOUNT
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 12, fontWeight: 500 }}>
            YOUR {getActiveTitle().toUpperCase()}
          </Typography>
        </Breadcrumbs>

        {/* Page Title Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, position: 'relative' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#666', fontSize: 16 }}>
            Welcome, {user?.name || 'User'}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 28, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {getActiveTitle()}
          </Typography>
          <Box sx={{ width: '120px' }} /> {/* Spacer for balance */}
        </Box>

        {/* Navigation Menu */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { 
                fontSize: 12, 
                fontWeight: 500,
                minHeight: 48,
                textTransform: 'none',
                color: '#666'
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#0066cc',
                fontWeight: 600
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0066cc'
              }
            }}
          >
            {menuItems.map((item) => (
              <Tab 
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Your Orders
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                You haven't placed any orders yet. Start shopping to see your orders here!
              </Typography>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Returns & Refunds
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                No returns found. Your return requests will appear here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Messages
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                No messages at the moment. We'll notify you here for any updates.
              </Typography>
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Address Book
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Manage your shipping and billing addresses here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Wish List
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Save your favorite items for later. Your wish list is empty.
              </Typography>
            </Box>
          )}
          
          {activeTab === 5 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recently Viewed
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Products you've recently viewed will appear here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 6 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Account Settings
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Manage your account information, password, and preferences.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage;