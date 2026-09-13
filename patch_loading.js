const fs = require("fs");
let code = fs.readFileSync("src/components/MainApp.tsx", "utf8");

const oldInit = `  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchInitialData();
      if (currentUser) {
        await refreshData();
      }
      setLoading(false);
    };
    init();
  }, [currentUser, fetchInitialData, refreshData]);`;

const newInit = `  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (currentUser) {
        await refreshData();
      } else {
        await fetchInitialData();
      }
      setLoading(false);
    };
    init();
  }, [currentUser, fetchInitialData, refreshData]);`;

code = code.replace(oldInit, newInit);
fs.writeFileSync("src/components/MainApp.tsx", code, "utf8");
console.log("Patched MainApp loading");
