export interface CityConfig {
  name: string;
  province: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

// Urutan provinsi (barat ke timur) — dipakai untuk render daftar provinsi di dropdown peta
export const PROVINCE_ORDER: string[] = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Kepulauan Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Barat Daya',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
];

// Daftar kota yang didukung LaporKota — mencakup ibu kota SEMUA 38 provinsi Indonesia
// plus sejumlah kota besar lain yang sering jadi lokasi laporan warga.
// Dipakai bareng-bareng oleh MapView (peta interaktif, filter per-provinsi & per-kota) dan
// CreateReportView (form lapor — datalist "Kota", biar tetap bisa ketik bebas kalau
// kotanya belum ada di daftar ini).
export const CITIES: CityConfig[] = [
  // === Ibu kota provinsi (38 provinsi) ===
  { name: 'Banda Aceh', province: 'Aceh', center: [5.5483, 95.3238], zoom: 12 },
  { name: 'Medan', province: 'Sumatera Utara', center: [3.5952, 98.6722], zoom: 12 },
  { name: 'Padang', province: 'Sumatera Barat', center: [-0.9471, 100.4172], zoom: 12 },
  { name: 'Pekanbaru', province: 'Riau', center: [0.5071, 101.4478], zoom: 12 },
  { name: 'Tanjungpinang', province: 'Kepulauan Riau', center: [0.9186, 104.4562], zoom: 12 },
  { name: 'Jambi', province: 'Jambi', center: [-1.6101, 103.6131], zoom: 12 },
  { name: 'Palembang', province: 'Sumatera Selatan', center: [-2.9909, 104.7566], zoom: 12 },
  { name: 'Pangkalpinang', province: 'Kepulauan Bangka Belitung', center: [-2.1316, 106.1169], zoom: 12 },
  { name: 'Bengkulu', province: 'Bengkulu', center: [-3.7928, 102.2608], zoom: 12 },
  { name: 'Bandar Lampung', province: 'Lampung', center: [-5.4292, 105.2610], zoom: 12 },
  { name: 'Jakarta', province: 'DKI Jakarta', center: [-6.2088, 106.8456], zoom: 12 },
  { name: 'Bandung', province: 'Jawa Barat', center: [-6.9175, 107.6191], zoom: 12 },
  { name: 'Serang', province: 'Banten', center: [-6.1149, 106.1503], zoom: 12 },
  { name: 'Semarang', province: 'Jawa Tengah', center: [-6.9932, 110.4203], zoom: 12 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', center: [-7.7956, 110.3695], zoom: 13 },
  { name: 'Surabaya', province: 'Jawa Timur', center: [-7.2575, 112.7521], zoom: 12 },
  { name: 'Denpasar', province: 'Bali', center: [-8.6705, 115.2126], zoom: 13 },
  { name: 'Mataram', province: 'Nusa Tenggara Barat', center: [-8.5833, 116.1167], zoom: 12 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', center: [-10.1772, 123.6070], zoom: 12 },
  { name: 'Pontianak', province: 'Kalimantan Barat', center: [-0.0263, 109.3425], zoom: 12 },
  { name: 'Palangkaraya', province: 'Kalimantan Tengah', center: [-2.2090, 113.9213], zoom: 12 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', center: [-3.3186, 114.5944], zoom: 12 },
  { name: 'Samarinda', province: 'Kalimantan Timur', center: [-0.5022, 117.1536], zoom: 12 },
  { name: 'Tanjung Selor', province: 'Kalimantan Utara', center: [2.8383, 117.3672], zoom: 12 },
  { name: 'Manado', province: 'Sulawesi Utara', center: [1.4748, 124.8421], zoom: 12 },
  { name: 'Gorontalo', province: 'Gorontalo', center: [0.5412, 123.0595], zoom: 12 },
  { name: 'Palu', province: 'Sulawesi Tengah', center: [-0.8983, 119.8707], zoom: 12 },
  { name: 'Mamuju', province: 'Sulawesi Barat', center: [-2.6785, 118.8887], zoom: 12 },
  { name: 'Makassar', province: 'Sulawesi Selatan', center: [-5.1477, 119.4327], zoom: 12 },
  { name: 'Kendari', province: 'Sulawesi Tenggara', center: [-3.9450, 122.4989], zoom: 12 },
  { name: 'Ambon', province: 'Maluku', center: [-3.6954, 128.1814], zoom: 12 },
  { name: 'Ternate', province: 'Maluku Utara', center: [0.7833, 127.3833], zoom: 12 },
  { name: 'Jayapura', province: 'Papua', center: [-2.5337, 140.7181], zoom: 12 },
  { name: 'Manokwari', province: 'Papua Barat', center: [-0.8615, 134.0620], zoom: 12 },
  { name: 'Sorong', province: 'Papua Barat Daya', center: [-0.8762, 131.2558], zoom: 12 },
  { name: 'Nabire', province: 'Papua Tengah', center: [-3.3667, 135.4833], zoom: 12 },
  { name: 'Wamena', province: 'Papua Pegunungan', center: [-4.0847, 138.9386], zoom: 12 },
  { name: 'Merauke', province: 'Papua Selatan', center: [-8.4667, 140.4000], zoom: 12 },

  // === Kota besar lain yang sering jadi lokasi laporan ===
  { name: 'Bekasi', province: 'Jawa Barat', center: [-6.2349, 106.9896], zoom: 12 },
  { name: 'Depok', province: 'Jawa Barat', center: [-6.4025, 106.7942], zoom: 12 },
  { name: 'Tangerang', province: 'Banten', center: [-6.1783, 106.6319], zoom: 12 },
  { name: 'Tangerang Selatan', province: 'Banten', center: [-6.2884, 106.7186], zoom: 12 },
  { name: 'Bogor', province: 'Jawa Barat', center: [-6.5971, 106.8060], zoom: 12 },
  { name: 'Cimahi', province: 'Jawa Barat', center: [-6.8841, 107.5420], zoom: 12 },
  { name: 'Cirebon', province: 'Jawa Barat', center: [-6.7063, 108.5571], zoom: 12 },
  { name: 'Sukabumi', province: 'Jawa Barat', center: [-6.9278, 106.9271], zoom: 12 },
  { name: 'Tasikmalaya', province: 'Jawa Barat', center: [-7.3506, 108.2172], zoom: 12 },
  { name: 'Surakarta (Solo)', province: 'Jawa Tengah', center: [-7.5755, 110.8243], zoom: 13 },
  { name: 'Magelang', province: 'Jawa Tengah', center: [-7.4707, 110.2177], zoom: 12 },
  { name: 'Salatiga', province: 'Jawa Tengah', center: [-7.3305, 110.5084], zoom: 12 },
  { name: 'Tegal', province: 'Jawa Tengah', center: [-6.8694, 109.1402], zoom: 12 },
  { name: 'Pekalongan', province: 'Jawa Tengah', center: [-6.8886, 109.6753], zoom: 12 },
  { name: 'Malang', province: 'Jawa Timur', center: [-7.9666, 112.6326], zoom: 12 },
  { name: 'Batu', province: 'Jawa Timur', center: [-7.8706, 112.5239], zoom: 13 },
  { name: 'Kediri', province: 'Jawa Timur', center: [-7.8480, 112.0178], zoom: 12 },
  { name: 'Madiun', province: 'Jawa Timur', center: [-7.6298, 111.5239], zoom: 12 },
  { name: 'Mojokerto', province: 'Jawa Timur', center: [-7.4664, 112.4335], zoom: 12 },
  { name: 'Pasuruan', province: 'Jawa Timur', center: [-7.6453, 112.9075], zoom: 12 },
  { name: 'Probolinggo', province: 'Jawa Timur', center: [-7.7543, 113.2159], zoom: 12 },
  { name: 'Blitar', province: 'Jawa Timur', center: [-8.0955, 112.1679], zoom: 12 },
  { name: 'Batam', province: 'Kepulauan Riau', center: [1.0456, 104.0305], zoom: 12 },
  { name: 'Dumai', province: 'Riau', center: [1.6667, 101.4500], zoom: 12 },
  { name: 'Bukittinggi', province: 'Sumatera Barat', center: [-0.3057, 100.3692], zoom: 12 },
  { name: 'Payakumbuh', province: 'Sumatera Barat', center: [-0.2168, 100.6335], zoom: 12 },
  { name: 'Padangsidimpuan', province: 'Sumatera Utara', center: [1.3781, 99.2683], zoom: 12 },
  { name: 'Binjai', province: 'Sumatera Utara', center: [3.6001, 98.4854], zoom: 12 },
  { name: 'Pematangsiantar', province: 'Sumatera Utara', center: [2.9595, 99.0687], zoom: 12 },
  { name: 'Tebing Tinggi', province: 'Sumatera Utara', center: [3.3284, 99.1623], zoom: 12 },
  { name: 'Gunungsitoli', province: 'Sumatera Utara', center: [1.2914, 97.6136], zoom: 12 },
  { name: 'Sibolga', province: 'Sumatera Utara', center: [1.7427, 98.7792], zoom: 12 },
  { name: 'Lubuklinggau', province: 'Sumatera Selatan', center: [-3.2967, 102.8617], zoom: 12 },
  { name: 'Prabumulih', province: 'Sumatera Selatan', center: [-3.4342, 104.2359], zoom: 12 },
  { name: 'Lhokseumawe', province: 'Aceh', center: [5.1801, 97.1507], zoom: 12 },
  { name: 'Metro', province: 'Lampung', center: [-5.1131, 105.3067], zoom: 12 },
  { name: 'Cilegon', province: 'Banten', center: [-6.0025, 106.0106], zoom: 12 },
  { name: 'Singkawang', province: 'Kalimantan Barat', center: [0.9053, 108.9856], zoom: 12 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', center: [-1.2379, 116.8529], zoom: 12 },
  { name: 'Tarakan', province: 'Kalimantan Utara', center: [3.3285, 117.5885], zoom: 12 },
  { name: 'Bitung', province: 'Sulawesi Utara', center: [1.4451, 125.1911], zoom: 12 },
  { name: 'Palopo', province: 'Sulawesi Selatan', center: [-2.9925, 120.1969], zoom: 12 },
  { name: 'Parepare', province: 'Sulawesi Selatan', center: [-4.0135, 119.6255], zoom: 12 },
  { name: 'Bau-Bau', province: 'Sulawesi Tenggara', center: [-5.4614, 122.6220], zoom: 12 },
  { name: 'Bima', province: 'Nusa Tenggara Barat', center: [-8.4667, 118.7167], zoom: 12 },
];

export const DEFAULT_CITY = CITIES[0];

// Ambil semua kota dalam satu provinsi (urutan sesuai urutan di CITIES)
export function getCitiesByProvince(province: string): CityConfig[] {
  return CITIES.filter((c) => c.province === province);
}

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
