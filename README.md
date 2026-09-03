# LaporKota

**Digital Platform for Better Cities**

LaporKota adalah platform pelaporan permasalahan perkotaan yang menghubungkan warga dengan pemangku kepentingan kota secara real-time. Dibangun untuk ITechno Cup 2026, kategori Web Development, dengan subtema *"Smart Sustainable Digital Solution for Inclusive Society"*.

**Live demo:** [laporkota.up.railway.app](https://laporkota.up.railway.app/)
**Repository:** [github.com/LaporKota/LaporKota](https://github.com/LaporKota/LaporKota)

---

## Latar Belakang & Tujuan

Kota-kota di Indonesia menghadapi tantangan klasik yang terus berulang: jalan rusak yang lambat ditangani, sampah menumpuk tanpa pemantauan, hingga minimnya ruang bagi warga untuk terlibat aktif dalam pembangunan lingkungan sekitar mereka. Selama ini, laporan warga sering terhenti di level lisan atau tersebar di berbagai platform yang tidak terintegrasi, sehingga sulit dipantau dan ditindaklanjuti.

LaporKota dibangun untuk menjembatani kebutuhan ini. Kami ingin mengubah proses yang biasanya berhenti di:

> "Melihat masalah → bingung harus lapor ke mana"

menjadi:

> "Melihat masalah → melapor → dipantau → didukung komunitas → jadi aksi nyata"

Proyek ini berfokus pada **SDG 11 (Kota dan Komunitas Berkelanjutan)**, serta menyentuh **SDG 9 (Industri, Inovasi, dan Infrastruktur)** melalui pemanfaatan IoT dan AI untuk pemantauan kondisi kota.

## Fitur Utama

- **Pelaporan Infrastruktur** — warga melaporkan kerusakan fasilitas publik (jalan, penerangan, drainase, dll) lengkap dengan lokasi dan bukti foto.
- **Peta Interaktif** — menjelajahi laporan berdasarkan lokasi, memudahkan warga memahami persebaran masalah di kota.
- **Upvote & Diskusi** — warga bisa mendukung laporan orang lain dan berdiskusi langsung di tiap laporan.
- **Status Tracking** — memantau progres laporan dari masuk hingga selesai ditangani.
- **IoT Eco-Pulse** — pemantauan telemetri energi dan sampah kota secara real-time dari sensor IoT.
- **Prediksi Kualitas Udara (AI)** — forecasting kondisi kualitas udara kota menggunakan Gemini API, membantu warga dan pemerintah mengantisipasi risiko.
- **Forum Inovasi Komunitas** — ruang diskusi bagi warga untuk mengusulkan dan membahas solusi permasalahan kota.
- **Volunteer & Aksi Komunitas** — menghubungkan laporan dengan partisipasi nyata lewat kegiatan relawan.
- **Dashboard Dampak** — visualisasi aktivitas dan dampak platform terhadap target SDG 11.

## Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Bahasa | TypeScript |
| Build tool | Vite |
| Runtime | Bun |
| Database | Turso (libSQL) |
| AI | Gemini API (prediksi kualitas udara) |
| Hosting/Deployment | Railway |

## Cara Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/LaporKota/LaporKota.git
   cd LaporKota
   ```

2. Install dependencies menggunakan Bun:
   ```bash
   bun install
   ```

3. Salin file environment variable dan isi sesuai kredensial lo (Gemini API key, Turso database URL & token):
   ```bash
   cp .env.example .env
   ```

4. Jalankan development server:
   ```bash
   bun run dev
   ```

> Sesuaikan nama command di atas dengan yang tertera di `"scripts"` pada `package.json` kalau berbeda.

## Cara Penggunaan

1. Buka aplikasi di `http://localhost:5173` (atau port yang tertera di terminal) setelah development server berjalan.
2. Daftar/login sebagai warga untuk mulai membuat laporan.
3. Pilih menu **Lapor** untuk mengirimkan laporan infrastruktur baru, lengkapi lokasi dan foto.
4. Jelajahi laporan lain lewat **Peta Interaktif** atau **Explore**, beri dukungan (upvote) dan diskusi.
5. Buka dashboard **Eco-Pulse** untuk memantau data energi dan sampah kota secara real-time.
6. Kunjungi **Forum** untuk berdiskusi dan mengusulkan ide inovasi bersama komunitas.

## Akun Demo untuk Testing

Untuk memudahkan juri menguji fitur, tersedia akun admin yang sudah dibuat otomatis (seeded) saat aplikasi pertama kali dijalankan:

| Role | Email | Password |
|---|---|---|
| Admin/Petugas | `admin@mail.com` | `12345678` |

Akun admin ini dapat mengakses panel **"Update Status (Mode Petugas)"** pada setiap laporan, yang tidak tersedia untuk akun warga biasa. Untuk mencoba alur warga, silakan daftar akun baru langsung lewat halaman **Daftar Akun Warga**.

> Catatan: password default admin dapat diubah lewat environment variable `ADMIN_DEFAULT_PASSWORD` pada deployment production.

## Roadmap

- [x] Sistem pelaporan warga
- [x] Peta interaktif & eksplorasi laporan
- [x] IoT Eco-Pulse monitoring
- [x] Prediksi kualitas udara berbasis AI
- [x] Forum komunitas
- [ ] Notifikasi real-time
- [ ] Integrasi data publik pemerintah kota
- [ ] Dashboard admin untuk pemangku kebijakan
- [ ] Pengembangan versi mobile/PWA

## Tim

**FoidSlayer** — dikembangkan untuk ITechno Cup 2026, kategori Web Development.

---

*Better cities start with people who care.*
