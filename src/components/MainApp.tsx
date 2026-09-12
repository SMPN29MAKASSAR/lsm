'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { 
  getUsers, getSchedules, getAttendances, getSubmissions, getJournals, seedUsers 
} from '@/app/actions';
import Header from './Header';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import GuruDashboard from './GuruDashboard';
import SiswaDashboard from './SiswaDashboard';
import KepsekDashboard from './KepsekDashboard';
import ActiveSession from './ActiveSession';
import ToastContainer from './ToastContainer';

export default function MainApp() {
  const { currentUser, currentView } = useAppStore();
  const [loading, setLoading] = useState(true);
  
  // Local state for "cloud" data
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);

  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (pesan: string, tipe: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, pesan, tipe }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchInitialData = useCallback(async () => {
    try {
      let _users = await getUsers();
      
      if (_users.length === 0) {
        await seedUsers();
        _users = await getUsers();
      }
      setUsers(_users);
      extractClasses(_users);
    } catch (e) {
      console.error(e);
      addToast('Gagal memuat data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [_users, _schedules, _attendances, _submissions, _journals] = await Promise.all([
        getUsers(), getSchedules(), getAttendances(), getSubmissions(), getJournals()
      ]);
      setUsers(_users);
      extractClasses(_users);
      setSchedules(_schedules);
      setAttendances(_attendances);
      setSubmissions(_submissions);
      setJournals(_journals);
    } catch (e) {
      console.error(e);
      addToast('Gagal menyinkronkan data terbaru', 'error');
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, refreshData]);

  const extractClasses = (userList: any[]) => {
    const classSet = new Set<string>();
    userList.forEach(u => {
      if (u.role === 'siswa' && u.kelas) classSet.add(u.kelas);
    });
    setClasses(Array.from(classSet).sort());
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center fade-in flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>);
  }

  return (
    <>
      <Header />
      <ToastContainer toasts={toasts} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-container">
        {!currentUser && <Login users={users} addToast={addToast} />}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'admin' && (
          <AdminDashboard users={users} addToast={addToast} refreshData={refreshData} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'guru' && (
          <GuruDashboard schedules={schedules} classes={classes} addToast={addToast} refreshData={refreshData} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'siswa' && (
          <SiswaDashboard schedules={schedules} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'kepsek' && (
          <KepsekDashboard schedules={schedules} attendances={attendances} submissions={submissions} journals={journals} users={users} />
        )}

        {currentUser && currentView === 'active_session' && (
          <ActiveSession 
            schedules={schedules} 
            users={users} 
            attendances={attendances} 
            submissions={submissions} 
            journals={journals} 
            addToast={addToast} 
            refreshData={refreshData} 
          />
        )}
      </main>
    </>
  );
}
