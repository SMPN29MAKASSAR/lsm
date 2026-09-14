'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { markAttendance, createSubmission, updateSchedule, saveJournal } from '@/app/actions';
import { FaArrowLeft, FaUsers, FaCalendarCheck, FaVideo, FaShieldAlt, FaDoorClosed, FaLock, FaTasks, FaClock, FaCloudDownloadAlt, FaFileAlt, FaCloudUploadAlt, FaLink, FaBroadcastTower, FaCheck, FaFolderOpen, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';

export default function ActiveSession({ schedules, users, attendances, submissions, journals, addToast, refreshData }: any) {
  const { currentUser, activeScheduleId, setView, systemTime } = useAppStore();
  const schedule = schedules.find((s:any) => s.id === activeScheduleId);
  
  const [showModal, setShowModal] = useState(false);
  const [taskText, setTaskText] = useState(schedule?.taskInstruction || '');
  const [jurnal, setJurnal] = useState(journals.find((j:any) => j.id === activeScheduleId)?.text || '');
  
  const [studentText, setStudentText] = useState('');
  
  // ImgBB Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [guruFile, setGuruFile] = useState<File | null>(null);
  const [siswaFile, setSiswaFile] = useState<File | null>(null);

  const [jurnalPhotos, setJurnalPhotos] = useState<File[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
  const [isUploadingJurnal, setIsUploadingJurnal] = useState(false);
  const existingJurnal = journals.find((j:any) => j.id === activeScheduleId);
  if (!currentUser) return null;
  if (schedules.length === 0) return <div className="p-12 text-center text-slate-500 flex flex-col items-center"><FaSpinner className="animate-spin text-4xl mb-4 text-indigo-500" /><p>Memuat sesi...</p></div>;
  if (!schedule) return <div className="p-12 text-center text-red-500 font-bold">Sesi invalid atau telah dihapus!</div>;


  const [h, m] = systemTime.split(':').map(Number);
  const currentMins = h * 60 + m;

  let viconStatus = 'open'; // 'open', 'early', 'closed'
  if (schedule.startTime && schedule.endTime) {
    const [sh, sm] = schedule.startTime.split(':').map(Number);
    const [eh, em] = schedule.endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    if (currentMins < startMins) {
      viconStatus = 'early';
    } else if (currentMins > endMins) {
      viconStatus = 'closed';
    }
  }

  const isTaskClosed = currentMins >= (18 * 60);

  const isGuru = currentUser.role === 'guru';
  const isSiswa = currentUser.role === 'siswa';

  const siswaKelas = users.filter((u:any) => u.role === 'siswa' && u.kelas && schedule.kelas.includes(u.kelas));
  const totalSiswaKelas = siswaKelas.length;
  const hadirinCount = attendances.filter((a:any) => a.scheduleId === schedule.id).length;
  const submitCount = submissions.filter((s:any) => s.scheduleId === schedule.id).length;
  const myAttendance = attendances.find((a:any) => a.scheduleId === schedule.id && a.userId === currentUser.id);
  const mySubmission = submissions.find((s:any) => s.scheduleId === schedule.id && s.userId === currentUser.id);

  // --- IMGBB UPLOAD LOGIC ---
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // Ukuran wajar untuk tugas
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Gagal mengompres gambar"));
            }
          }, 'image/jpeg', 0.6); // Kompresi ekstrim (Kualitas 60%)
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadToImgBB = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("API Key ImgBB belum diatur di .env (NEXT_PUBLIC_IMGBB_API_KEY)");
    
    // Kompres gambar otomatis sebelum dikirim
    const compressedFile = await compressImage(file);
    
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if(data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Gagal upload gambar ke ImgBB");
    }
  };

  // GURU ACTIONS
    
    const handleBroadcastTask = async () => {
    try {
      setIsUploading(true);
      let fileUrl = schedule.lkpdFileUrl;
      let fileName = schedule.lkpdFileName;
      
      if (guruFile) {
        fileUrl = await uploadToImgBB(guruFile);
        fileName = guruFile.name;
      }
      
      const res = await updateSchedule(schedule.id, { 
        taskInstruction: taskText,
        lkpdFileUrl: fileUrl,
        lkpdFileName: fileName
      });
      
      if(res.success) { 
        addToast("Tugas & LKPD dibroadcast ke semua siswa!", "success"); 
        setGuruFile(null);
        refreshData(); 
      }
    } catch (e: any) {
      addToast(e.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetJurnal = async () => {
    try {
      setIsUploadingJurnal(true);
      let newPhotos = (existingJurnal?.photoUrls || []).filter((url: string) => !deletedPhotos.includes(url));
      
      if (jurnalPhotos.length > 0) {
        addToast(`Mengupload ${jurnalPhotos.length} foto dokumentasi...`, "info");
        const uploadPromises = jurnalPhotos.map(file => uploadToImgBB(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        newPhotos = [...newPhotos, ...uploadedUrls];
      }

      const res = await saveJournal(schedule.id, jurnal, newPhotos);
      if(res.success) { 
        addToast("Jurnal disinkronisasi.", "success"); 
        refreshData(); 
        setJurnalPhotos([]); 
          setDeletedPhotos([]); 
      }
    } catch (error: any) {
      addToast(error.message, "error");
    } finally {
      setIsUploadingJurnal(false);
    }
  };

  // SISWA ACTIONS
  const handleAbsenMasuk = async () => {
    const res = await markAttendance(schedule.id, currentUser.id, systemTime + ' WITA', 'System Click Trigger');
    if(res.success) {
      addToast("Hadir tercatat di Server!", "success");
      refreshData();
      let linkToOpen = schedule.viconLink;
      if (linkToOpen && !linkToOpen.startsWith('http://') && !linkToOpen.startsWith('https://')) {
        linkToOpen = 'https://' + linkToOpen;
      }
      setTimeout(() => window.open(linkToOpen, '_blank', 'noopener,noreferrer'), 800);
    }
  };

  const handleKumpul = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let fileUrl = '';
      let fileName = '';
      
      if (siswaFile) {
        fileUrl = await uploadToImgBB(siswaFile);
        fileName = siswaFile.name;
      }
      
      const res = await createSubmission(schedule.id, currentUser.id, studentText, fileName, fileUrl);
      if(res.success) { 
        addToast("Tugas terkirim ke Guru.", "success"); 
        refreshData(); 
      }
    } catch (e: any) {
      addToast(e.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => setView('dashboard')} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-bold text-sm shadow-sm flex items-center">
          <FaArrowLeft className="mr-2" /> Kembali
        </button>
      </div>
      
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center ${isGuru ? 'bg-gradient-to-r from-emerald-50 to-white border-l-8 border-l-emerald-500' : 'bg-gradient-to-r from-indigo-50 to-white border-l-8 border-l-indigo-500'}`}>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{schedule.mapel}</h2>
          <p className="text-slate-600 text-sm font-medium mt-1.5 flex items-center"><FaUsers className="mr-2 text-slate-400" /> Kelas {schedule.kelas} <span className="mx-2 text-slate-300">|</span> <FaCalendarCheck className="mr-2 text-slate-400" /> {schedule.date}</p>
        </div>
      </div>

      {isSiswa && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ruang Virtual Sama */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative h-fit">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${myAttendance ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center"><FaVideo className="text-indigo-500 mr-2" /> 1. Pintu Ruang Virtual</h3>
              {myAttendance ? <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold border border-emerald-200">Hadir Otomatis</span> : <span className="bg-slate-200 text-slate-600 text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold">Belum Absen</span>}
            </div>
            <div className="p-6">
                {viconStatus === 'early' ? (
                  <div className="text-center bg-amber-50 border border-amber-200 border-dashed rounded-xl py-8"><FaClock className="text-4xl mx-auto mb-3 text-amber-300" /><p className="text-sm font-bold text-amber-600">Sesi Virtual belum dimulai.</p></div>
                ) : viconStatus === 'closed' ? (
                  <div className="text-center bg-red-50 border border-red-200 border-dashed rounded-xl py-8"><FaClock className="text-4xl mx-auto mb-3 text-red-300" /><p className="text-sm font-bold text-red-500">Sesi Virtual telah berakhir.</p></div>
                ) : !schedule.viconLink ? (
                <div className="text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl py-8"><FaDoorClosed className="text-4xl mx-auto mb-3 text-slate-300" /><p className="text-sm font-bold text-slate-500">Guru belum mensetting Link Kelas.</p></div>
              ) : (
                <button onClick={handleAbsenMasuk} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center transition-colors ${myAttendance ? 'bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-500 shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  <FaVideo className="mr-2 text-xl" /> {myAttendance ? 'Masuk Kembali ke Ruang Virtual' : 'Klik Hadir & Masuk Kelas Virtual'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${mySubmission ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center"><FaTasks className="text-amber-500 mr-2" /> 2. Bukti & Evaluasi</h3>
            </div>
            <div className="p-6">
              {!schedule.taskInstruction && !schedule.lkpdFileName ? (
                <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl"><FaClock className="text-3xl mx-auto mb-2 text-slate-300" /><p className="text-sm font-bold text-slate-400">Guru belum memberikan instruksi / soal.</p></div>
              ) : (
                mySubmission ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm border-4 border-white"><FaCloudDownloadAlt /></div>
                    <h4 className="font-extrabold text-emerald-800 text-lg">Tugas Tersinkronisasi</h4>
                    <div className="mt-4 text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Jawaban Anda:</p>
                      <p className="text-sm font-medium text-slate-700 p-3 bg-white rounded border border-slate-100">"{mySubmission.text}"</p>
                      {mySubmission.fileUrl && (
                        <div className="mt-3">
                          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Anda</p>
                          <img 
                            src={`/api/proxy?url=${encodeURIComponent(mySubmission.fileUrl)}`} 
                            alt={mySubmission.fileName || 'Lampiran'} 
                            className="w-full max-w-sm rounded-xl border border-slate-200 shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-6">
                      <p className="text-[10px] text-amber-600 font-bold mb-2 uppercase tracking-wider">Instruksi Guru</p>
                      <p className="text-sm font-medium text-amber-900 whitespace-pre-line mb-3">{schedule.taskInstruction || 'Silakan kerjakan.'}</p>
                      {schedule.lkpdFileUrl && (
                        <div className="mt-3">
                          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar dari Guru</p>
                          <img 
                            src={`/api/proxy?url=${encodeURIComponent(schedule.lkpdFileUrl)}`} 
                            alt={schedule.lkpdFileName || 'Lampiran'} 
                            className="w-full rounded-xl border border-slate-200 shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                      {isTaskClosed ? (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center text-sm font-bold text-red-600">
                          Waktu pengumpulan tugas telah ditutup (Melewati pukul 18:00 WITA).
                        </div>
                      ) : (
                      <form onSubmit={handleKumpul} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Refleksi / Jawaban</label>
                        <textarea value={studentText} onChange={e=>setStudentText(e.target.value)} required rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-500"></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Lampiran Gambar Bukti (Opsional)</label>
                        <input type="file" accept="image/*" onChange={e => setSiswaFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        <p className="text-[10px] text-slate-400 mt-1">Gambar akan diupload ke ImgBB.</p>
                      </div>
                      <button type="submit" disabled={isUploading} className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center">
                        {isUploading ? <><FaSpinner className="mr-2 animate-spin" /> Mengunggah...</> : <><FaCloudUploadAlt className="mr-2" /> Kirim ke Guru</>}
                      </button>
                    </form>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {isGuru && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Ruang Virtual Guru Sama */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
              <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center"><FaLink className="text-blue-500 mr-2" /> Pintu Ruang Kelas</h3>
                {viconStatus === 'early' ? (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center text-sm font-bold text-amber-600 mb-4">
                    Jadwal kelas belum dimulai.
                  </div>
                ) : viconStatus === 'closed' ? (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center text-sm font-bold text-red-600 mb-4">
                    Jadwal kelas telah berakhir.
                  </div>
                ) : (
                <>
              <div className="flex space-x-2 mb-2">
                <input type="url" value={schedule.viconLink || ''} readOnly className="flex-1 p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 cursor-not-allowed" placeholder="Belum ada link yang disetel Admin" />
                {schedule.viconLink && (
                  <a href={schedule.viconLink.startsWith('http') ? schedule.viconLink : `https://${schedule.viconLink}`} target="_blank" rel="noopener noreferrer" className="px-5 rounded-xl font-bold shadow-md text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    GABUNG
                  </a>
                )}
              </div>
              {schedule.viconLink && (
                <p className="text-[10px] text-emerald-600 font-bold flex items-center"><FaCheck className="mr-1" /> Link telah disiapkan oleh Admin.</p>
                )}
                </>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
              <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center"><FaBroadcastTower className="text-amber-500 mr-2" /> Distribusi LKPD & Tugas</h3>
              <textarea value={taskText} onChange={e=>setTaskText(e.target.value)} rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-3 outline-none focus:border-amber-500" placeholder="Ketik instruksi tugas..."></textarea>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Upload File LKPD (Gambar/Foto)</label>
                <input type="file" accept="image/*" onChange={e => setGuruFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                {schedule.lkpdFileUrl && !guruFile && <p className="text-[10px] text-emerald-600 mt-2 font-bold flex items-center"><FaCheck className="mr-1"/> LKPD Aktif: {schedule.lkpdFileName}</p>}
              </div>
              <button onClick={handleBroadcastTask} disabled={isUploading} className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-md text-sm flex items-center justify-center">
                {isUploading ? <><FaSpinner className="mr-2 animate-spin" /> Mengunggah ke ImgBB...</> : 'Broadcast Tugas & LKPD'}
              </button>
            </div>
            
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-800"></div>
                <h3 className="font-bold text-slate-800 mb-4 text-lg">Jurnal & Dokumentasi PBM</h3>
                <textarea value={jurnal} onChange={e=>setJurnal(e.target.value)} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-3" placeholder="Isi materi pokok hari ini..."></textarea>
                
                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Upload Dokumentasi PBM (Bisa lebih dari 1 foto)</p>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files) setJurnalPhotos(Array.from(e.target.files));
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {jurnalPhotos.length > 0 && <p className="text-xs text-emerald-600 font-bold mt-2">{jurnalPhotos.length} foto siap diupload</p>}
                </div>

                {(() => {
                    const displayPhotos = (existingJurnal?.photoUrls || []).filter((url: string) => !deletedPhotos.includes(url));
                    if (displayPhotos.length === 0) return null;
                    return (
                      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {displayPhotos.map((url: string, idx: number) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video group">
                            <img src={`/api/proxy?url=${encodeURIComponent(url)}`} className="object-cover w-full h-full" alt={`Dokumentasi ${idx+1}`} loading="lazy" />
                            <button 
                               onClick={(e) => { e.preventDefault(); setDeletedPhotos(prev => [...prev, url]); }} 
                               className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity shadow-md"
                               title="Hapus foto ini (Jangan lupa klik Simpan setelahnya)"
                            >
                               <FaTimes size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                <button onClick={handleSetJurnal} disabled={isUploadingJurnal} className={`px-5 py-2.5 rounded-xl font-bold w-full text-sm transition-colors ${isUploadingJurnal ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md'}`}>
                  {isUploadingJurnal ? <><FaSpinner className="animate-spin inline mr-2" /> Menyimpan Jurnal & Foto...</> : 'Simpan Jurnal & Dokumentasi'}
                </button>
              </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 text-white relative">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
                <h3 className="font-bold text-lg">Live Telemetri Kelas</h3>
                <button onClick={refreshData} className="flex items-center text-[10px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 uppercase font-bold transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></div> Segarkan
                </button>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-1"><p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Hadir Otomatis</p><p className="text-2xl font-extrabold text-emerald-400">{hadirinCount} <span className="text-sm text-slate-400">/ {totalSiswaKelas}</span></p></div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-400 h-full transition-all duration-500" style={{width: totalSiswaKelas > 0 ? (hadirinCount/totalSiswaKelas)*100 + '%' : '0%'}}></div></div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-1"><p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Tugas Terkumpul</p><p className="text-2xl font-extrabold text-amber-400">{submitCount} <span className="text-sm text-slate-400">/ {totalSiswaKelas}</span></p></div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-400 h-full transition-all duration-500" style={{width: totalSiswaKelas > 0 ? (submitCount/totalSiswaKelas)*100 + '%' : '0%'}}></div></div>
              </div>

              <button onClick={() => setShowModal(true)} className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold shadow-lg flex justify-center items-center">
                <FaFolderOpen className="mr-2 text-indigo-500" /> Buka Rekap Absensi & Tugas Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rekap Guru */}
      {showModal && isGuru && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center pl-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
              <div><h3 className="font-extrabold text-slate-800 text-lg">Rekap Absensi & Tugas Siswa</h3><p className="text-xs text-slate-500 font-medium">Kelas {schedule.kelas}</p></div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><FaTimes className="text-xl" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50 space-y-4">
              {siswaKelas.map((siswa:any) => {
                const tugas = submissions.find((s:any) => s.scheduleId === schedule.id && s.userId === siswa.id);
                const absen = attendances.find((a:any) => a.scheduleId === schedule.id && a.userId === siswa.id);
                
                return (
                  <div key={siswa.id} className={`border ${tugas ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'} rounded-xl p-4 flex flex-col md:flex-row gap-5 items-start shadow-sm`}>
                    <div className="w-full md:w-56 shrink-0">
                      <p className="font-extrabold text-slate-800 text-base">{siswa.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {absen ? <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase border border-emerald-200">Hadir Otomatis</span> : <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase border border-red-200">Alpha</span>}
                      </div>
                    </div>
                    <div className="flex-grow w-full flex flex-col gap-3">
                      {absen && <p className="text-xs text-emerald-600 font-medium flex items-center"><FaClock className="mr-1" /> Tercatat hadir pukul: {absen.time}</p>}
                      {tugas ? (
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-inner">
                          <p className="text-sm font-medium text-slate-700 italic">"{tugas.text}"</p>
                            {tugas.fileUrl && (
                              <div className="mt-3">
                                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Siswa</p>
                                <img 
                                  src={`/api/proxy?url=${encodeURIComponent(tugas.fileUrl)}`} 
                                  alt="Lampiran Siswa" 
                                  className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm"
                                  loading="lazy"
                                />
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 border-dashed py-3"><span className="text-xs font-bold text-slate-400">Belum ada tugas disubmit</span></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
