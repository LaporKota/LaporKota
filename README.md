<img width="2866" height="1618" alt="image" src="https://i.imgur.com/230UxM9.png" /> 

**LaporKota**

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
| ![Beranda LaporKota](https://i.imgur.com/230UxM9.png) | ![Dashboard Eco-Pulse](https://i.imgur.com/vToQ3RK.png) |

| Peta SeIndonesia | Forum Diskusi & Ide |
| :---: | :---: |
| ![Peta Indonesia Lengkap](https://i.imgur.com/4A4nLGf.png) | ![Forum Diskusi & Ide](https://i.imgur.com/FydkCw2.png) |

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
- **Dashboard Relawan** — ruang kerja khusus bagi relawan untuk memantau daftar laporan yang membutuhkan aksi lapangan dan langsung terjun ke detail laporan yang ingin ditangani.
- **Volunteer & Aksi Komunitas** — menjembatani laporan warga dengan aksi nyata lewat pendaftaran kegiatan gotong royong, lengkap dengan email konfirmasi otomatis begitu relawan mendaftar.
- **Forum Inovasi Komunitas** — ruang diskusi terbuka bagi warga untuk mengusulkan, membahas, dan mengembangkan ide solusi bagi permasalahan kota bersama-sama.
- **Dashboard Dampak & Open Data** — memvisualisasikan kontribusi platform terhadap capaian SDG 11, sekaligus membuka akses data laporan dalam format JSON/CSV untuk mendukung transparansi dan riset kebijakan publik.
- **IoT Eco-Pulse (Simulasi)** — dashboard telemetri energi dan sampah kota berbasis data simulasi, dirancang mengikuti pola pembacaan sensor IoT sungguhan sebagai purwarupa konsep monitoring kota pintar yang siap dikembangkan ke perangkat fisik.
- **Prediksi Kualitas Udara (Konsep AI)** — dashboard forecasting kondisi kualitas udara dengan tren dan rekomendasi yang disusun mengikuti pola output Gemini API, menggambarkan bagaimana warga dan pemerintah dapat mengantisipasi risiko polusi begitu integrasi API diaktifkan penuh.

## Fitur Seru & Engagement

- **Challenge Mingguan & Lencana Warga** — sistem gamifikasi berjenjang yang menjaga warga tetap aktif: konsisten melapor tiap minggu mengumpulkan Bintang, naik ke Bintang Super tiap dua minggu, hingga Mahkota bagi warga paling konsisten sebulan penuh. Dipadukan dengan lencana reputasi civic (dari "Bibit Warga" hingga "Pahlawan Kota") dan lencana spesialisasi kategori bagi warga yang fokus di satu isu tertentu.
- **GreenEdu** — pusat edukasi berisi kurasi artikel seputar isu lingkungan dan praktik kota berkelanjutan, dirancang untuk menumbuhkan kesadaran ekologis warga secara berkelanjutan.
- **Portfolio Inovasi Kota** — galeri studi kasus konsep smart city lintas domain (Smart Solar & Energy, IoT & Sensor Grid, AI Early Warning), lengkap dengan blueprint teknis yang dapat diunduh sebagai referensi pengembangan lebih lanjut.

## Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Bahasa | TypeScript |
| Build tool | Vite |
| Runtime | Bun |
| Database | Turso (libSQL) |
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
