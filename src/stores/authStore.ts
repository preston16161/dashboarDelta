import { create } from 'zustand';
import { db } from '../lib/db';

interface User {
  id?: number;
  username: string;
  name: string;
  rank: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: async (username: string, password: string) => {
    try {
      const user = await db.users
        .where('username')
        .equals(username)
        .and((user) => user.password === password)
        .first();

      if (user) {
        set({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            rank: user.rank
          },
          isLoggedIn: true
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  logout: () => set({ user: null, isLoggedIn: false })
}));