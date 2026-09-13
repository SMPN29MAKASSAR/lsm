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

const getWitaTime = () => {
  try {
    const formatted = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Makassar',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
    const [date, time] = formatted.split(', ');
    return { date, time: time.replace('24:', '00:') };
  } catch (e) {
    return { date: '2026-09-13', time: '08:00' };
  }
};

const initialWita = getWitaTime();

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      currentView: 'login',
      activeScheduleId: null,
      systemDate: initialWita.date,
      systemTime: initialWita.time,
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
      partialize: (state) => ({ 
        currentUser: state.currentUser, 
        currentView: state.currentView, 
        activeScheduleId: state.activeScheduleId 
      }),
    }
  )
);
