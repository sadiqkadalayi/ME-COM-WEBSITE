import { configureStore } from '@reduxjs/toolkit';
import sliderReducer from '../redux/sliderSlice';
import registerReducer from '../redux/registerSlice';
import loginReducer from '../redux/LoginSlice';

export const store = configureStore({
  reducer: {
    slider: sliderReducer,
    register: registerReducer,
    login: loginReducer,
    // user: userReducer,
  },
});
