import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  darkMode: boolean;
}

interface PreferencesStore {
  preferences: Record<string, UserPreferences>;
  setUserPreferences: (username: string, preferences: UserPreferences) => void;
  getUserPreferences: (username: string) => UserPreferences;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: {},
      setUserPreferences: (username, preferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [username]: preferences,
          },
        })),
      getUserPreferences: (username) =>
        get().preferences[username] || { darkMode: false },
    }),
    {
      name: 'user-preferences',
    }
  )
);