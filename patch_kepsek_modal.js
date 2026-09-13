const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");
code = code.replace(/\r\n/g, "\n");

// 1. Add state for image modal
code = code.replace(
  "const [filterDate, setFilterDate] = useState('');",
  "const [filterDate, setFilterDate] = useState('');\n  const [selectedImage, setSelectedImage] = useState<string | null>(null);"
);

// 2. Change image rendering logic in the table
const oldImg = `{adaJurnal.photoUrls.map((url: string, i: number) => {
                                    const len = adaJurnal.photoUrls.length;
                                    let imgClass = "w-32 h-32 md:w-40 md:h-40";
                                    if (len === 2) imgClass = "w-24 h-24 md:w-32 md:h-32";
                                    else if (len >= 3) imgClass = "w-20 h-20 md:w-28 md:h-28";
                                    return (
                                      <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className={\`\${imgClass} rounded-xl object-cover shadow border border-slate-200 hover:scale-[1.8] hover:z-50 relative transition-transform cursor-pointer origin-center\`} alt="Dok" loading="lazy" />
                                    );
                                  })}`;

const newImg = `{adaJurnal.photoUrls.map((url: string, i: number) => {
                                    const len = adaJurnal.photoUrls.length;
                                    let imgClass = "h-48 md:h-64";
                                    if (len === 2) imgClass = "h-32 md:h-48";
                                    else if (len >= 3) imgClass = "h-24 md:h-32";
                                    return (
                                      <img key={i} onClick={() => setSelectedImage(url)} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className={\`\${imgClass} w-auto rounded-xl object-contain shadow-md border-2 border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer\`} alt="Dok" loading="lazy" />
                                    );
                                  })}`;
code = code.replace(oldImg, newImg);

// 3. Add modal to the end of the return statement
const oldReturn = `    </div>
  );
}`;

const newReturn = `    </div>
    {selectedImage && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setSelectedImage(null)}>
        <div className="relative max-w-7xl max-h-[95vh] flex flex-col items-center">
          <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <FaMinus className="text-xl rotate-45" />
          </button>
          <img src={\`/api/proxy?url=\${encodeURIComponent(selectedImage)}\`} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20" alt="Preview Full" />
        </div>
      </div>
    )}
  );
}`;
code = code.replace(oldReturn, newReturn);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Kepsek Dashboard Image Modal");
