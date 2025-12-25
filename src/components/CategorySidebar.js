import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CategorySidebar = ({ filters, onFiltersChange }) => {
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.navigationCategories || {});
  
  // State for collapsible categories
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Sample brand and color data (can be moved to Redux later)
  const brands = [
    'dept store', 'Vegetable', 'Nivea', 'Dove', 'Fruit', 'Gillan', 'Gaepia', 'Baladna'
  ];
  
  const colors = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Pink', 'Purple'
  ];

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSubcategoryClick = (subcategorySlug) => {
    navigate(`/category/${subcategorySlug}`);
  };

  const handleBrandChange = (brand, checked) => {
    const newBrands = checked 
      ? [...(filters.brands || []), brand]
      : (filters.brands || []).filter(b => b !== brand);
    
    onFiltersChange({
      ...filters,
      brands: newBrands
    });
  };

  const handleColorChange = (color, checked) => {
    const newColors = checked 
      ? [...(filters.colors || []), color]
      : (filters.colors || []).filter(c => c !== color);
    
    onFiltersChange({
      ...filters,
      colors: newColors
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      colors: [],
      priceRange: [0, 1000],
      sortBy: 'best-selling'
    });
  };

  return (
    <Card sx={{ p: 2 }}>
      {/* Clear Filters */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={clearFilters}
          sx={{ fontSize: 12 }}
        >
          Clear Filters
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          p: 1, 
          mb: 2, 
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 12,
          borderRadius: 1
        }}>
          CATEGORIES
        </Typography>
        
        <List dense sx={{ py: 0 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/products')}>
              <ListItemText 
                primary="All Products" 
                primaryTypographyProps={{ fontSize: 12 }}
              />
            </ListItemButton>
          </ListItem>
          
          {categories && categories.map((category) => (
            <React.Fragment key={category._id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleCategoryToggle(category._id)}
                  sx={{ py: 0.5 }}
                >
                  <ListItemText 
                    primary={category.name}
                    primaryTypographyProps={{ fontSize: 12 }}
                  />
                  {category.subcategories && category.subcategories.length > 0 && (
                    expandedCategories[category._id] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <Collapse in={expandedCategories[category._id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {category.subcategories.map((subcategory) => (
                      <ListItem key={subcategory._id} disablePadding>
                        <ListItemButton 
                          sx={{ pl: 4, py: 0.25 }} 
                          onClick={() => handleSubcategoryClick(subcategory.slug)}
                        >
                          <ListItemText 
                            primary={subcategory.name}
                            primaryTypographyProps={{ fontSize: 12 }}
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Brand Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          p: 1, 
          mb: 2, 
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 11,
          borderRadius: 1
        }}>
          BRAND
        </Typography>
        
        <FormControl fullWidth size="small">
          <Select
            value=""
            displayEmpty
            sx={{ fontSize: 11 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>-</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand} sx={{ fontSize: 12 }}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Primary Color Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          p: 1, 
          mb: 2, 
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 11,
          borderRadius: 1
        }}>
          PRIMARY COLOR
        </Typography>
        
        <FormControl fullWidth size="small">
          <Select
            value=""
            displayEmpty
            sx={{ fontSize: 11 }}
          >
            <MenuItem value="" sx={{ fontSize: 11 }}>-</MenuItem>
            {colors.map((color) => (
              <MenuItem key={color} value={color} sx={{ fontSize: 12 }}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Card>
  );
};

export default CategorySidebar;