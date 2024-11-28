// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import VisitorClassifier from './components/VisitorClassifier';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 py-8">
        <Toaster position="top-right" />
        <VisitorClassifier />
      </div>
    </Provider>
  );
}

export default App;