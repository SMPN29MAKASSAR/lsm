const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  `  return (
    <div className="fade-in space-y-6">`,
  `  return (
    <>
    <div className="fade-in space-y-6">`
);

code = code.replace(
  `}
    </div>
    {selectedImage && (`,
  `    </div>
    {selectedImage && (`
);

code = code.replace(
  `    )    )}
    </>
  );
}`,
  `    )}
    </>
  );
}`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Kepsek syntax");
