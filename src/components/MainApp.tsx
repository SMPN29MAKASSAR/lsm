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
  const { currentUser, currentView, systemTime } = useAppStore();
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
    const init = async () => {
      setLoading(true);
      if (currentUser) {
        await refreshData();
      } else {
        await fetchInitialData();
      }
      setLoading(false);
    };
    init();
  }, [currentUser, fetchInitialData, refreshData]);

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
        {(() => {
          const [h, m] = systemTime.split(':').map(Number);
          const currentMins = h * 60 + m;
          const isCurfew = currentMins >= (19 * 60) || currentMins < (7 * 60 + 30);
          
          if (isCurfew && currentUser && currentUser.role !== 'admin' && currentUser.role !== 'kepsek') {
            return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 fade-in">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-amber-400 text-5xl mb-6 shadow-xl border-4 border-slate-700">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">SISTEM SEDANG ISTIRAHAT</h2>
                <p className="text-slate-600 text-lg max-w-md mx-auto mb-8 font-medium">Jam Malam diaktifkan. Akses untuk Guru dan Siswa ditutup mulai pukul 19:00 hingga 07:30 WITA demi menghemat biaya server.</p>
                <button onClick={() => useAppStore.getState().logout()} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                  Kembali ke Halaman Login
                </button>
              </div>
            );
          }
          return null;
        })()}
        {!currentUser && <Login users={users} addToast={addToast} />}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'admin' && (
          <AdminDashboard users={users} schedules={schedules} addToast={addToast} refreshData={refreshData} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'guru' && !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30) && (
          <GuruDashboard schedules={schedules} classes={classes} addToast={addToast} refreshData={refreshData} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'siswa' && !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30) && (
          <SiswaDashboard schedules={schedules} />
        )}
        
        {currentUser && currentView === 'dashboard' && currentUser.role === 'kepsek' && (
          <KepsekDashboard schedules={schedules} attendances={attendances} submissions={submissions} journals={journals} users={users} />
        )}

        {currentUser && currentView === 'active_session' && (currentUser.role === 'admin' || currentUser.role === 'kepsek' || !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30)) && (
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
