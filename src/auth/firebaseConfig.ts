import type { Auth, User } from 'firebase/auth';

const DEV_FIREBASE_UID = import.meta.env.VITE_DEV_USER_FIREBASE_UID as string | undefined;

const devUser = DEV_FIREBASE_UID
  ? ({ getIdToken: async () => `dev:${DEV_FIREBASE_UID}` } as unknown as User)
  : null;

export const auth = { currentUser: devUser } as unknown as Auth;
