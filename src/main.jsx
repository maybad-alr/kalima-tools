import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
// Prerendered HTML is a static preview; we re-render fresh (no hydration
// mismatch risk) over it once the app boots.
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
