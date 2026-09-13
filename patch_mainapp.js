const fs = require('fs');
let code = fs.readFileSync('src/components/MainApp.tsx', 'utf8');

const oldUseEffect1 = `  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);`;

const oldUseEffect2 = `  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, refreshData]);`;

const oldFetchInitial = `  const fetchInitialData = useCallback(async () => {
    try {
      let _users = await getUsers();
      
      if (_users.length === 0) {
        await seedUsers();
        _users = await getUsers();
      }
      setUsers(_users);
      extractClasses(_users);
    } catch (e) {
      console.error(e);
      addToast('Gagal memuat data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  }, []);`;

const newFetchInitial = `  const fetchInitialData = useCallback(async () => {
    try {
      let _users = await getUsers();
      
      if (_users.length === 0) {
        await seedUsers();
        _users = await getUsers();
      }
      setUsers(_users);
      extractClasses(_users);
    } catch (e) {
      console.error(e);
      addToast('Gagal memuat data pengguna', 'error');
    }
  }, []);`;

const combinedUseEffect = `  useEffect(() => {
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

code = code.replace(oldFetchInitial, newFetchInitial);
code = code.replace(oldUseEffect1, "");
code = code.replace(oldUseEffect2, combinedUseEffect);

fs.writeFileSync('src/components/MainApp.tsx', code, 'utf8');
console.log("Patched MainApp.tsx");
