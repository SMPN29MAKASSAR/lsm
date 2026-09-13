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
              Membuat & Membuka Jadwal
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Anda dapat mengelola jadwal kelas langsung dari Dashboard Guru atau mengandalkan jadwal dari Admin. Untuk memulai kelas, klik tombol <span className="font-bold text-indigo-600">"Masuk & Siapkan Kelas"</span> pada jadwal yang tersedia. Anda bisa masuk ke kelas kapan saja untuk mempersiapkan materi sebelum siswa masuk!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm">2</div>
              Pintu Ruang Kelas (Vicon)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Admin akan mengatur tautan (link) Zoom atau Google Meet untuk kelas Anda. Anda hanya perlu menekan tombol <span className="font-bold text-blue-600">"GABUNG"</span> untuk masuk ke ruang pertemuan virtual. Siswa juga akan otomatis diarahkan ke link tersebut saat mereka absen masuk kelas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-3 text-sm">3</div>
              Distribusi LKPD & Tugas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Anda dapat memberikan Lembar Kerja Peserta Didik (LKPD) atau tugas kepada siswa saat sesi berlangsung:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaClipboardList className="text-amber-500 mt-1 mr-3 shrink-0" />
                <span>Ketik <b>Instruksi Tugas</b> di kolom teks yang disediakan.</span>
              </li>
              <li className="flex items-start">
                <FaUpload className="text-amber-500 mt-1 mr-3 shrink-0" />
                <span>Jika perlu, <b>Upload Gambar</b> soal atau materi pendukung (format .jpg / .png).</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-emerald-500 mt-1 mr-3 shrink-0" />
                <span>Klik <b>Simpan & Bagikan ke Siswa</b> agar tugas langsung tampil di layar semua siswa.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3 text-sm">4</div>
              Monitoring Absensi & Penilaian Tugas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Di bagian bawah halaman kelas:
            </p>
            <ul className="text-sm text-slate-600 space-y-3 pl-2">
              <li className="flex items-start">
                <FaUserCheck className="text-emerald-500 mt-1 mr-3 shrink-0" />
                <span><b>Daftar Hadir:</b> Anda dapat melihat daftar siswa yang telah menekan tombol absensi secara otomatis.</span>
              </li>
              <li className="flex items-start">
                <FaClipboardList className="text-indigo-500 mt-1 mr-3 shrink-0" />
                <span><b>Tugas Siswa:</b> Lihat hasil unggahan foto jawaban siswa, kemudian berikan angka <b>Nilai</b> dan klik <b>Nilai (Bintang)</b> untuk menyimpan ke database.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 text-sm">5</div>
              Jurnal Kelas
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Setelah kegiatan belajar mengajar selesai, sangat penting untuk mengisi <b>Jurnal Kelas</b> di bagian bawah. Catat materi yang dibahas, kemajuan kelas, atau kendala yang ditemui, lalu klik <b>Simpan Jurnal</b> untuk laporan administrasi Kepala Sekolah.
            </p>
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
