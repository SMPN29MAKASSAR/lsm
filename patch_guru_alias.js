const fs = require("fs");
let code = fs.readFileSync("src/components/GuruDashboard.tsx", "utf8");

const oldCode = "  const mySchedules = schedules.filter(s => s.teacherId === currentUser?.id);";

const newCode = `  const getAliasIds = (id: string | undefined): string[] => {
    if (!id) return [];
    const aliases: Record<string, string[]> = {
      'G94': ['G94', 'G84'],
      'G84': ['G84', 'G94'],
      'G74': ['G74', 'G85'],
      'G85': ['G85', 'G74'],
      'G911': ['G911', 'G812'],
      'G812': ['G812', 'G911'],
      'G913': ['G913', 'G814'],
      'G814': ['G814', 'G913'],
      'G915': ['G915', 'G816'],
      'G816': ['G816', 'G915'],
      'G715': ['G715', 'G817'],
      'G817': ['G817', 'G715'],
      'G711': ['G711', 'G811'],
      'G811': ['G811', 'G711'],
      'G76': ['G76', 'G87'],
      'G87': ['G87', 'G76'],
      'G78': ['G78', 'G89'],
      'G89': ['G89', 'G78'],
    };
    return aliases[id] || [id];
  };

  const targetIds = getAliasIds(currentUser?.id);
  const mySchedules = schedules.filter(s => targetIds.includes(s.teacherId));`;

code = code.replace(oldCode, newCode);
fs.writeFileSync("src/components/GuruDashboard.tsx", code, "utf8");
console.log("Patched alias in GuruDashboard");
