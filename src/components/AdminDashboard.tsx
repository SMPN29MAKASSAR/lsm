'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { createUser, deleteUser } from '@/app/actions';
import { FaDatabase, FaFileExcel, FaUserPlus, FaDownload, FaUpload, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function AdminDashboard({ users, addToast, refreshData }: { users: any[], addToast: any, refreshData: any }) {
  const { currentUser } = useAppStore();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('siswa');
  const [spesifik, setSpesifik] = useState('');

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: id.trim(),
      name: name.trim(),
      role,
      kelas: role === 'siswa' ? spesifik.trim() : '',
      mapel: role === 'guru' ? spesifik.trim() : '',
    };
    const res = await createUser(data);
    if (res.success) {
      addToast(`Pengguna ${data.name} ditambahkan!`, 'success');
      setId(''); setName(''); setSpesifik('');
      refreshData();
    } else {
      addToast('Gagal menambah pengguna.', 'error');
    }
  };

  const downloadTemplate = () => {
    const data = [
      ["ID (NISN/NIP)", "Nama Lengkap", "Peran", "Kelas", "Mata Pelajaran"],
      ["123456", "Budi Santoso", "siswa", "X MIPA 1", ""],
      ["223344", "Aisyah Putri", "siswa", "X IPS 1", ""],
      ["NIP001", "Drs. Akhmad", "guru", "", "Matematika"],
      ["NIP002", "Siti Aminah, S.Pd", "guru", "", "Fisika"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch: 15}, {wch: 25}, {wch: 10}, {wch: 15}, {wch: 20}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format_Data_SKPD");
    XLSX.writeFile(wb, "Template_Data_Pengguna_SKPD.xlsx");
    addToast("Template Excel diunduh.", "info");
  };

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
      try {
        addToast("Memproses Sinkronisasi Excel ke Cloud...", "info");
        const data = evt.target?.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArray = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        if(jsonArray.length === 0) throw new Error("Kosong");
        
        let count = 0;
        for(let row of jsonArray) {
          const id = row['ID (NISN/NIP)'] || row['ID_PENGGUNA'];
          const name = row['Nama Lengkap'] || row['NAMA_LENGKAP'];
          if(id && name) {
            await createUser({
              id: String(id).trim(),
              name: String(name).trim(),
              role: String(row['Peran'] || row['PERAN'] || 'siswa').toLowerCase().trim(),
              kelas: String(row['Kelas'] || row['KELAS'] || '').trim(),
              mapel: String(row['Mata Pelajaran'] || row['MATA_PELAJARAN'] || '').trim()
            });
            count++;
          }
        }
        addToast(`${count} data pengguna berhasil tersimpan ke Database Cloud!`, "success");
        refreshData();
        e.target.value = '';
      } catch(err) {
        addToast("Gagal membaca Excel. Pastikan format sesuai Template.", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if(confirm(`Anda akan menghapus data ${userName} dari server. Aksi ini permanen. Yakin?`)) {
      const res = await deleteUser(userId);
      if(res.success) {
        addToast("Pengguna dihapus.", "info");
        refreshData();
      } else {
        addToast("Gagal hapus.", "error");
      }
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <FaDatabase className="absolute right-0 top-0 text-[120px] opacity-10 -mt-6 -mr-4" />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Data Induk</h2>
          <p className="text-slate-300 mt-1 font-medium text-sm">Pusat Kendali Pengguna (Siswa & Guru) - Tersinkronisasi ke PostgreSQL</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
          <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaFileExcel className="text-emerald-600 mr-2 text-xl" /> Import / Export Massal</h3>
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">Unduh format Excel yang disediakan, isi data siswa/guru, lalu import kembali untuk memasukkan ratusan data sekaligus.</p>
            <button onClick={downloadTemplate} className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3.5 px-4 rounded-xl border border-emerald-200 transition-all flex items-center justify-center">
              <FaDownload className="mr-2" /> 1. Unduh Template Excel
            </button>
            <div className="relative">
              <input type="file" id="excel-import-file" accept=".xlsx, .xls" className="hidden" onChange={importExcel} />
              <button onClick={() => document.getElementById('excel-import-file')?.click()} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
                <FaUpload className="mr-2" /> 2. Import Data Excel
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
          <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaUserPlus className="text-indigo-600 mr-2 text-xl" /> Input Data Manual</h3>
          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NISN / NIP</label>
                <input type="text" value={id} onChange={e=>setId(e.target.value)} required placeholder="Contoh: 123456" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Lengkap</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Nama Pengguna" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Peran</label>
                <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none">
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                  <option value="kepsek">Kepsek</option>
                  <option value="admin">Admin / TU</option>
                </select>
              </div>
              <div className="col-span-2">
                {role === 'siswa' && (
                  <>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Kelas Siswa</label>
                    <input type="text" value={spesifik} onChange={e=>setSpesifik(e.target.value)} required placeholder="Contoh: X MIPA 1" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-500" />
                  </>
                )}
                {role === 'guru' && (
                  <>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mata Pelajaran (Mapel)</label>
                    <input type="text" value={spesifik} onChange={e=>setSpesifik(e.target.value)} required placeholder="Contoh: Fisika" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-500" />
                  </>
                )}
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2">Simpan ke Database</button>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-lg">Direktori Pengguna Aktif</h3>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Total: {users.length}</span>
        </div>
        <div className="overflow-x-auto p-1 max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b-2 border-slate-200">
                <th className="p-3 font-extrabold">ID (NISN/NIP)</th>
                <th className="p-3 font-extrabold">Nama Lengkap</th>
                <th className="p-3 font-extrabold">Peran</th>
                <th className="p-3 font-extrabold">Kelas / Mapel</th>
                <th className="p-3 font-extrabold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-400">Database kosong.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm text-slate-700">
                    <td className="p-3 font-bold">{u.id}</td>
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'guru' ? 'bg-indigo-100 text-indigo-700' : (u.role === 'siswa' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700')}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-500">{u.kelas || u.mapel || '-'}</td>
                    <td className="p-3 text-right">
                      {u.id !== currentUser?.id ? (
                        <button onClick={() => handleDelete(u.id, u.name)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"><FaTrash /></button>
                      ) : (
                        <span className="text-xs text-slate-400">Anda</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
