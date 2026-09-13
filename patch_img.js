const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

const newImg = `{adaJurnal.photoUrls && adaJurnal.photoUrls.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mt-3">
                                  {adaJurnal.photoUrls.map((url, i) => {
                                    const len = adaJurnal.photoUrls.length;
                                    let imgClass = "w-32 h-32 md:w-40 md:h-40";
                                    if (len === 2) imgClass = "w-24 h-24 md:w-32 md:h-32";
                                    else if (len >= 3) imgClass = "w-20 h-20 md:w-28 md:h-28";
                                    return (
                                      <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className={\`\${imgClass} rounded-xl object-cover shadow border border-slate-200 hover:scale-[1.8] hover:z-50 relative transition-transform cursor-pointer origin-center\`} alt="Dok" loading="lazy" />
                                    );
                                  })}
                                </div>
                              )}`;

code = code.replace(/\{adaJurnal\.photoUrls && adaJurnal\.photoUrls\.length > 0 && \([\s\S]*?<\/[ \t]*div>\s*\)\}/, newImg);
fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Kepsek images");
