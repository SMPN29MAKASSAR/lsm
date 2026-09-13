'use client';

import { useAppStore } from '@/store';
import { FaShieldAlt, FaClock, FaPowerOff } from 'react-icons/fa';

export default function Header() {
  const { currentUser, logout, setView, systemDate, systemTime, setSystemTime } = useAppStore();

  if (!currentUser) return null;

  return (
    <header className="glass-header sticky top-0 z-40" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-2.5 rounded-xl shadow-inner">
            <FaShieldAlt className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-800">SKPD Terpadu</h1>
              <span id="cloud-status" className="flex items-center bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 cloud-live-indicator"></div> LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dinas Pendidikan Kota Makassar</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm" title="Ubah tanggal dan waktu untuk menguji akses jadwal">
            <FaClock className="mr-2 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase leading-none mb-1 text-amber-600">Waktu Aktif (Dapat Diubah)</span>
              <div className="flex space-x-1 items-center">
                <input 
                  type="date" 
                  value={systemDate} 
                  onChange={(e) => setSystemTime(e.target.value, systemTime)} 
                  className="bg-transparent border-none outline-none font-bold text-xs cursor-pointer w-28" 
                />
                <span className="font-bold text-xs">|</span>
                <input 
                  type="time" 
                  value={systemTime} 
                  onChange={(e) => setSystemTime(systemDate, e.target.value)} 
                  className="bg-transparent border-none outline-none font-bold text-xs cursor-pointer w-20" 
                />
                <span className="text-xs font-bold ml-1">WITA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-white pl-4 pr-1.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <div className="text-right mr-3 hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {currentUser.kelas || (currentUser.role === 'admin' ? 'Tata Usaha' : currentUser.role)}
              </p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={logout} className="ml-2 px-3 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100" title="Keluar">
              <FaPowerOff className="text-sm mr-1.5" /> <span className="text-xs font-black tracking-wider">KELUAR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
