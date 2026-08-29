import { ErrorBoundary } from "./components/ErrorBoundary";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent unhandled AbortError and iframe navigation aborts from causing unhandled exceptions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.name === 'AbortError' ||
    event.reason?.code === 20 ||
    String(event.reason?.message || event.reason || '').toLowerCase().includes('abort') ||
    String(event.reason?.message || event.reason || '').toLowerCase().includes('cancelled')
  ) {
    event.preventDefault();
  }
});

// Register service worker for installable PWA safely
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Safely check for updates without throwing unhandled AbortError
        try {
          registration.update().catch(() => {});
        } catch {
          // ignore
        }
      })
      .catch((registrationError) => {
        console.log('SW registration notice: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </StrictMode>,
);

