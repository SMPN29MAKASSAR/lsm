const fs = require("fs");
let code = fs.readFileSync("src/components/GuruDashboard.tsx", "utf8");

const oldCode = `  const handleHapus = async (id: string) => {
    if(confirm('Jadwal yang dihapus tidak dapat dikembalikan. Yakin?')) {
      const res = await deleteSchedule(id);
      if(res.success) {
        addToast('Jadwal dihapus.', 'info');
        refreshData();
      } else {
        addToast('Gagal hapus.', 'error');
      }
    }
  };`;

const newCode = `  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleConfirmHapus = async () => {
    if (!deleteId) return;
    const res = await deleteSchedule(deleteId);
    if(res.success) {
      addToast('Jadwal beserta seluruh data di dalamnya telah dihapus.', 'info');
      refreshData();
    } else {
      addToast('Gagal menghapus jadwal.', 'error');
    }
    setDeleteId(null);
  };
  const handleHapus = (id: string) => {
    setDeleteId(id);
  };`;

code = code.replace(oldCode, newCode);

const oldJSX = `{showPanduan && <PanduanGuruModal onClose={() => setShowPanduan(false)} />}`;
const newJSX = `{showPanduan && <PanduanGuruModal onClose={() => setShowPanduan(false)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-slideUp border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaTrash className="text-2xl" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Hapus Jadwal?</h3>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 text-center font-medium">
                <strong className="block mb-1 text-red-900">Peringatan Keras!</strong>
                Jika jadwal ini dihapus, maka seluruh <strong>Absensi Siswa</strong>, <strong>Jurnal Mengajar</strong>, dan <strong>Tugas Evaluasi</strong> pada sesi ini akan ikut terhapus secara permanen dan tidak dapat dipulihkan.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={handleConfirmHapus} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">Ya, Hapus Sesi</button>
            </div>
          </div>
        </div>
      )}`;

code = code.replace(oldJSX, newJSX);
fs.writeFileSync("src/components/GuruDashboard.tsx", code, "utf8");
console.log("Patched GuruDashboard for delete confirmation modal.");
