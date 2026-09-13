'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { FaIdCard, FaShieldAlt, FaGraduationCap } from 'react-icons/fa';

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
      addToast('Kredensial (NIS / ID Guru) tidak terdaftar di Cloud Server.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-hidden font-sans">
      {/* Dark Green Gradient Background */}
      <div className="absolute inset-0 bg-[#0A261C] z-0">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#114533] via-[#0A261C] to-black"></div>
        
        {/* Decorative subtle orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1a5b45] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#ff6b00] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Glassmorphic Card */}
        <div className="bg-[#11382A]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
          
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-10 mt-2">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 shadow-black/20">
              <FaGraduationCap className="text-4xl text-[#0A261C]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Portal SKPD</h2>
            <p className="text-sm text-emerald-100/70 font-medium mb-1 tracking-wide">Sistem Kendali Pembelajaran Daring</p>
            <p className="text-sm text-orange-400 font-bold">UPT SPF SMPN 29 Makassar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-emerald-200/60 mb-2 uppercase tracking-widest">ID Pengguna (NIS / ID Guru)</label>
              <div className="relative">
                <FaIdCard className="absolute left-4 top-4 text-emerald-100/40 text-lg" />
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required 
                  autoComplete="off" 
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 focus:border-orange-400 rounded-xl outline-none text-white font-bold transition-all placeholder-emerald-100/30 shadow-inner" 
                  placeholder="Masukkan ID Anda..." 
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex justify-center items-center mt-2 group">
              AKSES SISTEM <FaShieldAlt className="ml-2 text-white/80 group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-[10px] font-bold text-emerald-200/40 mb-3 uppercase tracking-widest text-center">Petunjuk Akses</p>
            <div className="text-xs font-medium text-emerald-100/80 bg-black/20 p-4 rounded-xl border border-white/5 text-center leading-relaxed">
              Silakan masukkan <span className="font-bold text-orange-400">NIS</span> (Siswa), <span className="font-bold text-orange-400">ID Guru</span>, atau username khusus yang diberikan oleh admin.
            </div>
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center text-emerald-100/30 text-[10px] font-medium mt-8 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} UPT SPF SMPN 29 Makassar
        </p>
      </div>
    </div>
  );
}
