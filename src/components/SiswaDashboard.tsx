'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import PanduanSiswaModal from './PanduanSiswaModal';
import { FaUserGraduate, FaExclamationTriangle, FaFolderOpen, FaBookOpen, FaUserTie, FaArrowRight, FaLock } from 'react-icons/fa';

export default function SiswaDashboard({ schedules }: { schedules: any[] }) {
  const { currentUser, setView, systemDate, systemTime } = useAppStore();
  
  if (!currentUser) return null;

  const [showPanduan, setShowPanduan] = useState(false);

  const mySchedules = schedules.filter(s => currentUser?.kelas && s.kelas.includes(currentUser.kelas));
  
  const grouped = {} as Record<string, any[]>;
  mySchedules.forEach(s => {
    if(!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
  });

  const dates = Object.keys(grouped).sort();
  
  const [h, m] = systemTime.split(':').map(Number);
  const currentMins = h * 60 + m;
  const timeOpen = currentMins >= 7 * 60 && currentMins <= 23 * 60 + 59; // 07:00 - 23:59

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center">
        <div className="absolute right-0 top-0 opacity-10"><FaUserGraduate className="text-[150px] -mt-8 -mr-8" /></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h2 className="text-3xl font-extrabold tracking-tight">Ruang Belajar Interaktif</h2>
          <p className="text-blue-100 mt-1 font-medium">Siswa: {currentUser.name} | Kelas: <span className="font-bold text-white">{currentUser.kelas}</span></p>
        </div>
        <div className="relative z-10">
          <button onClick={() => setShowPanduan(true)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold py-2.5 px-6 rounded-xl text-sm flex items-center transition-colors shadow-sm backdrop-blur-sm">
            <FaBookOpen className="mr-2 text-lg" /> Buku Panduan
          </button>
        </div>
      </div>

      {!timeOpen && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex">
          <FaExclamationTriangle className="text-red-500 mt-1 mr-3 text-xl" />
          <div>
            <h4 className="font-bold text-red-800">Sistem Tertutup</h4>
            <p className="text-sm text-red-600 mt-1">Akses hanya jam 07:00 - 23:59 WITA. (Waktu Sistem: {systemTime} WITA)</p>
          </div>
        </div>
      )}

      {dates.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FaFolderOpen className="text-5xl mx-auto mb-4 text-slate-300" />
          <p>Jadwal kelas {currentUser.kelas} belum tersedia dari Guru.</p>
        </div>
      ) : (
        dates.map(date => {
          const isToday = date === systemDate;
          return (
            <div key={date} className="mb-10">
              <div className="flex items-center space-x-3 mb-5">
                <div className={`${isToday ? 'bg-slate-800' : 'bg-slate-300'} text-white text-[10px] font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase shadow-sm`}>{isToday ? 'HARI INI' : 'JADWAL'}</div>
                <h3 className="font-bold text-slate-700">{date}</h3>
              </div>
              <div className={`space-y-4 pl-3 md:pl-4 border-l-2 ${isToday ? 'border-indigo-500' : 'border-slate-200'}`}>
                {grouped[date].map(s => {
                  const canEnter = isToday && timeOpen;
                  const lockReason = !isToday ? 'Beda Hari' : (!timeOpen ? 'Jam Tutup' : '');

                  return (
                    <div key={s.id} className={`bg-white border ${canEnter ? 'border-indigo-300 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 shadow-sm'} rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-center ${!canEnter ? 'opacity-70 bg-slate-50 grayscale-[20%]' : ''}`}>
                      <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                        <div className={`w-14 h-14 rounded-2xl ${canEnter ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-2xl shadow-inner shrink-0`}><FaBookOpen /></div>
                        <div>
                          <h4 className="font-extrabold text-xl text-slate-800">{s.mapel}</h4>
                          <p className="text-sm font-medium text-slate-500 flex items-center"><FaUserTie className="mr-1" /> {s.teacherName}</p>
                        </div>
                      </div>
                      <div className="w-full md:w-auto text-right">
                        {canEnter ? (
                          <button onClick={() => setView('active_session', {scheduleId: s.id})} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 text-sm flex justify-center items-center">
                            Masuk Kelas <FaArrowRight className="ml-2" />
                          </button>
                        ) : (
                          <button disabled className="w-full md:w-auto bg-slate-100 text-slate-400 font-bold py-3 px-6 rounded-xl text-sm border flex justify-center items-center"><FaLock className="mr-2" /> Terkunci ({lockReason})</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
      
      {showPanduan && <PanduanSiswaModal onClose={() => setShowPanduan(false)} />}
    </div>
  );
}
