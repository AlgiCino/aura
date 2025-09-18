import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { onCLS, onFID, onLCP } from 'web-vitals';
import './index.css';
import './i18n.js';
import App from './App.jsx';

// Global unhandled promise rejection handler to prevent console spam from localhost checks
window.addEventListener('unhandledrejection', (event) => {
  // Check if this is a fetch error related to localhost AI provider detection
  if (
    event.reason?.message === 'Failed to fetch' &&
    event.reason?.stack?.includes('checkLocalProvider')
  ) {
    // Silently prevent the console error for localhost AI provider checks
    event.preventDefault();
    console.debug('Localhost AI provider check failed (expected):', event.reason.message);
  }
});

if (import.meta.env.DEV) {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
