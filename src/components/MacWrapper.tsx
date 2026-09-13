'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaExpandArrowsAlt, FaCompressArrowsAlt, FaMinus } from 'react-icons/fa';

export default function MacWrapper({ children }: { children: React.ReactNode }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <>{children}</>;

  if (isClosed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white flex-col">
        <h2 className="text-2xl font-bold mb-4">Aplikasi Ditutup</h2>
        <button 
          onClick={() => setIsClosed(false)} 
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-colors"
        >
          Buka Kembali
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-900 ${isMaximized ? '' : 'p-2 md:p-6 lg:p-10'} flex flex-col items-center justify-center transition-all duration-300 print:p-0 print:bg-white`}>
      <div className={`bg-white w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${isMaximized ? 'h-screen rounded-none' : 'max-w-[1400px] h-[90vh] rounded-xl border border-slate-700/30'} print:h-auto print:max-w-none print:shadow-none print:border-none print:rounded-none`}>
        
        <div className="h-10 bg-[#f0f1f4] border-b border-slate-200 flex items-center px-4 relative flex-shrink-0 select-none print:hidden">
          <div className="flex items-center gap-2 z-10 group">
            <button 
              onClick={() => setIsClosed(true)}
              className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center overflow-hidden transition-colors hover:bg-red-500"
              title="Tutup (Close)"
            >
              <FaTimes className="text-[7px] text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center overflow-hidden transition-colors hover:bg-amber-400"
              title="Perkecil (Minimize)"
            >
              <FaMinus className="text-[7px] text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center overflow-hidden transition-colors hover:bg-emerald-500"
              title="Perbesar (Maximize)"
            >
              {isMaximized ? (
                <FaCompressArrowsAlt className="text-[7px] text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <FaExpandArrowsAlt className="text-[7px] text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[13px] font-semibold text-slate-600">Portal Layanan Digital</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative bg-slate-50 print:bg-white print:overflow-visible">
          {children}
        </div>

      </div>
    </div>
  );
}