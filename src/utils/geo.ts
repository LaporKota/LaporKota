import L from 'leaflet';

// Kotak pembatas kasar wilayah Indonesia (dipakai untuk membatasi peta —
// bukan bentuk negara yang presisi, makanya negara tetangga seperti Malaysia/
// Singapura/Timor-Leste/PNG masih ikut "kepotong" di dalam kotak ini).
export const INDONESIA_BOUNDS = L.latLngBounds([-11.5, 94.0], [6.5, 141.5]);

export interface GeocodeResult {
  address: string;
  countryCode: string | null;
  isIndonesia: boolean;
  // Nama kota/kabupaten asli hasil reverse-geocode (kalau OSM punya datanya) — dipakai
  // supaya field "Kota" tidak dipaksa jadi salah satu dari daftar kota kita, dan tetap
  // benar untuk kota/kabupaten mana pun di Indonesia.
  cityGuess: string | null;
}

// Reverse geocoding gratis via Nominatim (OpenStreetMap) — berjalan langsung
// di browser pengguna, tidak butuh API key. Mengembalikan alamat lengkap
// (jalan/kelurahan/kecamatan/kota — sesuai detail yang tersedia di data OSM
// untuk titik tsb) sekaligus kode negaranya, supaya kita bisa validasi titik
// itu benar-benar di Indonesia atau bukan.
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const fallback: GeocodeResult = {
    address: `Titik terpilih (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    countryCode: null,
    isIndonesia: true, // gagal geocoding jangan langsung diblokir — anggap valid, biar user tetap bisa lanjut
    cityGuess: null,
  };

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return fallback;

    const data = await res.json();
    const countryCode: string | null = data?.address?.country_code || null;
    const addr = data?.address || {};
    // Urutan prioritas field kota/kabupaten dari Nominatim (beda daerah, beda field yang keisi)
    const cityGuess: string | null =
      addr.city || addr.town || addr.municipality || addr.regency || addr.county || addr.city_district || null;

    return {
      address: data?.display_name || fallback.address,
      countryCode,
      isIndonesia: countryCode ? countryCode.toLowerCase() === 'id' : true,
      cityGuess,
    };
  } catch {
    // Diamkan saja kalau reverse geocoding gagal (misal offline) — fallback ke koordinat sudah cukup
    return fallback;
  }
}

export interface GeoPosition {
  lat: number;
  lng: number;
}

// Satu kali percobaan mentah ke Geolocation API browser.
function requestPositionOnce(options: PositionOptions): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      options
    );
  });
}

// Bungkus Geolocation API browser (callback-based) jadi Promise supaya gampang dipakai dengan async/await,
// plus pesan error dalam Bahasa Indonesia yang jelas untuk tiap kasus gagal.
//
// Ada auto-retry SEKALI secara diam-diam kalau percobaan pertama gagal (kecuali izin memang ditolak).
// Ini buat nutupin "cold start" GPS/WiFi-positioning: begitu user baru kasih izin lokasi, percobaan
// pertama sering gagal/timeout karena browser belum sempat dapat sinyal, padahal detik berikutnya
// biasanya langsung berhasil. Daripada user harus klik ulang manual, kita coba ulang sendiri dulu.
export async function getCurrentPosition(): Promise<GeoPosition> {
  if (!('geolocation' in navigator)) {
    throw new Error('Browser Anda tidak mendukung deteksi lokasi otomatis. Silakan pilih lokasi lewat peta atau isi manual.');
  }

  const options: PositionOptions = { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 };

  try {
    return await requestPositionOnce(options);
  } catch (err: any) {
    // Izin ditolak itu pasti gagal lagi kalau dicoba ulang — langsung lempar error, jangan retry.
    if (err?.code === err?.PERMISSION_DENIED) {
      throw new Error('Akses lokasi ditolak. Aktifkan izin lokasi di browser untuk memakai fitur ini, atau pilih lokasi lewat peta.');
    }

    // Retry sekali setelah jeda singkat — kasih waktu GPS/WiFi-positioning "pemanasan"
    await new Promise((r) => setTimeout(r, 800));
    try {
      return await requestPositionOnce(options);
    } catch (err2: any) {
      // Log detail ke console (F12 > Console) supaya gampang didiagnosis kalau masih gagal terus —
      // kode 2 = POSITION_UNAVAILABLE (backend lokasi browser/OS gagal nentuin posisi),
      // kode 3 = TIMEOUT (kelamaan nunggu, jaringan/GPS lambat).
      console.error('Geolocation gagal setelah retry:', { code: err2?.code, message: err2?.message });

      if (err2?.code === err2?.TIMEOUT) {
        throw new Error(
          'Deteksi lokasi kelamaan (timeout). Coba lagi sebentar lagi, atau pilih lokasi lewat peta / isi manual.'
        );
      }
      if (err2?.code === err2?.POSITION_UNAVAILABLE) {
        throw new Error(
          'Perangkat/browser tidak bisa menentukan posisi Anda saat ini (layanan lokasi OS mungkin nonaktif). Silakan pilih lokasi lewat peta atau isi manual.'
        );
      }
      throw new Error('Gagal mendapatkan lokasi Anda. Coba lagi, atau pilih lokasi lewat peta / isi manual.');
    }
  }
}
