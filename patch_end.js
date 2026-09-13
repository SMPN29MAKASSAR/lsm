const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

// Remove everything after the last `</div>` of the main component
const target = `            <p className="text-sm font-bold border-b border-black pb-0.5">Hj. Nur Rahma, S.Pd., M.Pd.</p>
          </div>
        </div>
      </div>
    </div>`;

const index = code.indexOf(target);
if (index !== -1) {
  code = code.substring(0, index + target.length) + `
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
    </>
  );
}`;
  fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
  console.log("Fixed end");
}
