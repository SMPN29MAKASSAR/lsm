import React from 'react';
import { FaTimes, FaBook, FaCheckCircle, FaVideo, FaUpload, FaClock, FaCircle } from 'react-icons/fa';

export default function PanduanSiswaModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              <FaBook />
            </div>
            <div>
              <h2 className="text-xl font-bold">Buku Panduan Siswa</h2>
              <p className="text-blue-100 text-xs">Aturan & Cara Penggunaan Ruang Belajar Interaktif</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50 flex-grow">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">1</div>
              Melihat Status & Masuk Kelas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Di halaman utama, jadwal pelajaran memiliki label dan warna yang berbeda sesuai waktunya:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaCircle className="text-emerald-500 mt-1 mr-3 shrink-0 text-xs" />
                <span><b>Sedang Berlangsung (Hijau):</b> Jam pelajaran sedang aktif saat ini. Segera klik <b>Masuk Kelas Sekarang</b>!</span>
              </li>
              <li className="flex items-start">
                <FaCircle className="text-indigo-500 mt-1 mr-3 shrink-0 text-xs" />
                <span><b>Terjadwal (Biru):</b> Kelas untuk hari ini namun jam mulainya belum tiba.</span>
              </li>
              <li className="flex items-start">
                <FaCircle className="text-slate-400 mt-1 mr-3 shrink-0 text-xs" />
                <span><b>Telah Selesai (Abu-abu):</b> Jam pelajaran telah berakhir. <i>Kamu masih bisa masuk untuk mengumpulkan tugas yang belum selesai.</i></span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">2</div>
              Absen & Ruang Virtual (Batas Waktu!)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Di dalam Ruang Belajar, kamu harus menekan tombol <b>"Klik Hadir & Masuk Kelas Virtual"</b> untuk absen dan masuk ke pertemuan tatap muka (Google Meet / Zoom).
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
              <span className="font-bold text-red-600"><FaClock className="inline mr-1" /> PENTING:</span> Pintu Ruang Virtual <b>hanya terbuka selama jam pelajaran berlangsung</b>. Jika jam kelas telah habis, pintu Ruang Virtual otomatis ditutup!
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">3</div>
              Kirim Tugas / Bukti Evaluasi (Batas Waktu!)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Jika ada tugas (LKPD) dari guru, kerjakan lalu kirim jawaban dan foto tugasmu di kolom "Refleksi & Jawaban".
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
              <span className="font-bold text-amber-700"><FaClock className="inline mr-1" /> DEADLINE TUGAS:</span> Kolom pengiriman tugas akan tetap buka dan bisa kamu isi hingga <b>Pukul 18:00 WITA</b> pada hari tersebut. Lewat dari pukul 18:00, kamu <b>tidak bisa lagi mengirim tugas</b> ke guru!
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors">
            Saya Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
