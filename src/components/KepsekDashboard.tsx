'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { FaChartPie, FaFilePdf, FaCalendarAlt, FaVideo, FaUserCheck, FaFileAlt, FaCheckCircle, FaMinus, FaSearch } from 'react-icons/fa';

export default function KepsekDashboard({ schedules, attendances, submissions, journals, users }: any) {
  const { systemDate } = useAppStore();
  
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterHari, setFilterHari] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const totalSchedules = schedules.length;
  const openSchedules = schedules.filter((s:any) => s.viconLink && s.viconLink !== '').length;
  const totalHadir = attendances.length;
  const totalTugas = submissions.length;
  
  const filteredSchedules = schedules.filter((s:any) => {
    if (filterDate && s.date !== filterDate) return false;
    if (filterHari) {
      const d = new Date(s.date);
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      if (days[d.getDay()] !== filterHari) return false;
    }
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return s.date.toLowerCase().includes(search) || 
           s.kelas.toLowerCase().includes(search) || 
           s.mapel.toLowerCase().includes(search) || 
           s.teacherName.toLowerCase().includes(search);
  });
  
  // Calculate attendance per student
  const siswaList = users?.filter((u:any) => u.role === 'siswa') || [];

  const cetakPDF = () => {
    window.print();
  };

  return (
    <>
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl shadow-2xl text-white flex justify-between items-end relative overflow-hidden no-print">
        <div className="absolute right-0 top-0 opacity-20"><FaChartPie className="text-[180px] -mt-10 -mr-10" /></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Executive Dashboard</h2>
            <p className="text-slate-400 font-medium mt-1.5 text-sm tracking-wide uppercase border-l-2 border-indigo-500 pl-3 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 cloud-live-indicator"></span> Real-time Cloud Telemetry
            </p>
          </div>
          <button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center text-sm cursor-pointer">
            <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 no-print">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaCalendarAlt className="absolute top-0 right-0 p-4 opacity-5 text-6xl" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Jadwal Tervalidasi</p><p className="text-4xl font-extrabold text-slate-800">{totalSchedules}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaVideo className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-blue-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Kelas Terbuka</p><p className="text-4xl font-extrabold text-blue-600">{openSchedules}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaUserCheck className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-emerald-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Presensi Hadir</p><p className="text-4xl font-extrabold text-emerald-600">{totalHadir}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaFileAlt className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-indigo-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Bukti Fisik Tugas</p><p className="text-4xl font-extrabold text-indigo-600">{totalTugas}</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="laporan-tabel">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-extrabold text-slate-800 text-lg">
            Laporan Pembelajaran Daring <br className="hidden print:block" />
            <span className="text-sm font-semibold text-indigo-600 print:text-slate-800 print:text-lg">UPT SPF SMPN 29 Makassar</span>
          </h3>
          <div className="relative w-full md:w-64 no-print">
            <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Tanggal / Kelas..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b-2 border-slate-200">
                <th className="p-4 font-extrabold">Tanggal & Kelas</th>
                <th className="p-4 font-extrabold">Mata Pelajaran / Guru</th>
                <th className="p-4 font-extrabold text-center">Status Vicon</th>
                <th className="p-4 font-extrabold text-center no-print">Link Vicon</th>
                <th className="p-4 font-extrabold text-center">Siswa Hadir</th>
                <th className="p-4 font-extrabold text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {filteredSchedules.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada KBM.</td></tr>
              ) : (
                filteredSchedules.map((s:any) => {
                  const adaJurnal = journals.find((j:any) => j.id === s.id);
                  const totalHadirKelas = attendances.filter((a:any) => a.scheduleId === s.id).length;
                  const totalSiswaKelas = users?.filter((u:any) => u.role === 'siswa' && u.kelas && s.kelas.includes(u.kelas)).length || 0;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4"><span className="font-extrabold text-slate-800 block text-base">{s.kelas}</span><span className="text-xs font-medium text-slate-500"><FaCalendarAlt className="inline mr-1" /> {s.date}</span></td>
                      <td className="p-4"><span className="font-bold text-indigo-700 block">{s.mapel}</span><span className="text-xs font-medium text-slate-500">{s.teacherName}</span></td>
                      <td className="p-4 text-center">{s.viconLink ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-bold uppercase">Terbuka</span> : <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded text-[10px] font-bold uppercase">Tertutup</span>}</td>
                      <td className="p-4 text-center no-print">
                        {s.viconLink ? (() => {
                          const href = s.viconLink.startsWith('http') ? s.viconLink : `https://${s.viconLink}`;
                          return (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                              <FaVideo className="mr-1.5" /> Gabung
                            </a>
                          )
                        })() : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-600">
                        {totalHadirKelas} <span className="text-slate-400 text-xs font-medium">/ {totalSiswaKelas}</span>
                      </td>
                      <td className="p-4 text-center">
                        {adaJurnal ? (
                          <div>
                            <FaCheckCircle className="text-emerald-500 mx-auto text-xl mb-1" />
                            {adaJurnal.photoUrls && adaJurnal.photoUrls.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mt-3">
                                  {adaJurnal.photoUrls.map((url: string, i: number) => {
                                    const len = adaJurnal.photoUrls.length;
                                    let imgClass = "h-48 md:h-64";
                                    if (len === 2) imgClass = "h-32 md:h-48";
                                    else if (len >= 3) imgClass = "h-24 md:h-32";
                                    return (
                                      <img key={i} onClick={() => setSelectedImage(url)} src={`/api/proxy?url=${encodeURIComponent(url)}`} className={`${imgClass} w-auto rounded-xl object-contain shadow-md border-2 border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer`} alt="Dok" loading="lazy" />
                                    );
                                  })}
                                </div>
                              )}
                          </div>
                        ) : <FaMinus className="text-slate-300 mx-auto text-xl" />}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          
          <div className="hidden print:flex flex-col items-end mt-12 pr-12 pb-10">
            <p className="mb-1 text-sm">Makassar, {(() => {
              if (!systemDate) return '';
              const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
              const parts = systemDate.split('-');
              if (parts.length === 3) {
                return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
              }
              return systemDate;
            })()}</p>
            <p className="mb-24 text-sm font-bold">Kepala Sekolah</p>
            <p className="text-sm font-bold border-b border-black pb-0.5">Hj. Nur Rahma, S.Pd., M.Pd.</p>
          </div>
        </div>
      </div>
    </div>
    {selectedImage && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setSelectedImage(null)}>
        <div className="relative max-w-7xl max-h-[95vh] flex flex-col items-center">
          <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <FaMinus className="text-xl rotate-45" />
          </button>
          <img src={`/api/proxy?url=${encodeURIComponent(selectedImage)}`} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20" alt="Preview Full" />
        </div>
      </div>
    )}
    </>
  );
}