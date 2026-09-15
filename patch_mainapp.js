const fs = require("fs");
let code = fs.readFileSync("src/components/MainApp.tsx", "utf8");

code = code.replace(
  "const { currentUser, currentView } = useAppStore();",
  "const { currentUser, currentView, systemTime } = useAppStore();"
);

code = code.replace(
  /<main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-container">/,
  `<main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-container">
        {(() => {
          const [h, m] = systemTime.split(':').map(Number);
          const currentMins = h * 60 + m;
          const isCurfew = currentMins >= (19 * 60) || currentMins < (7 * 60 + 30);
          
          if (isCurfew && currentUser?.role !== 'admin' && currentUser?.role !== 'kepsek') {
            return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 fade-in">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-amber-400 text-5xl mb-6 shadow-xl border-4 border-slate-700">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">SISTEM SEDANG ISTIRAHAT</h2>
                <p className="text-slate-600 text-lg max-w-md mx-auto mb-8 font-medium">Jam Malam diaktifkan. Akses untuk Guru dan Siswa ditutup mulai pukul 19:00 hingga 07:30 WITA demi menghemat biaya server.</p>
                <button onClick={() => useAppStore.getState().logout()} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                  Kembali ke Halaman Login
                </button>
              </div>
            );
          }
          return null;
        })()}`
);

code = code.replace(
  /\{currentUser && currentView === 'dashboard' && currentUser\.role === 'guru' && \(/g,
  `{currentUser && currentView === 'dashboard' && currentUser.role === 'guru' && !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30) && (`
);

code = code.replace(
  /\{currentUser && currentView === 'dashboard' && currentUser\.role === 'siswa' && \(/g,
  `{currentUser && currentView === 'dashboard' && currentUser.role === 'siswa' && !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30) && (`
);

code = code.replace(
  /\{currentUser && currentView === 'active_session' && \(/g,
  `{currentUser && currentView === 'active_session' && (currentUser.role === 'admin' || currentUser.role === 'kepsek' || !(systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] >= 19 * 60 || systemTime.split(':').map(Number)[0] * 60 + systemTime.split(':').map(Number)[1] < 7 * 60 + 30)) && (`
);

fs.writeFileSync("src/components/MainApp.tsx", code, "utf8");
console.log("Patched MainApp.tsx");
