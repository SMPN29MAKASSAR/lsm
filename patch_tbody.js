const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

// 1. Remove the parent tbody start tag and divide-y class
code = code.replace(
  /<tbody className="text-sm text-slate-700 divide-y divide-slate-100">\s*\{filteredSchedules.length === 0 \? \(\s*<tr><td colSpan=\{6\} className="p-8 text-center text-slate-400">Belum ada KBM.<\/td><\/tr>\s*\) : \(\s*filteredSchedules.map\(\(s:any\) => \{/,
  `{filteredSchedules.length === 0 ? (
                <tbody className="text-sm text-slate-700"><tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada KBM.</td></tr></tbody>
              ) : (
                filteredSchedules.map((s:any) => {`
);

// 2. Change the start of tr to be wrapped in a tbody
code = code.replace(
  /<tr key=\{s\.id\} className="hover:bg-slate-50 print:break-inside-avoid" style=\{\{ pageBreakInside: 'avoid', breakInside: 'avoid' \}\}>/g,
  `<tbody key={s.id} className="text-sm text-slate-700 border-b border-slate-100 print:break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <tr className="hover:bg-slate-50">`
);

// 3. Change the end of tr to also close the tbody
// Since we have multiple trs maybe, let's find the closing tr for the map.
// The map returns a JSX element. The tr closes at the end of the map function.
code = code.replace(
  /<\/tr>\s*\)\s*\}\)\s*\)\}\s*<\/tbody>/,
  `</tr>
                  </tbody>
                )
              })
            )}`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched table body to fix page breaks");
