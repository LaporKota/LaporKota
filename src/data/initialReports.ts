import { Report, CivicNotification } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-01',
    title: 'Sampah Menumpuk di Jl. Malioboro',
    category: 'kebersihan',
    categoryLabel: 'Kebersihan',
    categoryIcon: 'delete',
    description: 'Tumpukan sampah plastik dan limbah rumah tangga meluber ke trotoar jalan utama dekat pedestrian Malioboro. Menimbulkan bau tidak sedap dan mengganggu pejalan kaki serta wisatawan.',
    location: 'Jl. Malioboro, Yogyakarta',
    city: 'Yogyakarta',
    lat: -7.7928,
    lng: 110.3658,
    mapTopPct: 32,
    mapLeftPct: 38,
    timeAgo: '2 Jam yang lalu',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    status: 'baru',
    upvotes: 24,
    hasUpvoted: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWr_lkpfQCI44JNAXYqVGOligdK6hKpa2qXvASY05dcYN1CuURLlcUnFmmexUoZNL1WR18HuYH97K4vYIPYyMgVlDEEmKAhGudGDu_O2e0D1fysBrtk7Q0JA9obSrTY2uTT8-khG8Cs_4t2B60wEMSLQGflPbV0kUVY06PUNY8ieDKTuSaS8_eYKyXIiP2RA_whGxHmUM88yCSFPM-R3giOEPjuIImwxerYR6wOASYEZWLm1Mfe5G_XQ',
    imageAlt: 'Sampah menumpuk di pedestrian Malioboro',
    reporterName: 'Bayu Nugroho',
    departmentAssigned: 'Dinas Lingkungan Hidup & Kehutanan',
    priority: 'Tinggi',
    updates: [
      {
        id: 'upd-101',
        date: '2 jam lalu',
        author: 'Sistem LaporKota',
        role: 'Automated Dispatch',
        message: 'Laporan telah diverifikasi oleh sistem dan diteruskan ke Dinas Lingkungan Hidup Yogyakarta.',
        statusChange: 'baru'
      }
    ],
    comments: [
      {
        id: 'c-1',
        userName: 'Rina Kartika',
        timestamp: '1 jam lalu',
        content: 'Iya benar, baunya menyengat sekali terutama saat siang hari. Mohon segera diangkut.'
      },
      {
        id: 'c-2',
        userName: 'Agus Santoso',
        timestamp: '30 menit lalu',
        content: 'Perlu ditambah tong sampah pilah di sepanjang jalur ini.'
      }
    ]
  },
  {
    id: 'rep-02',
    title: 'Lampu Jalan Padam di Tebet Timur',
    category: 'infrastruktur',
    categoryLabel: 'Infrastruktur',
    categoryIcon: 'lightbulb',
    description: 'Penerangan jalan umum (PJU) sepanjang 300 meter di area permukiman Tebet Timur mati total sejak kemarin malam. Wilayah menjadi sangat gelap dan rawan tindak kriminal.',
    location: 'Tebet, Jakarta Selatan',
    city: 'Jakarta',
    lat: -6.2366,
    lng: 106.8527,
    mapTopPct: 62,
    mapLeftPct: 64,
    timeAgo: '1 Hari yang lalu',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    status: 'diproses',
    upvotes: 156,
    hasUpvoted: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5AUTQTkCc0xWxXV3epX4-PU5zsI6grRTgdaYlr6fw6oCAZtVqQBeYZLXgJuBJuo42l394HVpGkyH1lmfJAtHlgLy4KmQ9aUbbuW-qTzNV1MQ4oiWiGFHtbh6O5ABTNWQ-5R4H0dz0I1RJfnq1TPBm2z8KG_MQxNZxb4VNLHj8wSB2ROiiPker9r8v27gL_DgLw__eKljfcoHFGgC01fhrJNiQty9PtZWboQ-MnxfaC8iCDb5VWVWrpg',
    imageAlt: 'Lampu jalan mati di Tebet Timur',
    reporterName: 'Siti Rahmawati',
    departmentAssigned: 'Dinas Bina Marga DKI Jakarta',
    priority: 'Tinggi',
    updates: [
      {
        id: 'upd-201',
        date: '1 hari lalu',
        author: 'Siti Rahmawati',
        role: 'Pelapor',
        message: 'Laporan dibuat dengan bukti foto kondisi jalanan gelap.',
        statusChange: 'baru'
      },
      {
        id: 'upd-202',
        date: '6 jam lalu',
        author: 'Hendra Gunawan (Dinas Bina Marga)',
        role: 'Petugas Lapangan',
        message: 'Tim teknisi lapangan PJU Kecamatan Tebet sudah diterjunkan untuk memeriksa sekring gardu utama dan kabel distribusi.',
        statusChange: 'diproses'
      }
    ],
    comments: [
      {
        id: 'c-3',
        userName: 'Dimas Pratama',
        timestamp: '18 jam lalu',
        content: 'Sangat membahayakan pengendara motor saat malam hari.'
      },
      {
        id: 'c-4',
        userName: 'Hendra Gunawan',
        timestamp: '6 jam lalu',
        content: 'Sedang kami tangani pak/bu, estimasi pergantian trafo malam ini selesai.',
        isOfficial: true
      }
    ]
  },
  {
    id: 'rep-03',
    title: 'Jalan Berlubang di Cihampelas',
    category: 'infrastruktur',
    categoryLabel: 'Infrastruktur',
    categoryIcon: 'construction',
    description: 'Lubang jalan sedalam 12cm di depan pusat pertokoan Cihampelas sudah ditambal dengan aspal hotmix baru dan diratakan. Arus lalu lintas kembali normal dan aman.',
    location: 'Jl. Cihampelas, Bandung',
    city: 'Bandung',
    lat: -6.8932,
    lng: 107.6045,
    mapTopPct: 22,
    mapLeftPct: 78,
    timeAgo: '3 Hari yang lalu',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: 'selesai',
    upvotes: 89,
    hasUpvoted: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwJRph6sfFILt6isCntY_ikP2Awvh53h1lah90xKwhpwV3WO8lWIasOKau4ML_JvlFw202bCxEMlAN3OwtJkEmb00wn8ctEASCUHXxMZm3W-p2z3yVCPPQb6WWp-ITHXhoNzq74iEkKs7gDTlnHHZO3vr9NfATBHtob3nDmcuwqPLqQExsNryDtWAObdbnJ4dGHYJ3IGFtLfB_7js3mqMQnhGghsT0lI94e_68ZmfMr4jA_BLy2fF9g',
    imageAlt: 'Jalan berlubang yang telah diperbaiki',
    reporterName: 'Fajar Hidayat',
    departmentAssigned: 'Dinas Sumber Daya Air dan Bina Marga (DSDABM)',
    priority: 'Sedang',
    updates: [
      {
        id: 'upd-301',
        date: '3 hari lalu',
        author: 'Fajar Hidayat',
        role: 'Pelapor',
        message: 'Laporan kerusakan jalan berlubang diunggah.'
      },
      {
        id: 'upd-302',
        date: '2 hari lalu',
        author: 'DSDABM Bandung',
        role: 'Admin Instansi',
        message: 'Penjadwalan unit tambal cepat (quick response unit).'
      },
      {
        id: 'upd-303',
        date: '1 hari lalu',
        author: 'Mandor Supardi',
        role: 'Pelaksana Proyek',
        message: 'Pengaspalan hotmix selesai 100% dan telah lolos uji kelayakan beban jalan.',
        statusChange: 'selesai'
      }
    ],
    comments: [
      {
        id: 'c-5',
        userName: 'Arief Kurniawan',
        timestamp: '1 hari lalu',
        content: 'Terima kasih atas respon cepatnya! Sekarang lewat Cihampelas sudah mulus.'
      }
    ]
  },
  {
    id: 'rep-04',
    title: 'Selokan Tersumbat Rawan Banjir',
    category: 'drainase',
    categoryLabel: 'Fasilitas Umum',
    categoryIcon: 'water_drop',
    description: 'Saluran air utama di kawasan Gubeng tersumbat sedimentasi lumpur tebal dan sampah botol plastik. Air meluap ke badan jalan saat hujan lebat turun selama 30 menit.',
    location: 'Gubeng, Surabaya',
    city: 'Surabaya',
    lat: -7.2731,
    lng: 112.7521,
    mapTopPct: 52,
    mapLeftPct: 74,
    timeAgo: '5 Jam yang lalu',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    status: 'baru',
    upvotes: 12,
    hasUpvoted: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZk0bpCla6hC9BfwKahestfAWIK6K3MSEDOOdUAR3qRC7sTWJOZkVpxO4WaQdbz7T6P3tuYRX2yE9iORQTH9teBIyxyGDEbOSBUWMFlM2JKBfSLFrsfr0CrOhXYgkneuQj40QCdWhkOFNTQKCMf0MP5zOmFg5LIQ7vz6gJ8hg8re6jcgIv246unBgUEjvVSSs70ex4yU6W7MtEvmZ9TK7RNpVh-w3_y0tbWgn0mVvvPDkl9SUDbA4cA',
    imageAlt: 'Selokan tersumbat sampah dan lumpur di Gubeng',
    reporterName: 'Dewi Lestari',
    departmentAssigned: 'Dinas Sumber Daya Air dan Bina Karya Surabaya',
    priority: 'Tinggi',
    updates: [
      {
        id: 'upd-401',
        date: '5 jam lalu',
        author: 'Dewi Lestari',
        role: 'Pelapor',
        message: 'Laporan dibuat dengan video dan foto genangan air.',
        statusChange: 'baru'
      }
    ],
    comments: [
      {
        id: 'c-6',
        userName: 'Bambang Tri',
        timestamp: '3 jam lalu',
        content: 'Kawasan ini langganan banjir kalau saluran tidak dikeruk sebelum musim hujan.'
      }
    ]
  },
  {
    id: 'rep-05',
    title: 'Trotoar Rusak Parah di Merdeka Walk',
    category: 'fasilitas',
    categoryLabel: 'Fasilitas Umum',
    categoryIcon: 'directions_walk',
    description: 'Paving block trotoar pedestrian terangkat dan hancur, membahayakan pejalan kaki serta lansia dan penyandang disabilitas. Telah diganti dengan guiding block baru yang kokoh.',
    location: 'Medan Barat, Medan',
    city: 'Medan',
    lat: 3.5852,
    lng: 98.6756,
    mapTopPct: 42,
    mapLeftPct: 24,
    timeAgo: '1 Minggu lalu',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: 'selesai',
    upvotes: 210,
    hasUpvoted: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gQqFQHEQO9HX3UCRwGaSP7MU4VgOee0yugmDuuAr14tRs3qRb88LovdflUICNqxBg3T9FPySoebOY6o9ik9eDZwP2xVQKoC90lUX-If4yFZ7NKelIjbA6RavMDooLQ3qrcc15jlRMhnsrE9OziQbGvGDmh0F-bqatoH4xJ1rOhVqflw9sNYjNxtbEw_5ugcIaxXPqgiLNybssn1eRuF_ET_JP6pzFcXyKbCdWKvjoV6arXypXvTwHw',
    imageAlt: 'Trotoar paving rusak di Merdeka Walk',
    reporterName: 'Willy Simanjuntak',
    departmentAssigned: 'Dinas SDABMBK Kota Medan',
    priority: 'Sedang',
    updates: [
      {
        id: 'upd-501',
        date: '1 minggu lalu',
        author: 'Willy Simanjuntak',
        role: 'Pelapor',
        message: 'Laporan trotoar rusak diunggah.'
      },
      {
        id: 'upd-502',
        date: '3 hari lalu',
        author: 'Dinas SDABMBK',
        role: 'Instansi',
        message: 'Pekerjaan revitalisasi trotoar dan u-ditch selesai diverifikasi.',
        statusChange: 'selesai'
      }
    ],
    comments: [
      {
        id: 'c-7',
        userName: 'Nadia Siregar',
        timestamp: '4 hari lalu',
        content: 'Sekarang jauh lebih nyaman dipakai jalan pagi dan akses kursi roda.'
      }
    ]
  },
  {
    id: 'rep-06',
    title: 'Tumpukan Sampah Liar Dekat Pasar',
    category: 'kebersihan',
    categoryLabel: 'Kebersihan',
    categoryIcon: 'delete',
    description: 'Pembuangan sampah liar tak berizin di pinggir pagar pembatas pasar tradisional. Sampah basah mulai membusuk dan mengundang lalat.',
    location: 'Pasar Baru, Jakarta Pusat',
    city: 'Jakarta',
    lat: -6.1667,
    lng: 106.8333,
    mapTopPct: 37,
    mapLeftPct: 61,
    timeAgo: '4 Jam yang lalu',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    status: 'baru',
    upvotes: 48,
    hasUpvoted: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGq1Q_0cnwztSLZqhQPsLfPSHc2DzMAa_ywWXqMYyXBz9thXqzOPtDrjUmkXba3p7RFiX1U7ZA3RxeyPSgaN_uZYyD50yruaTq0ctUeoxsmwbrG8q9B-Hqz_UHyVSnTF5Tmotn1oZQlsFs64K9cX5l1VJeyLw3-wBdN-ok7f599ki4D7YNZ8W49TDLF4WgouE0QkgCZtJ04l7PfQ1xrCxFc245sPCiLs5osVy0Qkepfe81ZiDRNsbVJg',
    imageAlt: 'Tumpukan sampah liar dekat pasar',
    reporterName: 'Ahmad Fauzi',
    departmentAssigned: 'Dinas Lingkungan Hidup DKI Jakarta',
    priority: 'Tinggi',
    updates: [
      {
        id: 'upd-601',
        date: '4 jam lalu',
        author: 'Ahmad Fauzi',
        role: 'Pelapor',
        message: 'Laporan diajukan beserta titik koordinat GPS.',
        statusChange: 'baru'
      }
    ],
    comments: [
      {
        id: 'c-8',
        userName: 'Ratna M',
        timestamp: '2 jam lalu',
        content: 'Butuh armada truk sampah tambahan dan pos jaga patroli.'
      }
    ]
  },
  {
    id: 'rep-07',
    title: 'Fasilitas Taman Bermain Anak Patah',
    category: 'ruang_hijau',
    categoryLabel: 'Ruang Hijau',
    categoryIcon: 'park',
    description: 'Ayunan dan perosotan di Ruang Publik Terpadu Ramah Anak (RPTRA) mengalami patah baut dan berkarat tajam. Sangat berisiko bagi anak-anak yang bermain.',
    location: 'Taman Suropati, Menteng, Jakarta',
    city: 'Jakarta',
    lat: -6.1994,
    lng: 106.8326,
    mapTopPct: 56,
    mapLeftPct: 58,
    timeAgo: '2 Hari yang lalu',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'diproses',
    upvotes: 95,
    hasUpvoted: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gQqFQHEQO9HX3UCRwGaSP7MU4VgOee0yugmDuuAr14tRs3qRb88LovdflUICNqxBg3T9FPySoebOY6o9ik9eDZwP2xVQKoC90lUX-If4yFZ7NKelIjbA6RavMDooLQ3qrcc15jlRMhnsrE9OziQbGvGDmh0F-bqatoH4xJ1rOhVqflw9sNYjNxtbEw_5ugcIaxXPqgiLNybssn1eRuF_ET_JP6pzFcXyKbCdWKvjoV6arXypXvTwHw',
    imageAlt: 'Fasilitas bermain anak rusak di taman publik',
    reporterName: 'Citra Wulandari',
    departmentAssigned: 'Dinas Pertamanan dan Hutan Kota DKI',
    priority: 'Sedang',
    updates: [
      {
        id: 'upd-701',
        date: '2 hari lalu',
        author: 'Citra Wulandari',
        role: 'Pelapor',
        message: 'Laporan diunggah.'
      },
      {
        id: 'upd-702',
        date: '1 hari lalu',
        author: 'Dinas Pertamanan',
        role: 'Instansi',
        message: 'Pemasangan garis pengaman sementara dan pemesanan sparepart ayunan baru.',
        statusChange: 'diproses'
      }
    ],
    comments: [
      {
        id: 'c-9',
        userName: 'Ibu Henny',
        timestamp: '1 hari lalu',
        content: 'Bagus sudah dipasang safety line sementara. Semoga cepat diganti baru.'
      }
    ]
  },
  {
    id: 'rep-08',
    title: 'Drainase Utama Tersumbat Kayu Proyek',
    category: 'drainase',
    categoryLabel: 'Drainase',
    categoryIcon: 'water_drop',
    description: 'Sisa material kayu dan semen dari proyek ruko menutupi mulut gorong-gorong drainase selebar 2 meter, memicu genangan air setinggi 20cm di jalan raya.',
    location: 'Cilandak, Jakarta Selatan',
    city: 'Jakarta',
    lat: -6.2912,
    lng: 106.7994,
    mapTopPct: 76,
    mapLeftPct: 53,
    timeAgo: '6 Jam yang lalu',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    status: 'diproses',
    upvotes: 132,
    hasUpvoted: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZk0bpCla6hC9BfwKahestfAWIK6K3MSEDOOdUAR3qRC7sTWJOZkVpxO4WaQdbz7T6P3tuYRX2yE9iORQTH9teBIyxyGDEbOSBUWMFlM2JKBfSLFrsfr0CrOhXYgkneuQj40QCdWhkOFNTQKCMf0MP5zOmFg5LIQ7vz6gJ8hg8re6jcgIv246unBgUEjvVSSs70ex4yU6W7MtEvmZ9TK7RNpVh-w3_y0tbWgn0mVvvPDkl9SUDbA4cA',
    imageAlt: 'Gorong-gorong tersumbat sisa proyek',
    reporterName: 'Irvan Maulana',
    departmentAssigned: 'Dinas Sumber Daya Air DKI Jakarta',
    priority: 'Tinggi',
    updates: [
      {
        id: 'upd-801',
        date: '6 jam lalu',
        author: 'Irvan Maulana',
        role: 'Pelapor',
        message: 'Laporan dikirim.'
      },
      {
        id: 'upd-802',
        date: '3 jam lalu',
        author: 'Satgas Pasukan Biru SDA',
        role: 'Petugas Lapangan',
        message: 'Eskavator mini dan tim satgas biru telah tiba di lokasi untuk mengangkat sumbatan kayu.',
        statusChange: 'diproses'
      }
    ],
    comments: [
      {
        id: 'c-10',
        userName: 'Dedi Setiawan',
        timestamp: '2 jam lalu',
        content: 'Mantap respon cepat Pasukan Biru! Tolong tegur kontraktornya juga.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'notif-1',
    title: 'Petugas Lapangan Ditugaskan',
    message: 'Laporan Anda "Lampu Jalan Padam di Tebet Timur" sedang ditangani oleh Tim Dinas Bina Marga.',
    timeAgo: '10 menit lalu',
    isRead: false,
    reportId: 'rep-02',
    type: 'official_reply'
  },
  {
    id: 'notif-2',
    title: 'Status Laporan Selesai',
    message: 'Laporan "Jalan Berlubang di Cihampelas" telah dinyatakan SELESAI dan lolos verifikasi warga.',
    timeAgo: '1 jam lalu',
    isRead: false,
    reportId: 'rep-03',
    type: 'status'
  },
  {
    id: 'notif-3',
    title: 'Upvote Baru Masuk',
    message: '24 warga mendukung laporan "Sampah Menumpuk di Jl. Malioboro".',
    timeAgo: '2 jam lalu',
    isRead: true,
    reportId: 'rep-01',
    type: 'upvote'
  }
];

export const CITY_STATS = [
  { city: 'Jakarta', totalReports: 1420, resolved: 1180, inProgress: 185, newReports: 55, avgResponseHours: 14 },
  { city: 'Bandung', totalReports: 890, resolved: 740, inProgress: 110, newReports: 40, avgResponseHours: 18 },
  { city: 'Yogyakarta', totalReports: 620, resolved: 530, inProgress: 65, newReports: 25, avgResponseHours: 12 },
  { city: 'Surabaya', totalReports: 1150, resolved: 980, inProgress: 120, newReports: 50, avgResponseHours: 16 },
  { city: 'Medan', totalReports: 780, resolved: 610, inProgress: 125, newReports: 45, avgResponseHours: 22 }
];
