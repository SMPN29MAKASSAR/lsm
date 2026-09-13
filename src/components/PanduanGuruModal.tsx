import React from 'react';
import { FaTimes, FaBook, FaCheckCircle, FaVideo, FaUpload, FaClock, FaClipboardList, FaUserCheck, FaBookOpen } from 'react-icons/fa';

export default function PanduanGuruModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              <FaBookOpen />
            </div>
            <div>
              <h2 className="text-xl font-bold">Buku Panduan Guru</h2>
              <p className="text-emerald-100 text-xs">Petunjuk manajemen kelas di Ruang Belajar Interaktif</p>
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
              Memulai Kelas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Karena kelas sudah dijadwalkan oleh Admin, Anda tidak perlu lagi membuat jadwal secara manual. Di beranda, Anda cukup klik tombol <span className="font-bold text-emerald-600">"Kelola Kelas Sekarang"</span> untuk jadwal yang aktif hari ini, atau klik <span className="font-bold text-slate-800">"Siapkan Materi"</span> untuk jadwal yang akan datang.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm">2</div>
              Setting Tugas & Gabung Mengajar
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Di dalam kelas, Anda hanya perlu melakukan dua hal utama:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaClipboardList className="text-amber-500 mt-1 mr-3 shrink-0" />
                <span><b>Setting Tugas/LKPD:</b> Ketik instruksi dan bagikan foto soal (jika ada) ke layar siswa.</span>
              </li>
              <li className="flex items-start">
                <FaVideo className="text-blue-500 mt-1 mr-3 shrink-0" />
                <span><b>Mulai Mengajar:</b> Klik tombol <b>"GABUNG"</b> untuk langsung masuk ke ruang virtual (Google Meet/Zoom) yang link-nya sudah disediakan oleh Admin.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 text-sm">3</div>
              Jurnal & Dokumentasi PBM
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Setelah selesai mengajar melalui Google Meet/Zoom, <b>wajib lakukan Screenshot (Tangkapan Layar)</b> sebagai bukti Anda telah mengajar. Kemudian kembali ke sistem ini, gulir ke bagian paling bawah (Jurnal Kelas), dan <b>Upload Screenshot</b> tersebut berserta catatan materi, lalu klik <b>Simpan Jurnal</b>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3 text-sm">4</div>
              Monitoring Absensi & Penilaian
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Sembari atau setelah mengajar, Anda bisa mengecek bagian bawah halaman kelas untuk:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaUserCheck className="text-emerald-500 mt-1 mr-3 shrink-0" />
                <span><b>Daftar Hadir:</b> Melihat daftar siswa yang telah menekan absensi secara otomatis.</span>
              </li>
              <li className="flex items-start">
                <FaClipboardList className="text-indigo-500 mt-1 mr-3 shrink-0" />
                <span><b>Tugas Siswa:</b> Melihat hasil foto jawaban siswa dan memberikan nilai.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors">
            Saya Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
