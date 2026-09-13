import re

with open('src/components/SiswaDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { useAppStore } from '@/store';",
    "import { useState } from 'react';\nimport { useAppStore } from '@/store';\nimport PanduanSiswaModal from './PanduanSiswaModal';"
)

content = content.replace(
    "if (!currentUser) return null;",
    "if (!currentUser) return null;\n\n  const [showPanduan, setShowPanduan] = useState(false);"
)

old_header = '''      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10"><FaUserGraduate className="text-[150px] -mt-8 -mr-8" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Ruang Belajar Interaktif</h2>
          <p className="text-blue-100 mt-1 font-medium">Siswa: {currentUser.name} | Kelas: <span className="font-bold text-white">{currentUser.kelas}</span></p>
        </div>
      </div>'''

new_header = '''      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center">
        <div className="absolute right-0 top-0 opacity-10"><FaUserGraduate className="text-[150px] -mt-8 -mr-8" /></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h2 className="text-3xl font-extrabold tracking-tight">Ruang Belajar Interaktif</h2>
          <p className="text-blue-100 mt-1 font-medium">Siswa: {currentUser.name} | Kelas: <span className="font-bold text-white">{currentUser.kelas}</span></p>
        </div>
        <div className="relative z-10">
          <button onClick={() => setShowPanduan(true)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold py-2.5 px-6 rounded-xl text-sm flex items-center transition-colors shadow-sm backdrop-blur-sm">
            <FaBookOpen className="mr-2 text-lg" /> Buku Panduan
          </button>
        </div>
      </div>'''

content = content.replace(old_header, new_header)

content = content.replace(
    "    </div>\n  );\n}",
    "      {showPanduan && <PanduanSiswaModal onClose={() => setShowPanduan(false)} />}\n    </div>\n  );\n}"
)

with open('src/components/SiswaDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
