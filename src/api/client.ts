import axios from 'axios';
import { auth } from '@/auth/firebaseConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

/* ------------------------------------------------------------------ */
/*  Request interceptor — attach Firebase ID token                     */
/* ------------------------------------------------------------------ */

apiClient.interceptors.request.use(async (reqConfig) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

/* ------------------------------------------------------------------ */
/*  Response interceptor — handle 401/403 globally                     */
/* ------------------------------------------------------------------ */

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Session expired or unauthenticated — redirect to login
        window.location.href = '/login';
      }

      if (status === 403) {
        // Forbidden — toast will be wired in Phase 2; log for now
        // eslint-disable-next-line no-console
        console.error('Access denied (403):', error.response.data);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
