import React from 'react';
import { FaTimes, FaBookOpen, FaChartPie, FaSearch, FaFileWord, FaImage, FaCheckCircle } from 'react-icons/fa';

export default function PanduanKepsekModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-black p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              <FaBookOpen />
            </div>
            <div>
              <h2 className="text-xl font-bold">Buku Panduan Executive Dashboard</h2>
              <p className="text-slate-300 text-xs">Petunjuk penggunaan dasbor pimpinan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50">
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 text-xl">
                <FaChartPie />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Pantau KBM Real-time</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Executive Dashboard memungkinkan Anda memantau seluruh aktivitas Kegiatan Belajar Mengajar (KBM) secara langsung. Angka indikator di atas tabel menunjukkan statistik total jadwal, kelas yang terbuka, siswa hadir, dan jumlah tugas harian.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 text-xl">
                <FaSearch />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Filter Laporan Pintar</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Gunakan menu saringan (filter) di bagian atas tabel untuk menyempitkan laporan:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center"><FaCheckCircle className="text-emerald-500 mr-2" /> <strong>Hari:</strong> Pilih Senin s/d Minggu untuk melihat jadwal spesifik hari tersebut.</li>
                  <li className="flex items-center"><FaCheckCircle className="text-emerald-500 mr-2" /> <strong>Tanggal:</strong> Pilih dari kalender untuk melihat hari tertentu.</li>
                  <li className="flex items-center"><FaCheckCircle className="text-emerald-500 mr-2" /> <strong>Pencarian:</strong> Ketik nama Guru, Kelas, atau Mata Pelajaran.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 text-xl">
                <FaImage />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Pratinjau Bukti Fisik Jurnal</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Guru yang mengunggah foto jurnal kelas akan tampil di kolom <strong>"Bukti"</strong>. Anda dapat mengklik gambar tersebut untuk memperbesar dan melihatnya dalam layar penuh. Gambar akan mempertahankan orientasi aslinya (potret/mendatar).
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 text-xl">
                <FaFilePdf />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Cetak Laporan Word</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tekan tombol <strong>"Cetak Laporan (Word)"</strong> di sudut kanan atas untuk mengunduh laporan ini. Laporan yang dicetak akan mengikuti filter yang sedang aktif, dan secara otomatis menyembunyikan tombol-tombol agar siap diberikan ke pengawas sekolah atau disimpannya sebagai arsip.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-100 p-4 text-center shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors">
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
