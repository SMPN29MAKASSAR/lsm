'use client';

import { useAppStore } from '@/store';
import { FaChartPie, FaFilePdf, FaCalendarAlt, FaVideo, FaUserCheck, FaFileAlt, FaCheckCircle, FaMinus } from 'react-icons/fa';

export default function KepsekDashboard({ schedules, attendances, submissions, journals }: any) {
  const { systemDate } = useAppStore();

  const totalSchedules = schedules.length;
  const openSchedules = schedules.filter((s:any) => s.viconLink && s.viconLink !== '').length;
  const totalHadir = attendances.length;
  const totalTugas = submissions.length;

  const cetakPDF = async () => {
    try {
      const element = document.getElementById('laporan-tabel');
      if(!element) {
        alert("Tabel laporan tidak ditemukan.");
        return;
      }
      
      // Menggunakan versi CDN global
      // @ts-ignore
      if (typeof window !== 'undefined' && window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set({
          margin: 10, filename: `Laporan_SKPD_${systemDate}.pdf`, image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        }).from(element).save();
      } else {
        alert("Modul PDF belum selesai dimuat. Silakan tunggu beberapa detik dan coba lagi.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat mencetak PDF.");
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl shadow-2xl text-white flex justify-between items-end relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-20"><FaChartPie className="text-[180px] -mt-10 -mr-10" /></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Executive Dashboard</h2>
            <p className="text-slate-400 font-medium mt-1.5 text-sm tracking-wide uppercase border-l-2 border-indigo-500 pl-3 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 cloud-live-indicator"></span> Real-time Cloud Telemetry
            </p>
          </div>
          <button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center text-sm">
            <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaCalendarAlt className="absolute top-0 right-0 p-4 opacity-5 text-6xl" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Jadwal Tervalidasi</p><p className="text-4xl font-extrabold text-slate-800">{totalSchedules}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaVideo className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-blue-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Kelas Terbuka</p><p className="text-4xl font-extrabold text-blue-600">{openSchedules}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaUserCheck className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-emerald-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Presensi Hadir</p><p className="text-4xl font-extrabold text-emerald-600">{totalHadir}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"><FaFileAlt className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-indigo-500" /><p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">Bukti Fisik Tugas</p><p className="text-4xl font-extrabold text-indigo-600">{totalTugas}</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="laporan-tabel">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-lg">Buku Besar Pengawasan KBM</h3>
        </div>
        <div className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b-2 border-slate-200">
                <th className="p-4 font-extrabold">Tanggal & Kelas</th>
                <th className="p-4 font-extrabold">Mata Pelajaran / Guru</th>
                <th className="p-4 font-extrabold text-center">Status Vicon</th>
                <th className="p-4 font-extrabold text-center">Jurnal (Server)</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {schedules.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada KBM.</td></tr>
              ) : (
                schedules.map((s:any) => {
                  const adaJurnal = journals.find((j:any) => j.id === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4"><span className="font-extrabold text-slate-800 block text-base">{s.kelas}</span><span className="text-xs font-medium text-slate-500"><FaCalendarAlt className="inline mr-1" /> {s.date}</span></td>
                      <td className="p-4"><span className="font-bold text-indigo-700 block">{s.mapel}</span><span className="text-xs font-medium text-slate-500">{s.teacherName}</span></td>
                      <td className="p-4 text-center">{s.viconLink ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-bold uppercase">Terbuka</span> : <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded text-[10px] font-bold uppercase">Tertutup</span>}</td>
                      <td className="p-4 text-center text-xl">{adaJurnal ? <FaCheckCircle className="text-emerald-500 mx-auto" /> : <FaMinus className="text-slate-300 mx-auto" />}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
