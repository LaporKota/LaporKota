export interface CityConfig {
  name: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

// Daftar kota yang didukung LaporKota — mencakup ibu kota SEMUA 38 provinsi Indonesia
// plus sejumlah kota besar lain yang sering jadi lokasi laporan warga.
// Dipakai bareng-bareng oleh MapView (peta interaktif, tab kota & city-tabs) dan
// CreateReportView (form lapor — datalist "Kota", biar tetap bisa ketik bebas kalau
// kotanya belum ada di daftar ini).
export const CITIES: CityConfig[] = [
  // === Ibu kota provinsi (38 provinsi) ===
  { name: 'Banda Aceh', center: [5.5483, 95.3238], zoom: 12 }, // Aceh
  { name: 'Medan', center: [3.5952, 98.6722], zoom: 12 }, // Sumatera Utara
  { name: 'Padang', center: [-0.9471, 100.4172], zoom: 12 }, // Sumatera Barat
  { name: 'Pekanbaru', center: [0.5071, 101.4478], zoom: 12 }, // Riau
  { name: 'Tanjungpinang', center: [0.9186, 104.4562], zoom: 12 }, // Kepulauan Riau
  { name: 'Jambi', center: [-1.6101, 103.6131], zoom: 12 }, // Jambi
  { name: 'Palembang', center: [-2.9909, 104.7566], zoom: 12 }, // Sumatera Selatan
  { name: 'Pangkalpinang', center: [-2.1316, 106.1169], zoom: 12 }, // Bangka Belitung
  { name: 'Bengkulu', center: [-3.7928, 102.2608], zoom: 12 }, // Bengkulu
  { name: 'Bandar Lampung', center: [-5.4292, 105.2610], zoom: 12 }, // Lampung
  { name: 'Jakarta', center: [-6.2088, 106.8456], zoom: 12 }, // DKI Jakarta
  { name: 'Bandung', center: [-6.9175, 107.6191], zoom: 12 }, // Jawa Barat
  { name: 'Serang', center: [-6.1149, 106.1503], zoom: 12 }, // Banten
  { name: 'Semarang', center: [-6.9932, 110.4203], zoom: 12 }, // Jawa Tengah
  { name: 'Yogyakarta', center: [-7.7956, 110.3695], zoom: 13 }, // DI Yogyakarta
  { name: 'Surabaya', center: [-7.2575, 112.7521], zoom: 12 }, // Jawa Timur
  { name: 'Denpasar', center: [-8.6705, 115.2126], zoom: 13 }, // Bali
  { name: 'Mataram', center: [-8.5833, 116.1167], zoom: 12 }, // Nusa Tenggara Barat
  { name: 'Kupang', center: [-10.1772, 123.6070], zoom: 12 }, // Nusa Tenggara Timur
  { name: 'Pontianak', center: [-0.0263, 109.3425], zoom: 12 }, // Kalimantan Barat
  { name: 'Palangkaraya', center: [-2.2090, 113.9213], zoom: 12 }, // Kalimantan Tengah
  { name: 'Banjarmasin', center: [-3.3186, 114.5944], zoom: 12 }, // Kalimantan Selatan
  { name: 'Samarinda', center: [-0.5022, 117.1536], zoom: 12 }, // Kalimantan Timur
  { name: 'Tanjung Selor', center: [2.8383, 117.3672], zoom: 12 }, // Kalimantan Utara
  { name: 'Manado', center: [1.4748, 124.8421], zoom: 12 }, // Sulawesi Utara
  { name: 'Gorontalo', center: [0.5412, 123.0595], zoom: 12 }, // Gorontalo
  { name: 'Palu', center: [-0.8983, 119.8707], zoom: 12 }, // Sulawesi Tengah
  { name: 'Mamuju', center: [-2.6785, 118.8887], zoom: 12 }, // Sulawesi Barat
  { name: 'Makassar', center: [-5.1477, 119.4327], zoom: 12 }, // Sulawesi Selatan
  { name: 'Kendari', center: [-3.9450, 122.4989], zoom: 12 }, // Sulawesi Tenggara
  { name: 'Ambon', center: [-3.6954, 128.1814], zoom: 12 }, // Maluku
  { name: 'Ternate', center: [0.7833, 127.3833], zoom: 12 }, // Maluku Utara
  { name: 'Jayapura', center: [-2.5337, 140.7181], zoom: 12 }, // Papua
  { name: 'Manokwari', center: [-0.8615, 134.0620], zoom: 12 }, // Papua Barat
  { name: 'Sorong', center: [-0.8762, 131.2558], zoom: 12 }, // Papua Barat Daya
  { name: 'Nabire', center: [-3.3667, 135.4833], zoom: 12 }, // Papua Tengah
  { name: 'Wamena', center: [-4.0847, 138.9386], zoom: 12 }, // Papua Pegunungan
  { name: 'Merauke', center: [-8.4667, 140.4000], zoom: 12 }, // Papua Selatan

  // === Kota besar lain yang sering jadi lokasi laporan ===
  { name: 'Bekasi', center: [-6.2349, 106.9896], zoom: 12 },
  { name: 'Depok', center: [-6.4025, 106.7942], zoom: 12 },
  { name: 'Tangerang', center: [-6.1783, 106.6319], zoom: 12 },
  { name: 'Tangerang Selatan', center: [-6.2884, 106.7186], zoom: 12 },
  { name: 'Bogor', center: [-6.5971, 106.8060], zoom: 12 },
  { name: 'Cimahi', center: [-6.8841, 107.5420], zoom: 12 },
  { name: 'Cirebon', center: [-6.7063, 108.5571], zoom: 12 },
  { name: 'Sukabumi', center: [-6.9278, 106.9271], zoom: 12 },
  { name: 'Tasikmalaya', center: [-7.3506, 108.2172], zoom: 12 },
  { name: 'Surakarta (Solo)', center: [-7.5755, 110.8243], zoom: 13 },
  { name: 'Magelang', center: [-7.4707, 110.2177], zoom: 12 },
  { name: 'Salatiga', center: [-7.3305, 110.5084], zoom: 12 },
  { name: 'Tegal', center: [-6.8694, 109.1402], zoom: 12 },
  { name: 'Pekalongan', center: [-6.8886, 109.6753], zoom: 12 },
  { name: 'Malang', center: [-7.9666, 112.6326], zoom: 12 },
  { name: 'Batu', center: [-7.8706, 112.5239], zoom: 13 },
  { name: 'Kediri', center: [-7.8480, 112.0178], zoom: 12 },
  { name: 'Madiun', center: [-7.6298, 111.5239], zoom: 12 },
  { name: 'Mojokerto', center: [-7.4664, 112.4335], zoom: 12 },
  { name: 'Pasuruan', center: [-7.6453, 112.9075], zoom: 12 },
  { name: 'Probolinggo', center: [-7.7543, 113.2159], zoom: 12 },
  { name: 'Blitar', center: [-8.0955, 112.1679], zoom: 12 },
  { name: 'Batam', center: [1.0456, 104.0305], zoom: 12 },
  { name: 'Dumai', center: [1.6667, 101.4500], zoom: 12 },
  { name: 'Bukittinggi', center: [-0.3057, 100.3692], zoom: 12 },
  { name: 'Payakumbuh', center: [-0.2168, 100.6335], zoom: 12 },
  { name: 'Padangsidimpuan', center: [1.3781, 99.2683], zoom: 12 },
  { name: 'Binjai', center: [3.6001, 98.4854], zoom: 12 },
  { name: 'Pematangsiantar', center: [2.9595, 99.0687], zoom: 12 },
  { name: 'Tebing Tinggi', center: [3.3284, 99.1623], zoom: 12 },
  { name: 'Gunungsitoli', center: [1.2914, 97.6136], zoom: 12 },
  { name: 'Sibolga', center: [1.7427, 98.7792], zoom: 12 },
  { name: 'Lubuklinggau', center: [-3.2967, 102.8617], zoom: 12 },
  { name: 'Prabumulih', center: [-3.4342, 104.2359], zoom: 12 },
  { name: 'Lhokseumawe', center: [5.1801, 97.1507], zoom: 12 },
  { name: 'Metro', center: [-5.1131, 105.3067], zoom: 12 },
  { name: 'Cilegon', center: [-6.0025, 106.0106], zoom: 12 },
  { name: 'Singkawang', center: [0.9053, 108.9856], zoom: 12 },
  { name: 'Balikpapan', center: [-1.2379, 116.8529], zoom: 12 },
  { name: 'Tarakan', center: [3.3285, 117.5885], zoom: 12 },
  { name: 'Bitung', center: [1.4451, 125.1911], zoom: 12 },
  { name: 'Palopo', center: [-2.9925, 120.1969], zoom: 12 },
  { name: 'Parepare', center: [-4.0135, 119.6255], zoom: 12 },
  { name: 'Bau-Bau', center: [-5.4614, 122.6220], zoom: 12 },
  { name: 'Bima', center: [-8.4667, 118.7167], zoom: 12 },
];

export const DEFAULT_CITY = CITIES[0];

// Cari kota (dari daftar di atas) yang PUSATNYA paling dekat dengan sebuah titik koordinat.
// Ini cuma fallback kasar (dipakai kalau reverse-geocoding gagal mengembalikan nama kota) —
// jalur utama untuk deteksi kota tetap lewat hasil reverse-geocode di utils/geo.ts, supaya
// kota di LUAR daftar ini pun (desa/kecamatan kecil) tetap ketulis nama aslinya, bukan
// "dipaksa" jadi salah satu dari kota-kota di atas.
export function findNearestCity(lat: number, lng: number): CityConfig {
  let nearest = CITIES[0];
  let minDist = Infinity;
  for (const city of CITIES) {
    const dLat = city.center[0] - lat;
    const dLng = city.center[1] - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest;
}
