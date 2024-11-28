import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const analyzeWebsite = createAsyncThunk(
  'website/analyze',
  async (url, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/analyze', 
        { url }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to analyze website'
      );
    }
  }
);

const websiteSlice = createSlice({
  name: 'website',
  initialState: {
    result: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(analyzeWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeWebsite.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(analyzeWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default websiteSlice.reducer;