import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, ReportCategory, ReportStatus } from '../types';
import { CITIES, PROVINCE_ORDER, getCitiesByProvince, findNearestCity } from '../data/cities';
import { ReportLocationPrefill } from './CreateReportView';
import { INDONESIA_BOUNDS, reverseGeocode, getCurrentPosition } from '../utils/geo';

interface MapViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onCreateReportAt: (prefill: ReportLocationPrefill | null) => void;
}

// Style & ikon marker per kategori laporan (dipakai bareng untuk legenda & pin di peta)
// Warna disamakan urutan & labelnya dengan dropdown "Pilih Kategori" di form Buat Laporan.
const CATEGORY_STYLE: Record<string, { color: string; icon: string; label: string }> = {
  kebersihan: { color: '#e11d48', icon: 'delete', label: 'Sampah & Kebersihan' },
  ruang_hijau: { color: '#16a34a', icon: 'park', label: 'Ruang Hijau & Taman' },
  infrastruktur: { color: '#0d9488', icon: 'construction', label: 'Infrastruktur Jalan' },
  penerangan: { color: '#f59e0b', icon: 'lightbulb', label: 'Penerangan Jalan (PJU)' },
  drainase: { color: '#0284c7', icon: 'water_drop', label: 'Drainase & Saluran Air' },
  fasilitas: { color: '#7c3aed', icon: 'directions_walk', label: 'Fasilitas Umum & Trotoar' },
  lainnya: { color: '#64748b', icon: 'info', label: 'Lainnya' },
};

// Urutan kategori yang dipakai untuk render daftar Legenda di peta
const LEGEND_ORDER: ReportCategory[] = [
  'kebersihan',
  'ruang_hijau',
  'infrastruktur',
  'penerangan',
  'drainase',
  'fasilitas',
  'lainnya',
];

function getCategoryStyle(cat: ReportCategory) {
  return CATEGORY_STYLE[cat] || CATEGORY_STYLE.lainnya;
}

