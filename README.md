# SKPD - Next.js & PostgreSQL Edition

Aplikasi ini telah direkonstruksi dari HTML/Vanilla JS/Firebase menjadi **Next.js (React) + PostgreSQL + Prisma**.

## Persiapan & Menjalankan Aplikasi

1. **Pastikan PostgreSQL berjalan di komputer Anda**.
2. Buka file `.env` di folder ini dan sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL Anda.
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/skpd?schema=public"
   ```
3. Buka terminal di folder ini (`C:\Users\HP\.gemini\antigravity\scratch\skpd-app`) dan jalankan perintah berikut untuk menginisiasi tabel database:
   ```bash
   npx prisma db push
   ```
4. Setelah database siap, jalankan server Next.js:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di browser.

**Catatan**: Data pengguna default akan otomatis dimasukkan (seeded) saat Anda pertama kali membuka aplikasi jika database masih kosong.
