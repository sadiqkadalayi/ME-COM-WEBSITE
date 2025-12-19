import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, InputAdornment, Typography, List, ListItem, ListItemText, Paper, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';



const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();




  // Handles input changes and triggers search with debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (value.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`/api/products/search?q=${encodeURIComponent(value)}`);
        setResults(response.data || []);
        setShowResults(true);
      } catch (error) {
        setResults([]);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleClose = () => {
    setShowResults(false);
  };

  return (
    <Box sx={{ width: '100%', mb: 1, position: 'relative', mt: 4 }}>
      <TextField
        value={query}
        onChange={handleChange}
        placeholder="Search for products..."
        variant="outlined"
        size="small"
        sx={{
          width: '100%',
          background: '#fff',
          borderRadius: 2,
          '& .MuiInputBase-root': {
            minHeight: 36,
            height: 39,
            padding: '0 8px',
          },
          '& input': {
            padding: '8px 0 8px 0',
            fontSize: 15,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {showResults && (
        <Paper sx={{ position: 'absolute', left: 0, right: 0, zIndex: 10, mt: 1, maxHeight: 500, overflowY: 'auto', p: 2 }}>
          {loading ? (
            <Typography variant="body2" sx={{ p: 2 }}>Loading...</Typography>
          ) : results.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {results.map((item) => (
                <Box key={item.id} sx={{ width: 180, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{item.price}</Typography>
                  <Button variant="contained" size="small">Add</Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ p: 2 }}>No products found.</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
