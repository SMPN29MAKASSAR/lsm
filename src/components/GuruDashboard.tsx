'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { createSchedule, deleteSchedule, updateSchedule } from '@/app/actions';
import PanduanGuruModal from './PanduanGuruModal';
import { FaCalendarCheck, FaPlusCircle, FaTimes, FaCloudUploadAlt, FaChalkboardTeacher, FaCalendarAlt, FaPen, FaTrash, FaListAlt, FaBookOpen, FaClock } from 'react-icons/fa';

export default function GuruDashboard({ schedules, classes, addToast, refreshData }: { schedules: any[], classes: string[], addToast: any, refreshData: any }) {
  const { currentUser, setView, systemDate, systemTime } = useAppStore();
  const [h, m] = (systemTime || '00:00').split(':').map(Number);
  const currentMins = h * 60 + m;
  const [showForm, setShowForm] = useState(false);
  const [showPanduan, setShowPanduan] = useState(false);
  
  const [kelas, setKelas] = useState<string[]>([]);
  const [tanggal, setTanggal] = useState(systemDate);

  const getAliasIds = (id: string | undefined): string[] => {
    if (!id) return [];
    const aliases: Record<string, string[]> = {
      'G94': ['G94', 'G84'],
      'G84': ['G84', 'G94'],
      'G74': ['G74', 'G85'],
      'G85': ['G85', 'G74'],
      'G911': ['G911', 'G812'],
      'G812': ['G812', 'G911'],
      'G913': ['G913', 'G814'],
      'G814': ['G814', 'G913'],
      'G915': ['G915', 'G816'],
      'G816': ['G816', 'G915'],
      'G715': ['G715', 'G817'],
      'G817': ['G817', 'G715'],
      'G711': ['G711', 'G811'],
      'G811': ['G811', 'G711'],
      'G76': ['G76', 'G87'],
      'G87': ['G87', 'G76'],
      'G78': ['G78', 'G89'],
      'G89': ['G89', 'G78'],
    };
    return aliases[id] || [id];
  };

  const targetIds = getAliasIds(currentUser?.id);
  const mySchedules = schedules.filter(s => targetIds.includes(s.teacherId));

  const handleBuat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (kelas.length === 0) {
      addToast("Silakan pilih minimal 1 kelas", "error");
      return;
    }
    
    const data = {
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      mapel: currentUser.mapel || '',
      kelas: kelas.join(', '),
      date: tanggal,
    };
    
    const res = await createSchedule(data);
    if(res.success) {
      addToast("Jadwal sinkronisasi kelas berhasil", "success");
      setKelas([]);
      setShowForm(false);
      refreshData();
    } else {
      addToast("Gagal buat jadwal", "error");
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleConfirmHapus = async () => {
    if (!deleteId) return;
    const res = await deleteSchedule(deleteId);
    if(res.success) {
      addToast('Jadwal beserta seluruh data di dalamnya telah dihapus.', 'info');
      refreshData();
    } else {
      addToast('Gagal menghapus jadwal.', 'error');
    }
    setDeleteId(null);
  };
  const handleHapus = (id: string) => {
    setDeleteId(id);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 rounded-2xl shadow-lg text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <FaCalendarCheck className="absolute right-0 top-0 text-[120px] opacity-10 -mt-6 -mr-4" />
        <div className="relative z-10 w-full md:w-auto mb-6 md:mb-0">
          <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Sesi Guru</h2>
          <p className="text-emerald-100 mt-1 font-medium">Mapel Pengampu: <span className="bg-white/20 px-2 py-0.5 rounded font-bold ml-1">{currentUser?.mapel}</span></p>
        </div>
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          <button onClick={() => setShowPanduan(true)} className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold py-3 px-4 rounded-xl text-sm flex justify-center items-center transition-colors shadow-sm backdrop-blur-sm">
            <FaBookOpen className="mr-2 text-lg" /> Buku Panduan
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex-1 md:flex-none bg-white text-emerald-800 font-bold py-3 px-6 rounded-xl shadow-xl hover:bg-emerald-50 flex items-center justify-center">
            <FaPlusCircle className="mr-2 text-emerald-500" /> Buat Jadwal Baru
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md mb-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-lg">Parameter Jadwal Daring</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
          </div>
          <form onSubmit={handleBuat} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Kelas Tujuan (Bisa Pilih &gt; 1)</label>
                <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto flex flex-col gap-1">
                  {classes.map(c => (
                    <label key={c} className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={kelas.includes(c)} 
                        onChange={(e) => {
                          if (e.target.checked) setKelas([...kelas, c]);
                          else setKelas(kelas.filter(k => k !== c));
                        }} 
                        className="accent-indigo-600 rounded cursor-pointer w-4 h-4" 
                      />
                      <span className="text-sm font-medium text-slate-700">{c}</span>
                    </label>
                  ))}
                  {classes.length === 0 && <span className="text-sm text-slate-400 p-2">Belum ada data kelas</span>}
                </div>
              </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Pilih Tanggal</label>
              <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center"><FaCloudUploadAlt className="mr-2" /> Sinkronisasi Jadwal</button>
            </div>
          </form>
        </div>
      )}

      <div className="pt-2">
        <h3 className="font-extrabold text-xl text-slate-800 mb-5 flex items-center"><FaListAlt className="text-slate-400 mr-2" /> Daftar Sesi KBM Anda</h3>
        {mySchedules.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <p>Belum ada jadwal yang disiapkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mySchedules.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => {
              const isToday = s.date === systemDate;
              let stateLabel = 'TERJADWAL';
              let stateColor = 'bg-blue-100 text-blue-600 shadow-sm';
              let isOngoing = false;
              let isCompleted = false;

              if (isToday && s.startTime && s.endTime) {
                const [sh, sm] = s.startTime.split(':').map(Number);
                const [eh, em] = s.endTime.split(':').map(Number);
                const startMins = sh * 60 + sm;
                const endMins = eh * 60 + em;

                if (currentMins >= startMins && currentMins <= endMins) {
                  isOngoing = true;
                  stateLabel = 'SEDANG BERLANGSUNG';
                  stateColor = 'bg-emerald-500 text-white shadow-md';
                } else if (currentMins > endMins) {
                  isCompleted = true;
                  stateLabel = 'SELESAI HARI INI';
                  stateColor = 'bg-slate-200 text-slate-600 shadow-sm';
                } else {
                  stateLabel = 'HARI INI';
                  stateColor = 'bg-indigo-500 text-white shadow-md';
                }
              } else if (!isToday && s.date < systemDate) {
                 stateLabel = 'TELAH BERLALU';
                 stateColor = 'bg-slate-200 text-slate-600 shadow-sm';
              }

              return (
                <div key={s.id} className={`bg-white border ${isToday && isOngoing ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 shadow-sm'} rounded-xl p-5 relative flex flex-col group ${isCompleted || (!isToday && s.date < systemDate) ? 'opacity-70 grayscale-[20%]' : ''}`}>
                  {(isToday || s.date < systemDate) && <div className={`absolute -top-3 -right-3 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${stateColor}`}>{stateLabel}</div>}
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${isToday && isOngoing ? 'bg-emerald-100 text-emerald-600' : isToday ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'} flex items-center justify-center text-xl shrink-0`}>
                      <FaChalkboardTeacher />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{s.kelas}</h3>
                      <p className="text-xs font-medium text-slate-500 flex items-center"><FaCalendarAlt className="mr-1" /> {s.date}</p>
                      {s.startTime && s.endTime && <p className="text-xs font-bold text-slate-400 mt-0.5 flex items-center"><FaClock className="inline mr-1"/> {s.startTime} - {s.endTime}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button onClick={() => setView('active_session', {scheduleId: s.id})} className={`flex-grow py-2 rounded-lg text-sm font-bold transition-colors ${isOngoing ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : isToday ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md'}`}>
                      {isOngoing ? 'Kelola Kelas Sekarang' : isToday ? 'Masuk Kelas' : 'Siapkan Materi'}
                    </button>
                    <button onClick={() => handleHapus(s.id)} className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"><FaTrash /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {showPanduan && <PanduanGuruModal onClose={() => setShowPanduan(false)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-slideUp border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaTrash className="text-2xl" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Hapus Jadwal?</h3>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 text-center font-medium">
                <strong className="block mb-1 text-red-900">Peringatan Keras!</strong>
                Jika jadwal ini dihapus, maka seluruh <strong>Absensi Siswa</strong>, <strong>Jurnal Mengajar</strong>, dan <strong>Tugas Evaluasi</strong> pada sesi ini akan ikut terhapus secara permanen dan tidak dapat dipulihkan.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={handleConfirmHapus} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">Ya, Hapus Sesi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
