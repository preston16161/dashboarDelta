import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActivityLog {
  action: string;
  details: string;
  timestamp: number;
  username: string;
}

interface ActivityLogStore {
  activityLogs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useActivityLogStore = create<ActivityLogStore>()(
  persist(
    (set) => ({
      activityLogs: [],
      addLog: (log) =>
        set((state) => ({
          activityLogs: [
            { ...log, timestamp: Date.now() },
            ...state.activityLogs,
          ].slice(0, 100), // Garde uniquement les 100 derniers logs
        })),
      clearLogs: () => set({ activityLogs: [] }),
    }),
    {
      name: 'activity-log-storage',
    }
  )
);