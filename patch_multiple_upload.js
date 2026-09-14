const fs = require("fs");
let code = fs.readFileSync("src/components/ActiveSession.tsx", "utf8");

// 1. Update setSiswaFile to setSiswaFiles
code = code.replace(
  "const [siswaFile, setSiswaFile] = useState<File | null>(null);",
  "const [siswaFiles, setSiswaFiles] = useState<File[]>([]);"
);

// 2. Update handleStudentSubmit (which is handleKumpul)
code = code.replace(
  /if \(siswaFile\) \{\s*fileUrl = await uploadToImgBB\(siswaFile\);\s*fileName = siswaFile\.name;\s*\}/,
  `let photoUrls: string[] = [];
        if (siswaFiles.length > 0) {
          addToast(\`Mengupload \${siswaFiles.length} file tugas...\`, "info");
          const uploadPromises = siswaFiles.map(file => uploadToImgBB(file));
          photoUrls = await Promise.all(uploadPromises);
          fileUrl = photoUrls[0];
          fileName = siswaFiles.length === 1 ? siswaFiles[0].name : \`\${siswaFiles.length} file diupload\`;
        }`
);

// 3. Update createSubmission call
code = code.replace(
  "const res = await createSubmission(schedule.id, currentUser.id, studentText, fileName, fileUrl);",
  "const res = await createSubmission(schedule.id, currentUser.id, studentText, fileName, fileUrl, photoUrls);"
);

// 4. Update student input
code = code.replace(
  /<label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Lampiran Gambar Bukti \(Opsional\)<\/label>\s*<input type="file" accept="image\/\*" onChange=\{e => setSiswaFile\(e\.target\.files\?\.\[0\] \|\| null\)\} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" \/>\s*<p className="text-\[10px\] text-slate-400 mt-1">Gambar akan diupload ke ImgBB\.<\/p>/,
  `<label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Lampiran Gambar Bukti (Opsional, Bisa Lebih Dari Satu)</label>
                          <input type="file" multiple accept="image/*" onChange={e => { if (e.target.files) setSiswaFiles(Array.from(e.target.files)); }} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                          <p className="text-[10px] text-slate-400 mt-1">Gambar akan diupload ke ImgBB. {siswaFiles.length > 0 && <span className="text-emerald-600 font-bold">{siswaFiles.length} foto siap dikirim.</span>}</p>`
);

// 5. Update teacher view of student submission
code = code.replace(
  /\{tugas\.fileUrl && \([\s\S]*?<\/div>\s*\n\s*\)\}/,
  `{(tugas.photoUrls && tugas.photoUrls.length > 0) ? (
                                <div className="mt-3">
                                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Siswa</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {tugas.photoUrls.map((url: string, i: number) => (
                                      <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} alt="Lampiran Siswa" className="w-full rounded-xl border border-slate-200 shadow-sm aspect-video object-cover" loading="lazy" />
                                    ))}
                                  </div>
                                </div>
                              ) : tugas.fileUrl ? (
                                <div className="mt-3">
                                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Siswa</p>
                                  <img src={\`/api/proxy?url=\${encodeURIComponent(tugas.fileUrl)}\`} alt="Lampiran Siswa" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
                                </div>
                              ) : null}`
);

// 6. Update student view of their own submission
code = code.replace(
  /\{mySubmission\.fileUrl && \([\s\S]*?<\/div>\s*\n\s*\)\}/,
  `{(mySubmission.photoUrls && mySubmission.photoUrls.length > 0) ? (
                          <div className="mt-3">
                            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Anda</p>
                            <div className="grid grid-cols-2 gap-2">
                              {mySubmission.photoUrls.map((url: string, i: number) => (
                                <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} alt="Lampiran Anda" className="w-full rounded-xl border border-slate-200 shadow-sm aspect-video object-cover" loading="lazy" />
                              ))}
                            </div>
                          </div>
                        ) : mySubmission.fileUrl ? (
                          <div className="mt-3">
                            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lampiran Gambar Anda</p>
                            <img src={\`/api/proxy?url=\${encodeURIComponent(mySubmission.fileUrl)}\`} alt="Lampiran Anda" className="w-full max-w-sm rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
                          </div>
                        ) : null}`
);

fs.writeFileSync("src/components/ActiveSession.tsx", code, "utf8");
console.log("Patched file uploads");
