import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage
if (
  localStorage.getItem('theme-store') && 
  JSON.parse(localStorage.getItem('theme-store')!).state?.isDark
) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);