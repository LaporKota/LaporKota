import { GreenEduArticle } from '../types';

export const GREEN_EDU_ARTICLES: GreenEduArticle[] = [
  {
    id: 'edu-01',
    title: 'Sensor Ultrasonik LoRaWAN & AI Dynamic Route Dispatcher untuk Pengelolaan Sampah Kota Modern',
    category: 'IoT & Smart Waste',
    badge: 'SMART WASTE IOT',
    author: 'Tim Rekayasa Lingkungan LaporKota',
    readTime: '4 Menit Baca',
    publishedDate: '24 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
    summary: 'Penerapan sensor ultrasonik jarak jauh bertenaga baterai surya mikro yang memantau tingkat keterisian tempat sampah komunal secara real-time dan mengarahkan armada truk sampah melalui algoritma rute genetika AI.',
    keyPillars: [
      'Deteksi Keterisian Kontainer 99.4% Presisi via Sensor Gelombang Ultrasonik',
      'Komunikasi Jarak Jauh Rendah Daya LoRaWAN (Jangkauan hingga 12 km)',
      'Pengurangan Konsumsi BBM Truk Sampah Kota hingga 32% Berkat AI Dynamic Dispatch'
    ],
    iotTechDetails: [
      {
        tech: 'Sensor Ultrasonik HC-SR04/JSN-SR04T',
        desc: 'Tahan cuaca ekstrem (IP67), mengukur elevasi tumpukan sampah setiap interval 15 menit.'
      },
      {
        tech: 'Gateway Jaringan LoRaWAN 915 MHz',
        desc: 'Mengirimkan telemetri status kapasitas dan status baterai tanpa memerlukan pulsa seluler boros daya.'
      },
      {
        tech: 'Model AI Genetic Algorithm & Graph Neural Network',
        desc: 'Mengkalkulasi rute terpendek dan titik prioritas kontainer penuh (>80%) bagi supir truk secara otomatis di pagi hari.'
      }
    ],
    fullContent: `
### Paradigma Baru: Dari Jadwal Statis ke Pengangkutan Berbasis Kebutuhan Nyata (On-Demand)

Secara konvensional, armada truk sampah kota berkeliling mengikuti jadwal kaku yang kerap berujung pada inefisiensi: truk menyambangi bak sampah yang masih kosong, sementara di titik lain tumpukan sampah meluber ke jalan.

Dengan mengintegrasikan **IoT Smart Bins ber-sensor ultrasonik**, kontainer sampah mengirimkan status keterisian secara periodik ke cloud dashboard LaporKota. Saat ambang batas 80% terlampaui:
1. **AI Route Engine** seketika menyusun matriks rute tercepat dan hemat bahan bakar.
2. Operator dinas kebersihan menerima notifikasi penugasan terpadu.
3. Warga sekitar dapat melihat estimasi waktu kedatangan truk sampah via aplikasi.

Hasil implementasi pilot di 12 kelurahan mencatatkan penurunan emisi gas buang armada hingga 28.5 ton CO2 eq/bulan serta eliminasi titik tumpukan sampah liar di trotoar.
    `
  },
  {
    id: 'edu-02',
    title: 'Desentralisasi Smart Micro-Grid: Pemanfaatan AI Forecasting untuk Efisiensi Panel Surya Komunal',
    category: 'Smart Energy & AI',
    badge: 'SOLAR MICRO-GRID',
    author: 'Laboratorium Energi Terbarukan & Smart Grid',
    readTime: '5 Menit Baca',
    publishedDate: '23 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=80',
    summary: 'Bagaimana integrasi inverter cerdas, baterai LiFePO4 terdistribusi, dan model AI peramalan cuaca satelit dapat menstabilkan pasokan listrik hijau fasilitas publik dan menekan biaya tagihan listrik hingga 45%.',
    keyPillars: [
      'Inverter Grid-Tied dengan Modbus RTU Telemetri Real-Time',
      'Prediksi Iradiasi Matahari 24-Jam Kedepan Berbasis Deep Learning Weather Models',
      'Penyetaraan Beban Puncak (Peak Shaving) Otomatis untuk Lampu Jalan dan Pompa Air'
    ],
    iotTechDetails: [
      {
        tech: 'Smart MPPT Solar Charge Controller',
        desc: 'Memaksimalkan efisiensi penyerapan foton surya dengan efisiensi konversi daya >98.2%.'
      },
      {
        tech: 'Cloud BMS (Battery Management System)',
        desc: 'Memantau voltase sel baterai LiFePO4, temperatur termal, dan estimasi siklus hidup (State of Health).'
      },
      {
        tech: 'Algoritma AI Load Shifting & Forecasting',
        desc: 'Mengarahkan surplus daya surya di siang hari untuk pengisian baterai dan penyaringan air gravitasi.'
      }
    ],
    fullContent: `
### Membangun Kemandirian Energi Tingkat Rukun Warga (RW)

Pembangkit Listrik Tenaga Surya (PLTS) Atap di fasilitas umum seperti balai warga, puskesmas pembantu, dan pos satpam kini bertransformasi menjadi **Micro-Grid Cerdas**.

Tantangan utama energi surya adalah intermitensi (fluktuasi intensitas matahari akibat tutupan awan mendadak). Solusi AI LaporKota mengatasi hal ini dengan:
- Menganalisis citra awan satelit dan sensor intensitas radiasi lokal (Piranometer IoT).
- Menentukan kapan baterai harus diisi, kapan daya dialirkan ke beban esensial (seperti pompa drainase dan lampu jalan), dan kapan listrik cadangan dipertahankan.
- Mengirimkan laporan penghematan kWh harian dan jejak karbon langsung ke ponsel para pengurus RT/RW secara transparan.
    `
  },
  {
    id: 'edu-03',
    title: 'Drainase Digital 4.0: Sensor Tekanan Hidrostatis & AI Deteksi Dini Luapan Saluran Air',
    category: 'Climate Resilience',
    badge: 'AI FLOOD EARLY WARNING',
    author: 'Gugus Tugas Resiliensi Perkotaan & Geospasial',
    readTime: '4 Menit Baca',
    publishedDate: '22 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1583307849646-608bdfbfa220?auto=format&fit=crop&w=900&q=80',
    summary: 'Jaringan pemantau debit air gorong-gorong dan sedimentasi lumpur bawah tanah yang memberikan peringatan dini banjir 45 menit sebelum air meluap ke pemukiman padat.',
    keyPillars: [
      'Sensor Tekanan Hidrostatis Submersible & Pelampung Magnetik',
      'Prediksi Luapan AI Berbasis Integrasi Data Radar Curah Hujan BMKG',
      'Peringatan Cepat Multi-Kanal ke Satgas Pasukan Biru dan Grup Komunikasi Warga'
    ],
    iotTechDetails: [
      {
        tech: 'Submersible Pressure Transducer IP68',
        desc: 'Ditanam di dasar saluran drainase utama untuk membaca kedalaman air dan laju endapan lumpur.'
      },
      {
        tech: 'Microcontroller ESP32 & Modul NB-IoT',
        desc: 'Konsumsi daya mikro dengan ketahanan baterai lithium hingga 2 tahun tanpa penggantian.'
      },
      {
        tech: 'AI Hydrodynamic Wavelet Forecasting Model',
        desc: 'Mengkorelasikan intensitas hujan hulu dengan kapasitas tampung hilir untuk memprediksi titik jenuh limpasan.'
      }
    ],
    fullContent: `
### Mitigasi Bencana Sebelum Genangan Terjadi

Saluran drainase kota yang tersumbat sampah plastik atau sedimentasi lumpur sering kali baru disadari ketika air telah setinggi lutut di pemukiman warga.

Dengan **Sistem Drainase Cerdas Berbasis AI & IoT**:
1. Sensor di gorong-gorong memantau kecepatan arus dan kenaikan muka air secara berkala.
2. Jika terdeteksi anomali aliran (indikasi sumbatan batang kayu atau sampah padat), AI langsung mengirimkan sinyal peringatan bahaya level 1.
3. Pintu air otomatis dan pompa siphon diaktifkan sebelum genangan menyentuh badan jalan.
4. Satuan tugas pembersih saluran dapat langsung diarahkan ke koordinat penyumbat secara akurat tanpa perlu memeriksa ratusan lubang kontrol secara manual.
    `
  }
];
