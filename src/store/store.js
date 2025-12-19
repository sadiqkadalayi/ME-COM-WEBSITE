import { configureStore } from '@reduxjs/toolkit';
import sliderReducer from '../redux/sliderSlice';

export const store = configureStore({
  reducer: {
    slider: sliderReducer,
    // user: userReducer,
  },
});
