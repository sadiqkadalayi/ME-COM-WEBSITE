import { Provider } from 'react-redux';
import { store } from './store/store';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import AppRouter from './AppRouter';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const compactTheme = createTheme({
  typography: {
    fontSize: 13,
  },
  components: {
    MuiButton: { styleOverrides: { root: { fontSize: 13, padding: '3px 12px', minHeight: 28 } } },
    MuiTextField: { styleOverrides: { root: { fontSize: 13 } } },
    MuiInputBase: { styleOverrides: { root: { fontSize: 13, minHeight: 32 } } },
  },
});
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={compactTheme}>
        <BrowserRouter>
          <ScrollToTop />
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}>
              <Header />
            </Box>
            <Box sx={{ flex: 1, pt: { xs: 16, md: 18 }, pb: { xs: 10, md: 8 }, background: '#f9f9f9' }}>
              <Container maxWidth="xl" disableGutters={false} sx={{ height: '100%' }}>
                <AppRouter />
              </Container>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;