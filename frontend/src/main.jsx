// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // Tailwind CSS is imported here

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
       <App />
  </BrowserRouter>
);