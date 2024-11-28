import { configureStore } from '@reduxjs/toolkit';
import websiteReducer from './websiteSlice';

export const store = configureStore({
  reducer: {
    website: websiteReducer
  }
});