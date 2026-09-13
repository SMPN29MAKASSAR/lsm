import React from 'react';
import { FaTimes, FaBook, FaCheckCircle, FaVideo, FaUpload, FaClock } from 'react-icons/fa';

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
              <p className="text-blue-100 text-xs">Cara mudah menggunakan aplikasi Ruang Belajar Interaktif</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 bg-slate-50 flex-grow">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">1</div>
              Memilih Jadwal & Masuk Kelas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Setelah login, kamu akan melihat daftar mata pelajaran. Kamu <b>hanya bisa masuk ke jadwal untuk hari ini</b> (tulisan "HARI INI" berwana gelap). 
              Jika waktunya sudah pas, tombol <span className="font-bold text-indigo-600">"Masuk Kelas"</span> akan berwarna biru. Klik tombol itu untuk masuk ke Ruang Belajar!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3 text-sm">2</div>
              Absen & Masuk Ruang Virtual (Vicon)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Di dalam Ruang Belajar, hal pertama yang harus kamu lakukan adalah absen!
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaCheckCircle className="text-emerald-500 mt-1 mr-3 shrink-0" />
                <span>Klik tombol hijau bertuliskan <b>"Klik Hadir & Masuk Kelas Virtual"</b>.</span>
              </li>
              <li className="flex items-start">
                <FaVideo className="text-blue-500 mt-1 mr-3 shrink-0" />
                <span>Setelah diklik, kamu akan <b>otomatis tercatat hadir</b> dan langsung diarahkan ke Zoom atau Google Meet milik Gurumu.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-3 text-sm">3</div>
              Mengerjakan & Mengirim Tugas (LKPD)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Jika Guru memberikan tugas, kamu akan melihat instruksi atau gambar soal dari Guru. Setelah kamu kerjakan (misal: di buku tulis dan difoto), cara kumpulnya gampang:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mt-0.5 mr-3 shrink-0">A</div>
                <span>Tulis jawaban atau komentar kamu di kotak pesan.</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mt-0.5 mr-3 shrink-0">B</div>
                <span>Klik tombol <b>"Pilih File"</b> untuk melampirkan foto jawabanmu.</span>
              </li>
              <li className="flex items-start">
                <FaUpload className="text-amber-500 mt-1 mr-3 shrink-0" />
                <span>Klik tombol <b>"Kirim ke Guru"</b> dan tunggu sampai berhasil!</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 text-sm">4</div>
              Perhatikan Waktu Belajar!
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              <FaClock className="inline text-red-500 mr-2" />
              Sistem ini <b>hanya buka dari jam 07:00 pagi sampai 23:59 malam</b> (WITA). Di luar jam tersebut, sistem tertutup dan tombol-tombol akan terkunci. Pastikan kamu hadir dan kumpul tugas tepat waktu ya!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors">
            Saya Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
