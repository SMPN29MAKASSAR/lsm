'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { FaIdCard, FaShieldAlt } from 'react-icons/fa';

export default function Login({ users, addToast }: { users: any[], addToast: any }) {
  const [id, setId] = useState('');
  const { login } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.id === id.trim().toUpperCase());
    if (user) {
      login(user);
      addToast(`Otentikasi Berhasil. Selamat datang, ${user.name}`, 'success');
    } else {
      addToast('Kredensial (NISN/NIP) tidak terdaftar di Cloud Server.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] fade-in">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Portal SKPD</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Kendali Pembelajaran Daring</p>
          <p className="text-sm text-indigo-600 font-bold mt-1">UPT SPF SMPN 29 Makassar</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">ID Pengguna (NISN / NIP)</label>
            <div className="relative">
              <FaIdCard className="absolute left-4 top-4 text-slate-400 text-lg" />
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                required 
                autoComplete="off" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder-slate-400" 
                placeholder="Masukkan ID Anda..." 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center">
            Akses Sistem <FaShieldAlt className="ml-2 text-indigo-300" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider text-center">Petunjuk Akses</p>
          <div className="text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 text-center leading-relaxed">
            Silakan masukkan <span className="font-bold text-slate-800">NIS</span> (Siswa), <span className="font-bold text-slate-800">NIP</span> (Guru), atau username khusus yang diberikan untuk <span className="font-bold text-slate-800">Tata Usaha & Kepala Sekolah</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
