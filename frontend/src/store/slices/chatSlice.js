// src/store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const analyzeWebsite = createAsyncThunk(
  'chat/analyzeWebsite',
  async (url) => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  messages: [{
    type: 'bot',
    content: "Hi! I can help analyze any website and understand what you're looking for. Please share a URL you'd like to explore!"
  }],
  loading: false,
  error: null,
  currentUrl: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentUrl: (state, action) => {
      state.currentUrl = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetChat: (state) => {
      // Reset to initial state
      return initialState;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(analyzeWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeWebsite.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.question && action.payload.options) {
          state.messages.push({
            type: 'bot',
            content: action.payload.question,
            options: action.payload.options
          });
        }
      })
      .addCase(analyzeWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Add error message to chat
        state.messages.push({
          type: 'bot',
          content: "I had trouble analyzing that website. Could you try another one?",
          isError: true
        });
      });
  }
});

export const { 
  addMessage, 
  setCurrentUrl, 
  clearError, 
  resetChat,
  setLoading 
} = chatSlice.actions;

// Selectors
export const selectMessages = state => state.chat.messages;
export const selectLoading = state => state.chat.loading;
export const selectError = state => state.chat.error;
export const selectCurrentUrl = state => state.chat.currentUrl;

export default chatSlice.reducer;