import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/main.css';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
