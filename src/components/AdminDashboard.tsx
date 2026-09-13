'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { createUser, createUsers, deleteUser, deleteUsers, createSchedules, createSchedule, deleteSchedule } from '@/app/actions';
import { FaDatabase, FaFileExcel, FaUserPlus, FaDownload, FaUpload, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function AdminDashboard({ users, schedules, addToast, refreshData }: { users: any[], schedules?: any[], addToast: any, refreshData: any }) {
  const { currentUser } = useAppStore();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('siswa');
  const [spesifik, setSpesifik] = useState('');
  const [activeTab, setActiveTab] = useState<'akun' | 'jadwal'>('akun');
  const [guruKelas, setGuruKelas] = useState<string[]>([]);
  
  // State untuk buat jadwal manual
  const [jadwalTeacherId, setJadwalTeacherId] = useState('');
  const [jadwalDate, setJadwalDate] = useState('');
  const [jadwalKelas, setJadwalKelas] = useState<string[]>([]);
  const [jadwalLink, setJadwalLink] = useState('');

  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJadwalDate, setFilterJadwalDate] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const uniqueKelas = Array.from(new Set(users.filter(u => u.kelas).map(u => u.kelas))).sort();

  const filteredUsers = users
    .filter(u => {
      if (filterRole && u.role !== filterRole) return false;
      if (filterKelas && u.kelas !== filterKelas) return false;
      if (filterText) {
        const search = filterText.toLowerCase();
        return u.name.toLowerCase().includes(search) || u.id.toLowerCase().includes(search);
      }
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const [isEditing, setIsEditing] = useState(false);

  const handleManualJadwalAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jadwalTeacherId || !jadwalDate || jadwalKelas.length === 0) {
      addToast('Pastikan Guru, Tanggal, dan Minimal 1 Kelas telah dipilih.', 'error');
      return;
    }
    const teacher = users.find(u => u.id === jadwalTeacherId);
    if (!teacher) return;
    
    let formattedLink = jadwalLink.trim();
    if (formattedLink && !formattedLink.startsWith('http')) {
      formattedLink = 'https://' + formattedLink;
    }

    const data = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      mapel: teacher.mapel || '',
      kelas: jadwalKelas.join(', '),
      date: jadwalDate,
      viconLink: formattedLink || null
    };

    const res = await createSchedule(data);
    if (res.success) {
      addToast(`Jadwal untuk ${teacher.name} berhasil dibuat!`, 'success');
      setJadwalTeacherId(''); setJadwalDate(''); setJadwalKelas([]); setJadwalLink('');
      refreshData();
    } else {
      addToast('Gagal membuat jadwal.', 'error');
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: id.trim(),
      name: name.trim(),
      role,
      kelas: role === 'siswa' ? spesifik.trim() : (role === 'guru' ? guruKelas.join(', ') : ''),
      mapel: role === 'guru' ? spesifik.trim() : '',
    };
    const res = await createUser(data);
    if (res.success) {
      addToast(`Pengguna ${data.name} ${isEditing ? 'diperbarui' : 'ditambahkan'}!`, 'success');
      setId(''); setName(''); setSpesifik(''); setGuruKelas([]); setIsEditing(false);
      refreshData();
    } else {
      addToast('Gagal menyimpan pengguna.', 'error');
    }
  };

  const handleEdit = (u: any) => {
    setId(u.id);
    setName(u.name);
    setRole(u.role);
    if (u.role === 'siswa') setSpesifik(u.kelas || '');
    else if (u.role === 'guru') {
      setSpesifik(u.mapel || '');
      setGuruKelas(u.kelas ? u.kelas.split(', ') : []);
    }
    else setSpesifik('');
    setIsEditing(true);
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArray = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        if(jsonArray.length === 0) throw new Error("File Kosong");
        
        const usersToCreate = [];
        for(let row of jsonArray) {
          const id = row['ID (NISN/NIP)'] || row['ID_PENGGUNA'] || row['ID (NISN/NIP)\r'] || row['NISN / NIP'];
          const name = row['Nama Lengkap'] || row['NAMA_LENGKAP'] || row['Nama Lengkap\r'];
          const role = row['Peran'] || row['PERAN'] || 'siswa';
          const kelas = row['Kelas'] || row['KELAS'] || '';
          const mapel = row['Mata Pelajaran'] || row['MATA_PELAJARAN'] || '';
          
          if(id && name) {
            usersToCreate.push({
              id: String(id).trim(),
              name: String(name).trim(),
              role: String(role).toLowerCase().trim(),
              kelas: String(kelas).trim(),
              mapel: String(mapel).trim()
            });
          }
        }
        
        if (usersToCreate.length === 0) {
          throw new Error("Tidak ada data valid dengan ID dan Nama.");
        }
        
        const res = await createUsers(usersToCreate);
        if (res.success) {
          addToast(`${usersToCreate.length} data pengguna berhasil tersimpan ke Database Cloud!`, "success");
          refreshData();
        } else {
          throw new Error(res.error || "Gagal menyimpan ke database");
        }
      } catch (e: any) {
        addToast("Gagal memproses Excel: " + e.message, "error");
      }
      // reset input
      e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadScheduleTemplate = () => {
    const data = [
      ["ID Guru (NIP)", "Tanggal (YYYY-MM-DD)", "Kelas Tujuan (Pisahkan Koma)", "Mata Pelajaran", "Link Vicon"],
      ["NIP001", "2026-09-14", "KELAS 7.1, KELAS 7.2", "Matematika", "https://meet.google.com/abc-defg-hij"],
      ["NIP002", "2026-09-15", "KELAS 8.1", "Fisika", "https://zoom.us/j/123456789"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch: 15}, {wch: 25}, {wch: 30}, {wch: 20}, {wch: 40}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format_Jadwal");
    XLSX.writeFile(wb, "Template_Jadwal_Massal.xlsx");
    addToast("Template Jadwal diunduh.", "info");
  };

  const importScheduleExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
      try {
        addToast("Memproses Jadwal Massal...", "info");
        const data = evt.target?.result;
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArray = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        if(jsonArray.length === 0) throw new Error("File Kosong");
        
        const schedulesToCreate = [];
        for(let row of jsonArray) {
          const teacherId = String(row['ID Guru (NIP)'] || row['ID_GURU'] || '').trim();
          const date = String(row['Tanggal (YYYY-MM-DD)'] || row['TANGGAL'] || '').trim();
          const kelas = String(row['Kelas Tujuan (Pisahkan Koma)'] || row['KELAS'] || '').trim();
          const mapel = String(row['Mata Pelajaran'] || row['MAPEL'] || '').trim();
          const viconLink = String(row['Link Vicon'] || row['LINK'] || '').trim();
          
          if(teacherId && date && kelas) {
            // we need teacherName, let's find it from existing users
            const teacher = users.find(u => u.id === teacherId);
            const teacherName = teacher ? teacher.name : teacherId;
            let formattedLink = viconLink;
            if (formattedLink && !formattedLink.startsWith('http')) {
              formattedLink = 'https://' + formattedLink;
            }

            schedulesToCreate.push({
              teacherId,
              teacherName,
              date,
              kelas,
              mapel: mapel || (teacher ? teacher.mapel : ''),
              viconLink: formattedLink || null
            });
          }
        }
        
        if (schedulesToCreate.length === 0) {
          throw new Error("Tidak ada data jadwal valid.");
        }
        
        const res = await createSchedules(schedulesToCreate);
        if (res.success) {
          addToast(`${schedulesToCreate.length} jadwal massal berhasil tersimpan!`, "success");
          refreshData(); // ini akan memanggil getSchedules lagi
        } else {
          throw new Error(res.error || "Gagal menyimpan jadwal");
        }
      } catch (e: any) {
        addToast("Gagal memproses Excel Jadwal: " + e.message, "error");
      }
      e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if(confirm(`Anda akan menghapus data ${userName} dari server. Aksi ini permanen. Yakin?`)) {
      const res = await deleteUser(userId);
      if(res.success) {
        addToast("Pengguna dihapus.", "info");
        setSelectedIds(prev => prev.filter(id => id !== userId));
        refreshData();
      } else {
        addToast("Gagal hapus.", "error");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if(confirm(`Anda akan menghapus ${selectedIds.length} data pengguna terpilih dari server. Aksi ini permanen. Yakin?`)) {
      const res = await deleteUsers(selectedIds);
      if(res.success) {
        addToast(`${selectedIds.length} Pengguna berhasil dihapus.`, "info");
        setSelectedIds([]);
        refreshData();
      } else {
        addToast("Gagal hapus massal.", "error");
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectableIds = filteredUsers.filter(u => u.id !== currentUser?.id).map(u => u.id);
      setSelectedIds(selectableIds);
    } else {
      setSelectedIds([]);
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
      
      
      <div className="flex bg-white rounded-xl shadow-sm p-1 border border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('akun')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'akun' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Manajemen Akun
        </button>
        <button 
          onClick={() => setActiveTab('jadwal')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'jadwal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Manajemen Jadwal Khusus
        </button>
      </div>
      {activeTab === 'akun' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaFileExcel className="text-emerald-600 mr-2 text-xl" /> Import / Export User</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Unduh format Excel yang disediakan, isi data siswa/guru, lalu import kembali untuk memasukkan ratusan data sekaligus.</p>
          </div>
          <div className="space-y-4">
            <button onClick={downloadTemplate} className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3.5 px-4 rounded-xl border border-emerald-200 transition-all flex items-center justify-center">
              <FaDownload className="mr-2" /> 1. Unduh Template
            </button>
            <div className="relative">
              <input type="file" id="excel-import-file" accept=".xlsx, .xls" className="hidden" onChange={importExcel} />
              <button onClick={() => document.getElementById('excel-import-file')?.click()} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
                <FaUpload className="mr-2" /> 2. Import Data User
              </button>
            </div>
          </div>
        </div>
        
        
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden lg:col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
          <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaUserPlus className="text-indigo-600 mr-2 text-xl" /> Input Data Manual</h3>
          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NIS / ID Guru</label>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mata Pelajaran (Mapel)</label>
                      <input type="text" value={spesifik} onChange={e=>setSpesifik(e.target.value)} required placeholder="Contoh: Fisika" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Kelas Yang Diajar</label>
                      <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto flex flex-col gap-1">
                        {uniqueKelas.length === 0 && <span className="text-xs text-slate-400">Belum ada kelas</span>}
                        {uniqueKelas.map(c => (
                          <label key={c} className="flex items-center space-x-2 p-1 hover:bg-slate-100 rounded cursor-pointer">
                            <input type="checkbox" checked={guruKelas.includes(c)} onChange={(e) => {
                              if (e.target.checked) setGuruKelas([...guruKelas, c]);
                              else setGuruKelas(guruKelas.filter(k => k !== c));
                            }} className="accent-indigo-600 rounded cursor-pointer" />
                            <span className="text-xs font-medium text-slate-700">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2">{isEditing ? 'Perbarui Data' : 'Simpan ke Database'}</button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setId(''); setName(''); setSpesifik(''); setGuruKelas([]); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all mt-2">Batal Edit</button>
            )}
          </form>
        </div>
        
        
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-slate-800 text-lg">Direktori Pengguna Aktif</h3>
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-sm transition-colors">
                <FaTrash className="mr-1.5" /> Hapus {selectedIds.length} Data
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input type="text" placeholder="Cari Nama / NIS..." value={filterText} onChange={e => setFilterText(e.target.value)} className="p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500" />
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white">
              <option value="">Semua Peran</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="kepsek">Kepala Sekolah</option>
              <option value="admin">Admin</option>
            </select>
            <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white">
              <option value="">Semua Kelas</option>
              {uniqueKelas.map(k => (
                <option key={String(k)} value={String(k)}>{String(k)}</option>
              ))}
            </select>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap flex items-center justify-center">Total: {filteredUsers.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto p-1 max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b-2 border-slate-200">
                <th className="p-3 font-extrabold text-center w-10">
                  <input type="checkbox" 
                    checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.filter(u => u.id !== currentUser?.id).length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-indigo-600 rounded"
                  />
                </th>
                <th className="p-3 font-extrabold text-center w-12">No</th>
                <th className="p-3 font-extrabold">NIS / NIP</th>
                <th className="p-3 font-extrabold">Nama Lengkap</th>
                <th className="p-3 font-extrabold">Peran</th>
                <th className="p-3 font-extrabold">Kelas / Mapel</th>
                <th className="p-3 font-extrabold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-slate-400">Database kosong atau tidak ditemukan.</td></tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm text-slate-700 ${selectedIds.includes(u.id) ? 'bg-indigo-50/50' : ''}`}>
                    <td className="p-3 text-center">
                      {u.id !== currentUser?.id ? (
                        <input type="checkbox" 
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelection(u.id)}
                          className="w-4 h-4 cursor-pointer accent-indigo-600 rounded"
                        />
                      ) : (
                        <div className="w-4 h-4 mx-auto rounded border border-slate-200 bg-slate-100 opacity-50"></div>
                      )}
                    </td>
                    <td className="p-3 text-center text-slate-400 font-bold">{index + 1}</td>
                    <td className="p-3 font-bold">{u.id}</td>
                    <td className="p-3 font-medium text-slate-900">{u.name}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role==='guru'?'bg-indigo-100 text-indigo-700':u.role==='siswa'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{u.role}</span></td>
                    <td className="p-3">
                      {u.role === 'siswa' ? u.kelas : (u.role === 'guru' ? (
                        <div>
                          <span className="font-bold">{u.mapel}</span>
                          {u.kelas && <div className="text-[10px] text-slate-500 mt-1">{u.kelas}</div>}
                        </div>
                      ) : u.mapel)}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(u)} className="text-indigo-500 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Pengguna">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        {u.id !== currentUser?.id ? (
                          <button onClick={() => handleDelete(u.id, u.name)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pengguna">
                            <FaTrash />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded flex items-center">Anda</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {activeTab === 'jadwal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaFileExcel className="text-amber-500 mr-2 text-xl" /> Import Jadwal Massal</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Atur Jadwal dan tautkan link Zoom/Meet secara massal menggunakan Excel. Praktis untuk admin.</p>
          </div>
          <div className="space-y-4">
            <button onClick={downloadScheduleTemplate} className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold py-3.5 px-4 rounded-xl border border-amber-200 transition-all flex items-center justify-center">
              <FaDownload className="mr-2" /> 1. Unduh Template Jadwal
            </button>
            <div className="relative">
              <input type="file" id="excel-schedule-file" accept=".xlsx, .xls" className="hidden" onChange={importScheduleExcel} />
              <button onClick={() => document.getElementById('excel-schedule-file')?.click()} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
                <FaUpload className="mr-2" /> 2. Import Jadwal & Link
              </button>
            </div>
          </div>
        </div>

        
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden lg:col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
          <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg"><FaUserPlus className="text-blue-600 mr-2 text-xl" /> Buat Jadwal Manual</h3>
          <form onSubmit={handleManualJadwalAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Pilih Guru</label>
                <select value={jadwalTeacherId} onChange={e=>setJadwalTeacherId(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500">
                  <option value="" disabled>Pilih Guru</option>
                  {users.filter(u => u.role === 'guru').map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.mapel})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tanggal (YYYY-MM-DD)</label>
                <input type="date" value={jadwalDate} onChange={e=>setJadwalDate(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Link Vicon (Zoom/Meet) Opsional</label>
                <input type="text" value={jadwalLink} onChange={e=>setJadwalLink(e.target.value)} placeholder="Contoh: meet.google.com/abc-defg-hij" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Kelas Tujuan (Bisa Pilih &gt; 1)</label>
                <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-24 overflow-y-auto flex flex-col gap-1">
                  {uniqueKelas.length === 0 && <span className="text-xs text-slate-400">Belum ada kelas</span>}
                  {uniqueKelas.map(c => (
                    <label key={c} className="flex items-center space-x-2 p-1 hover:bg-slate-100 rounded cursor-pointer">
                      <input type="checkbox" checked={jadwalKelas.includes(c)} onChange={(e) => {
                        if (e.target.checked) setJadwalKelas([...jadwalKelas, c]);
                        else setJadwalKelas(jadwalKelas.filter(k => k !== c));
                      }} className="accent-blue-600 rounded cursor-pointer" />
                      <span className="text-xs font-medium text-slate-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2">Buat Jadwal ke Sistem</button>
          </form>
        </div>
      
        </div>
      )}
    </div>
  );
}
