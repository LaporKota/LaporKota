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

## Tampilan Platform

| Beranda & Ringkasan Kota | Eco-Pulse: Telemetri IoT |
| :---: | :---: |
| ![Beranda LaporKota](url-gambar-beranda) | ![Dashboard Eco-Pulse](url-gambar-eco-pulse) |

| Status & Perkembangan Laporan | Pusat Edukasi & Inovasi Hijau |
| :---: | :---: |
| ![Status Laporan](url-gambar-laporan) | ![Pusat Edukasi](url-gambar-edukasi) |

## Proses & Perjalanan Pengembangan

Sebelum menulis baris kode pertama, kami menghabiskan waktu untuk riset terlebih dahulu. Kami mempelajari beberapa platform pelaporan warga yang sudah berjalan di lapangan, seperti [LAPOR!](https://www.lapor.go.id/) milik pemerintah Indonesia, [FixMyStreet](https://www.fixmystreet.com/) dari Inggris, dan [TrashOut](https://admin.trashout.ngo/trash-map/) yang berfokus pada pemetaan sampah secara global. Dari situ kami mencoba memahami apa yang sudah bekerja dengan baik, di mana biasanya platform semacam ini kehilangan penggunanya (biasanya di tahap tindak lanjut laporan), dan bagian mana yang bisa kami kembangkan lebih jauh lewat pendekatan IoT dan AI.

Hasil riset itu kami terjemahkan ke dalam rancangan desain di Figma sebelum masuk ke tahap development — mulai dari wireframe, alur pengguna untuk warga maupun petugas, sampai tampilan visual tiap halaman utama. Pendekatan design-first ini membantu kami menyamakan keputusan UX di awal (misalnya, alur melapor yang harus sesingkat mungkin) sehingga proses coding bisa berjalan lebih terarah dan paralel antar anggota tim.

- **Desain (Figma):** [3 Devs, 0 Errors](https://www.figma.com/design/QB5Y9x79OKcWGvznjcAC2V/3-Devs--0-Errors-%E2%9A%A1%F0%9F%94%A5%F0%9F%9A%80?node-id=729-4&t=hYXl4WEYhkgbSL5M-1)
- **Catatan proses & dokumentasi lengkap:** [Google Docs — Perjalanan Tim](https://docs.google.com/document/d/197vZdeRKT9tjOvDo_GcHSeKN_rvijU3H18pvhuO1vCc/edit?usp=sharing)

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

## Arsitektur Sistem & Alur Inovasi

**Prediksi Kualitas Udara (Gemini API)**
Data parameter kualitas udara (PM2.5, AQI) diproses lewat Gemini API untuk membaca tren jangka pendek. Hasilnya diterjemahkan jadi status kualitas udara (mis. "Sedang", "Tidak Sehat") beserta rekomendasi aksi untuk warga, lalu ditampilkan di dashboard Eco-Pulse.

**Telemetri IoT Eco-Pulse**
Data dari sensor Smart Bins (tingkat keterisian sampah) dan panel Solar Rooftop (produksi energi) dikirim/disimulasikan secara berkala ke backend, disimpan di Turso (libSQL), lalu ditampilkan real-time di dashboard Eco-Pulse.

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

3. Salin file environment variable dan isi sesuai kredensial yang dibutuhkan (Gemini API key, Turso database URL & token):
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
| Admin/Petugas | admin@mail.com | 12345678 |

Akun admin ini dapat mengakses panel "Update Status (Mode Petugas)" pada setiap laporan, yang tidak tersedia untuk akun warga biasa. Untuk mencoba alur warga, silakan daftar akun baru langsung lewat halaman Daftar Akun Warga.

Catatan: password default admin dapat diubah lewat environment variable `ADMIN_DEFAULT_PASSWORD` pada deployment production.

## Tantangan & Pembelajaran

Sejujurnya, proses development LaporKota tidak mulus. Karena scope fitur yang cukup luas — pelaporan warga, peta interaktif, telemetri IoT, sampai prediksi AI — dikerjakan dalam waktu terbatas khas hackathon, kami cukup sering menemukan bug di berbagai bagian aplikasi, mulai dari alur autentikasi, sinkronisasi data laporan, sampai stabilitas beberapa halaman saat diakses di environment production.

Beberapa hal yang kami pelajari dari situ:

- **Integrasi banyak layanan sekaligus (Turso, Gemini API, deployment Railway) butuh testing bertahap**, bukan disatukan di akhir. Beberapa bug yang muncul di production ternyata berasal dari perbedaan konfigurasi environment variable antara local dan server.
- **Fitur yang ambisius perlu diprioritaskan.** Kami sempat mengembangkan banyak modul secara paralel, yang membuat sebagian fitur (terutama Eco-Pulse dan prediksi kualitas udara) belum sepenuhnya stabil saat diuji ulang.
- **Dokumentasi dan testing manual di sela development sangat membantu** mempersempit sumber bug, walau waktu yang tersisa menjelang deadline membuat sebagian perbaikan belum bisa dituntaskan sepenuhnya.

Kami transparan menyampaikan ini karena percaya juri lebih menghargai kejujuran soal proses dibanding kesan bahwa semuanya berjalan sempurna. Poin-poin di atas juga jadi catatan perbaikan utama kami pada roadmap ke depan.

## Roadmap

- [x] Sistem pelaporan warga
- [x] Peta interaktif & eksplorasi laporan
- [x] IoT Eco-Pulse monitoring
- [x] Prediksi kualitas udara berbasis AI
- [x] Forum komunitas
- [x] Notifikasi real-time
- [x] Integrasi data publik pemerintah kota
- [x] Dashboard admin untuk pemangku kebijakan
- [x] Pengembangan versi mobile/PWA

## Tim FoidSlayer

Dikembangkan untuk ITechno Cup 2026, kategori Web Development.

* **Faris** — Lead Developer (System Architecture, Frontend & API Integration)
* **Muhammad Ahsan** — UI/UX Designer & System Analyst (Wireframing, User Journey & SDG 11 Research)
* **Sahel Fadillah** — QA Tester & Technical Writer (Documentation, Data Validation & Pitching Specialist)

---

*Better cities start with people who care.*
