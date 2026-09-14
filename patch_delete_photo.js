const fs = require("fs");
let code = fs.readFileSync("src/components/ActiveSession.tsx", "utf8");

// 1. Add deletedPhotos state
code = code.replace(
  "const [jurnalPhotos, setJurnalPhotos] = useState<File[]>([]);",
  "const [jurnalPhotos, setJurnalPhotos] = useState<File[]>([]);\n  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);"
);

// 2. Update newPhotos in handleSetJurnal
code = code.replace(
  "let newPhotos = existingJurnal?.photoUrls || [];",
  "let newPhotos = (existingJurnal?.photoUrls || []).filter((url: string) => !deletedPhotos.includes(url));"
);

// 3. Clear deletedPhotos on success
code = code.replace(
  "setJurnalPhotos([]);",
  "setJurnalPhotos([]); \n          setDeletedPhotos([]);"
);

// 4. Update the rendering of existing photos
code = code.replace(
  /\{existingJurnal\?.photoUrls && existingJurnal\.photoUrls\.length > 0 && \([\s\S]*?<\/div>\s*\n\s*\)\}/,
  `{(() => {
                    const displayPhotos = (existingJurnal?.photoUrls || []).filter((url: string) => !deletedPhotos.includes(url));
                    if (displayPhotos.length === 0) return null;
                    return (
                      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {displayPhotos.map((url: string, idx: number) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video group">
                            <img src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className="object-cover w-full h-full" alt={\`Dokumentasi \${idx+1}\`} loading="lazy" />
                            <button 
                               onClick={(e) => { e.preventDefault(); setDeletedPhotos(prev => [...prev, url]); }} 
                               className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                               title="Hapus foto ini (Jangan lupa klik Simpan setelahnya)"
                            >
                               <FaTimes size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}`
);

fs.writeFileSync("src/components/ActiveSession.tsx", code, "utf8");
console.log("Patched ActiveSession.tsx");
