import { create } from 'zustand';

export type UserRole = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  cognitoSub: string;
  email: string;
  name: string;
  role: UserRole;
  status?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  idToken: string | null;
  isAuthenticated: boolean;
  setCredentials: (user: User, accessToken: string, idToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  idToken: null,
  isAuthenticated: false,
  setCredentials: (user, accessToken, idToken) =>
    set({ user, accessToken, idToken, isAuthenticated: true }),
  logout: () => set({ user: null, accessToken: null, idToken: null, isAuthenticated: false }),
}));