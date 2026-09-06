export interface CityConfig {
  name: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

// Titik tengah & level zoom awal untuk masing-masing kota yang didukung LaporKota.
// Dipakai bareng-bareng oleh MapView (peta interaktif) dan CreateReportView (form lapor).
export const CITIES: CityConfig[] = [
  { name: 'Jakarta', center: [-6.2088, 106.8456], zoom: 12 },
  { name: 'Bandung', center: [-6.9175, 107.6191], zoom: 12 },
  { name: 'Yogyakarta', center: [-7.7956, 110.3695], zoom: 13 },
  { name: 'Surabaya', center: [-7.2575, 112.7521], zoom: 12 },
  { name: 'Medan', center: [3.5952, 98.6722], zoom: 12 },
];

export const DEFAULT_CITY = CITIES[0];

// Cari kota terdekat dari sebuah titik koordinat (dipakai saat user klik sembarang titik di peta gabungan)
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
