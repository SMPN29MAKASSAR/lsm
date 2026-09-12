import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

export default function ToastContainer({ toasts }: { toasts: any[] }) {
  return (
    <div id="toast-container" className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`${t.tipe === 'success' ? 'bg-emerald-700' : (t.tipe === 'error' ? 'bg-red-600' : 'bg-slate-800')} text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 backdrop-blur-sm fade-in`}>
          {t.tipe === 'success' ? <FaCheckCircle className="text-lg" /> : <FaInfoCircle className="text-lg" />}
          <span className="text-sm font-bold">{t.pesan}</span>
        </div>
      ))}
    </div>
  );
}
