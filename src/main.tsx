import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAuthStore } from '@/store/authStore';
import { MOCK_CURRENT_USER } from '@/mocks/data';

// Seed mock user so the sidebar shows a name instead of "Guest"
useAuthStore.getState().setUser(MOCK_CURRENT_USER);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
