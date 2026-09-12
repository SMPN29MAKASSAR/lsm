import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  role: string;
  kelas: string | null;
  mapel: string | null;
};

interface AppState {
  currentUser: User | null;
  currentView: string; // 'login', 'dashboard', 'active_session'
  activeScheduleId: string | null;
  systemDate: string;
  systemTime: string;
  login: (user: User) => void;
  logout: () => void;
  setView: (view: string, data?: { scheduleId?: string }) => void;
  setSystemTime: (date: string, time: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      currentView: 'login',
      activeScheduleId: null,
      systemDate: '2026-09-14',
      systemTime: '08:00',
      login: (user) => set({ currentUser: user, currentView: 'dashboard' }),
      logout: () => set({ currentUser: null, currentView: 'login', activeScheduleId: null }),
      setView: (view, data) => set((state) => ({ 
        currentView: view, 
        activeScheduleId: data?.scheduleId || state.activeScheduleId 
      })),
      setSystemTime: (date, time) => set({ systemDate: date, systemTime: time }),
    }),
    {
      name: 'skpd-storage',
    }
  )
);
