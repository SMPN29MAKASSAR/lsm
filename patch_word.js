const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

// 1. Update imports
code = code.replace(
  "FaFilePdf, FaBookOpen",
  "FaFilePdf, FaFileWord, FaBookOpen"
);

// 2. Replace cetakPDF with cetakWord
const oldFn = `const cetakPDF = () => {
    window.print();
  };`;

const newFn = `const cetakWord = () => {
    let tableRows = '';
    
    filteredSchedules.forEach((s: any) => {
        const adaJurnal = journals.find((j:any) => j.id === s.id);
        const totalHadirKelas = attendances.filter((a:any) => a.scheduleId === s.id).length;
        const totalSiswaKelas = users?.filter((u:any) => u.role === 'siswa' && u.kelas && s.kelas.includes(u.kelas)).length || 0;
        
        let statusLabel = 'TERTUTUP';
        if (s.viconLink) {
            if (s.date < systemDate) {
                statusLabel = 'BERAKHIR';
            } else if (s.date > systemDate) {
                statusLabel = 'TERJADWAL';
            } else {
                const [h, m] = systemTime.split(':').map(Number);
                const currentMins = h * 60 + m;
                if (s.startTime && s.endTime) {
                    const [sh, sm] = s.startTime.split(':').map(Number);
                    const [eh, em] = s.endTime.split(':').map(Number);
                    const startMins = sh * 60 + sm;
                    const endMins = eh * 60 + em;
                    if (currentMins >= startMins && currentMins <= endMins) {
                        statusLabel = 'BERLANGSUNG';
                    } else if (currentMins > endMins) {
                        statusLabel = 'BERAKHIR';
                    } else {
                        statusLabel = 'TERJADWAL';
                    }
                } else {
                    statusLabel = 'BERLANGSUNG';
                }
            }
        }

        let imagesHtml = '';
        if (adaJurnal && adaJurnal.photoUrls && adaJurnal.photoUrls.length > 0) {
            adaJurnal.photoUrls.forEach((url: string) => {
                imagesHtml += \`<img src="\${window.location.origin}/api/proxy?url=\${encodeURIComponent(url)}" style="max-width: 150px; height: auto; margin: 5px; border-radius: 8px;" />\`;
            });
        }

        tableRows += \`
            <tr>
                <td>
                    <strong>\${s.kelas}</strong><br/>
                    <small>\${s.date}</small>
                </td>
                <td>
                    <strong>\${s.mapel}</strong><br/>
                    <small>\${s.teacherName}</small>
                </td>
                <td style="text-align:center;">\${statusLabel}</td>
                <td style="text-align:center;">\${s.viconLink || '-'}</td>
                <td style="text-align:center;">\${totalHadirKelas} / \${totalSiswaKelas}</td>
                <td style="text-align:center;">\${imagesHtml || '-'}</td>
            </tr>
        \`;
    });

    const html = \`
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Laporan KBM</title>
      <style>
        @page WordSection1 {
            size: 29.7cm 21cm;
            margin: 2cm 2cm 2cm 2cm;
            mso-page-orientation: landscape;
        }
        div.WordSection1 { page: WordSection1; }
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11pt; }
        th, td { border: 1px solid #000; padding: 12px; text-align: left; vertical-align: middle; }
        th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        <h2 style="text-align: center; font-family: Arial, sans-serif;">Laporan Pembelajaran Daring</h2>
        <h3 style="text-align: center; font-family: Arial, sans-serif;">UPT SPF SMPN 29 Makassar</h3>
        <p style="font-family: Arial, sans-serif;">Tanggal Cetak: \${new Date().toLocaleDateString('id-ID')}</p>
        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">Tanggal & Kelas</th>
                    <th style="width: 20%;">Mata Pelajaran / Guru</th>
                    <th style="width: 10%;">Status Vicon</th>
                    <th style="width: 15%;">Link Vicon</th>
                    <th style="width: 10%;">Siswa Hadir</th>
                    <th style="width: 30%;">Bukti</th>
                </tr>
            </thead>
            <tbody>
                \${tableRows || '<tr><td colspan="6" style="text-align:center;">Belum ada KBM.</td></tr>'}
            </tbody>
        </table>
      </div>
    </body>
    </html>
    \`;

    const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`Laporan_KBM_\${new Date().toISOString().split('T')[0]}.doc\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`;

code = code.replace(oldFn, newFn);

// 3. Update Button
const oldBtn = `<button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center text-sm cursor-pointer">
                <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
              </button>`;

const newBtn = `<button onClick={cetakWord} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center text-sm cursor-pointer">
                <FaFileWord className="mr-2" /> Cetak Laporan (Word)
              </button>`;

code = code.replace(oldBtn, newBtn);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Word Print");