// Bikin divIcon custom (bukan icon default Leaflet) supaya konsisten dengan gaya visual LaporKota
function buildMarkerIcon(cat: ReportCategory) {
  const style = getCategoryStyle(cat);
  return L.divIcon({
    className: 'laporkota-marker',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="background:${style.color};border:2px solid white;border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.4);">
          <span class="material-symbols-outlined" style="color:white;font-size:16px;">${style.icon}</span>
        </div>
        <div style="width:2px;height:10px;background:#1a1a1a;"></div>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
}

const tempMarkerIcon = L.divIcon({
  className: 'laporkota-temp-marker',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="background:#e11d48;color:white;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:700;white-space:nowrap;margin-bottom:2px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">TITIK DIPILIH</div>
      <div style="background:#0d9488;border:2px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [90, 50],
  iconAnchor: [45, 30],
});

// Pin "ANDA DI SINI" — nempel terus di peta (beda dari tempMarkerIcon yang cuma titik sementara
// sebelum lompat ke form). Dibuat dengan efek denyut (pulse) biar gampang dikenali.
const myLocationMarkerIcon = L.divIcon({
  className: 'laporkota-my-location-marker',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="background:#2563eb;color:white;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:700;white-space:nowrap;margin-bottom:2px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">ANDA DI SINI</div>
      <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
        <div class="laporkota-pulse-ring" style="position:absolute;width:22px;height:22px;border-radius:50%;background:#2563eb;opacity:0.4;"></div>
        <div style="position:relative;background:#2563eb;border:2px solid white;border-radius:50%;width:14px;height:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
      </div>
    </div>
    <style>
      @keyframes laporkota-pulse { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
      .laporkota-pulse-ring { animation: laporkota-pulse 1.6s ease-out infinite; }
    </style>
  `,
  iconSize: [90, 50],
  iconAnchor: [45, 30],
  popupAnchor: [0, -40],
});

// Reposisi & zoom ulang peta setiap kali kota yang dipilih berubah.
// Kalau `bounds` diisi (mode "Semua Kota"), peta akan fit ke seluruh wilayah Indonesia.
const FlyToCity: React.FC<{ center: [number, number]; zoom: number; bounds?: L.LatLngBounds }> = ({
  center,
  zoom,
  bounds,
}) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { duration: 0.8 });
    } else {
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [center[0], center[1], zoom, bounds]);
  return null;
};

// Tangkap klik pada area kosong peta untuk memulai laporan baru di titik tersebut
const ClickToReport: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Terbang ke titik lokasi pengguna (dari tombol "Lokasi Saya") setiap kali titiknya berubah
const FlyToPoint: React.FC<{ point: { lat: number; lng: number } | null }> = ({ point }) => {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], 15, { duration: 1 });
    }
  }, [point?.lat, point?.lng]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ reports, onSelectReport, onCreateReportAt }) => {
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | ReportStatus>('all');
  const [selectedCityName, setSelectedCityName] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number; address: string; city: string } | null>(
    null
  );
  const [isGettingGeo, setIsGettingGeo] = useState(false);

  const selectedCity = CITIES.find((c) => c.name === selectedCityName) || null;
  const provinceCities = useMemo(
    () => (selectedProvince ? getCitiesByProvince(selectedProvince) : []),
    [selectedProvince]
  );

  // Kalau provinsi yang dipilih cuma punya 1 kota di daftar kita, langsung pakai titik kota itu.
  // Kalau lebih dari 1, peta akan di-fit ke gabungan semua kota di provinsi tsb (lihat provinceBounds).
  const singleProvinceCity = selectedProvince && provinceCities.length === 1 ? provinceCities[0] : null;

  const provinceBounds = useMemo(() => {
    if (!selectedProvince || provinceCities.length < 2) return null;
    const lats = provinceCities.map((c) => c.center[0]);
    const lngs = provinceCities.map((c) => c.center[1]);
    return L.latLngBounds([Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]);
  }, [selectedProvince, provinceCities]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value === 'all' ? null : value);
    setSelectedCityName('all');
  };

  // Titik tengah gabungan Indonesia dipakai saat tab "Semua Kota" aktif
  const overviewCenter: [number, number] = [-2.5, 117.5];
  const overviewZoom = 5;

  const visibleReports = useMemo(() => {
    const provinceCityNames = selectedProvince ? new Set(provinceCities.map((c) => c.name)) : null;
    return reports.filter((r) => {
      if (mapStatusFilter !== 'all' && r.status !== mapStatusFilter) return false;
      if (selectedCityName !== 'all') {
        if (r.city !== selectedCityName) return false;
      } else if (provinceCityNames) {
        if (!provinceCityNames.has(r.city)) return false;
      }
      if (typeof r.lat !== 'number' || typeof r.lng !== 'number') return false;
      return true;
    });
  }, [reports, mapStatusFilter, selectedCityName, selectedProvince, provinceCities]);

  const handlePickPoint = async (lat: number, lng: number) => {
    setIsLocating(true);
    const geo = await reverseGeocode(lat, lng);
    setIsLocating(false);

    if (!geo.isIndonesia) {
      alert(
        'Titik yang dipilih berada di luar wilayah Indonesia. LaporKota hanya menerima laporan untuk lokasi di dalam Indonesia — silakan pilih titik lain di peta.'
      );
      return;
    }

    setTempMarker({ lat, lng });
    const city = geo.cityGuess || (selectedCity ? selectedCity.name : findNearestCity(lat, lng).name);
    onCreateReportAt({ lat, lng, city, address: geo.address });
  };

  // Deteksi lokasi pengguna via GPS/browser lalu TAMPILKAN pin "ANDA DI SINI" di peta.
  // Tidak langsung lompat ke form — biar user sempat lihat posisinya dulu di peta,
  // baru lapor lewat popup pin ini kalau memang mau.
  const handleLocateMe = async () => {
    setIsGettingGeo(true);
    try {
      const { lat, lng } = await getCurrentPosition();
      const geo = await reverseGeocode(lat, lng);

      if (!geo.isIndonesia) {
        alert('Lokasi Anda terdeteksi di luar Indonesia. LaporKota hanya menerima laporan untuk lokasi di dalam Indonesia.');
        return;
      }

      const city = geo.cityGuess || findNearestCity(lat, lng).name;
      setMyLocation({ lat, lng, address: geo.address, city });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mendapatkan lokasi Anda.');
    } finally {
      setIsGettingGeo(false);
    }
  };

  const center: [number, number] = selectedCity
    ? selectedCity.center
    : singleProvinceCity
    ? singleProvinceCity.center
    : overviewCenter;
  const zoom = selectedCity ? selectedCity.zoom : singleProvinceCity ? singleProvinceCity.zoom : overviewZoom;
  const mapBounds = selectedCity
    ? undefined
    : provinceBounds
    ? provinceBounds
    : !selectedProvince && selectedCityName === 'all'
    ? INDONESIA_BOUNDS
    : undefined;

  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Toolbar: filter status, pilih kota, & CTA buat laporan */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap gap-3 items-center justify-between shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-xs sm:text-sm text-slate-900 flex items-center gap-1 uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> FILTER:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {(['all', 'baru', 'diproses', 'selesai'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setMapStatusFilter(f)}
                  className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs whitespace-nowrap uppercase font-bold cursor-pointer transition-all ${
                    mapStatusFilter === f
                      ? f === 'selesai'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {f === 'all' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              disabled={isGettingGeo}
              className="px-3 py-1.5 bg-white text-primary-700 border border-slate-200 rounded-lg font-label text-xs font-bold uppercase shadow-sm hover:bg-slate-100 flex items-center gap-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className={`material-symbols-outlined text-[15px] ${isGettingGeo ? 'animate-spin' : ''}`}>
                {isGettingGeo ? 'progress_activity' : 'my_location'}
              </span>
              {isGettingGeo ? 'Mencari...' : 'Lokasi Saya'}
            </button>

            <button
              onClick={() => onCreateReportAt(null)}
              className="px-3 py-1.5 bg-primary-600 text-white border border-primary-600 rounded-lg font-label text-xs font-bold uppercase shadow-sm hover:bg-primary-700 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add_location_alt</span>
              Buat Laporan
            </button>
          </div>
        </div>

        {/* Pemilih wilayah: dropdown Provinsi + dropdown Kota (kota mengikuti provinsi yang dipilih) */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-md flex flex-wrap items-center gap-2">
          <span className="font-label text-xs text-slate-900 uppercase font-bold tracking-wider shrink-0 pl-1">
            WILAYAH:
          </span>

          <div className="relative">
            <select
              value={selectedProvince ?? 'all'}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full border border-slate-200 bg-white font-label text-sm font-bold text-slate-900 cursor-pointer hover:bg-slate-50 focus:outline-none focus:border-primary-600 transition-colors min-w-[160px]"
            >
              <option value="all">Semua Provinsi</option>
              {PROVINCE_ORDER.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-500">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedCityName}
              onChange={(e) => setSelectedCityName(e.target.value)}
              disabled={!selectedProvince}
              className="appearance-none pl-4 pr-9 py-2 rounded-full border border-slate-200 bg-white font-label text-sm font-bold text-slate-900 cursor-pointer hover:bg-slate-50 focus:outline-none focus:border-primary-600 transition-colors min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">Semua Kota</option>
              {provinceCities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-500">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Full Map */}
      <div className="w-full flex-grow relative isolate" style={{ minHeight: '640px' }}>
        <div className="absolute top-3 left-3 z-[1000] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
          <span className="font-label text-xs font-medium text-slate-900">
            Peta Interaktif{' '}
            {selectedCityName !== 'all' ? selectedCityName : selectedProvince ? selectedProvince : 'Indonesia'} •{' '}
            {visibleReports.length} Titik Laporan
          </span>
        </div>

        <div className="absolute top-3 right-3 z-[1000] bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md max-w-[220px] hidden sm:block">
          <p className="font-label text-[11px] font-bold text-slate-900 uppercase mb-0.5">
            {isLocating ? 'Mencari alamat...' : 'Klik di peta'}
          </p>
          <p className="font-body text-[11px] text-slate-500">
            Klik titik mana pun di peta untuk langsung membuat laporan di lokasi itu.
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-slate-50 border border-slate-200 rounded-xl shadow-lg p-3 flex flex-col gap-1.5 max-w-[230px]">
          <div className="font-label text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-200 pb-1">
            KATEGORI
          </div>
          {LEGEND_ORDER.map((cat) => (
            <div key={cat} className="flex items-center gap-2 font-label text-[11px] text-slate-900 font-bold uppercase">
              <div
                className="w-3.5 h-3.5 rounded border-2 border-white shadow shrink-0"
                style={{ background: CATEGORY_STYLE[cat].color }}
              ></div>
              {CATEGORY_STYLE[cat].label}
            </div>
          ))}
        </div>

        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={5}
          maxBounds={INDONESIA_BOUNDS}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          scrollWheelZoom
          style={{ width: '100%', height: '100%', minHeight: '640px' }}
          className="cursor-crosshair"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />

          <FlyToCity center={center} zoom={zoom} bounds={mapBounds} />
          <ClickToReport onPick={handlePickPoint} />
          <FlyToPoint point={myLocation} />

          {tempMarker && <Marker position={[tempMarker.lat, tempMarker.lng]} icon={tempMarkerIcon} />}

          {myLocation && (
            <Marker position={[myLocation.lat, myLocation.lng]} icon={myLocationMarkerIcon}>
              <Popup>
                <div className="flex flex-col gap-1 w-[200px]">
                  <span className="font-bold text-xs text-blue-600">📍 Anda di sini</span>
                  <span className="text-[11px] text-slate-500">{myLocation.address}</span>
                  <button
                    onClick={() =>
                      onCreateReportAt({
                        lat: myLocation.lat,
                        lng: myLocation.lng,
                        city: myLocation.city,
                        address: myLocation.address,
                      })
                    }
                    className="mt-1 bg-primary-600 text-white text-[11px] font-bold uppercase rounded px-2 py-1"
                  >
                    Buat Laporan di Sini
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {visibleReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={buildMarkerIcon(report.category)}
              eventHandlers={{ click: () => onSelectReport(report) }}
            >
              <Popup>
                <div className="flex flex-col gap-1 w-[180px]">
                  <img src={report.imageUrl} alt={report.title} className="w-full h-20 object-cover rounded mb-1" />
                  <span className="font-bold text-xs">{report.title}</span>
                  <span className="text-[11px] text-slate-500">{report.location}</span>
                  <button
                    onClick={() => onSelectReport(report)}
                    className="mt-1 bg-primary-600 text-white text-[11px] font-bold uppercase rounded px-2 py-1"
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
