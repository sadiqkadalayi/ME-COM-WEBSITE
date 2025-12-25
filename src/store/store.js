import { configureStore } from '@reduxjs/toolkit';
import sliderReducer from '../redux/sliderSlice';
import registerReducer from '../redux/registerSlice';
import loginReducer from '../redux/LoginSlice';
import navigationCategoriesReducer from '../redux/NavigationCategoriesSlice';
import productsReducer from '../redux/ProductsSlice';
import cartReducer from '../redux/CartSlice';

export const store = configureStore({
  reducer: {
    slider: sliderReducer,
    register: registerReducer,
    login: loginReducer,
    navigationCategories: navigationCategoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    // user: userReducer,
  },
});
